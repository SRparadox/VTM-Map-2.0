using System.Collections.Generic;
using UnityEngine;
using OSM;
using VTM;

namespace Map
{
    /// <summary>
    /// Generates 3D buildings from OpenStreetMap data
    /// </summary>
    public class BuildingGenerator : MonoBehaviour
    {
        [Header("Building Generation Settings")]
        [SerializeField] private Material defaultBuildingMaterial;
        [SerializeField] private Material[] clanMaterials;
        [SerializeField] private float minBuildingSize = 5f;
        [SerializeField] private float maxBuildingHeight = 200f;
        [SerializeField] private bool generateColliders = true;
        
        [Header("Visual Settings")]
        [SerializeField] private Color neutralBuildingColor = Color.gray;
        [SerializeField] private float buildingOpacity = 0.8f;
        
        private Dictionary<string, GameObject> generatedBuildings;
        private Transform buildingsParent;
        
        public static BuildingGenerator Instance { get; private set; }
        
        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                generatedBuildings = new Dictionary<string, GameObject>();
                
                // Create parent object for organization
                buildingsParent = new GameObject("Generated Buildings").transform;
                buildingsParent.SetParent(transform);
            }
            else
            {
                Destroy(gameObject);
            }
        }
        
        /// <summary>
        /// Generate all buildings from OSM city data
        /// </summary>
        public void GenerateBuildings(OSMCityData cityData)
        {
            Debug.Log($"Generating {cityData.buildings.Count} buildings for {cityData.cityName}");
            
            int successCount = 0;
            int skipCount = 0;
            
            foreach (var osmBuilding in cityData.buildings)
            {
                try
                {
                    var buildingObj = GenerateBuilding(osmBuilding, cityData.centerPoint);
                    if (buildingObj != null)
                    {
                        successCount++;
                        
                        // Register with territory manager
                        string territoryId = $"building_{osmBuilding.id}";
                        var territoryType = OSMUtilities.GetVTMTerritoryType(osmBuilding);
                        TerritoryManager.Instance?.RegisterTerritory(territoryId, buildingObj.transform.position, territoryType);
                        
                        // Store reference
                        generatedBuildings[territoryId] = buildingObj;
                    }
                    else
                    {
                        skipCount++;
                    }
                }
                catch (System.Exception e)
                {
                    Debug.LogWarning($"Failed to generate building {osmBuilding.id}: {e.Message}");
                    skipCount++;
                }
            }
            
            Debug.Log($"Building generation complete: {successCount} created, {skipCount} skipped");
        }
        
        /// <summary>
        /// Generate a single building from OSM data
        /// </summary>
        private GameObject GenerateBuilding(OSMBuilding osmBuilding, GeoCoordinate referencePoint)
        {
            // Skip if building is too small or has no coordinates
            if (osmBuilding.coordinates.Count < 3)
                return null;
                
            var bounds = osmBuilding.GetBounds(referencePoint);
            if (bounds.size.x < minBuildingSize || bounds.size.z < minBuildingSize)
                return null;
            
            // Calculate building properties
            float height = Mathf.Clamp(OSMUtilities.EstimateBuildingHeight(osmBuilding), 3f, maxBuildingHeight);
            Vector3 center = osmBuilding.GetCenterPosition(referencePoint);
            Vector3 size = new Vector3(bounds.size.x, height, bounds.size.z);
            
            // Create building GameObject
            GameObject buildingObj = new GameObject($"Building_{osmBuilding.id}");
            buildingObj.transform.SetParent(buildingsParent);
            buildingObj.transform.position = center + Vector3.up * (height / 2f);
            
            // Add mesh components
            var meshFilter = buildingObj.AddComponent<MeshFilter>();
            var meshRenderer = buildingObj.AddComponent<MeshRenderer>();
            
            // Generate mesh
            meshFilter.mesh = GenerateBuildingMesh(size);
            
            // Set material
            meshRenderer.material = GetBuildingMaterial(osmBuilding);
            
            // Add collider for interaction
            if (generateColliders)
            {
                var collider = buildingObj.AddComponent<BoxCollider>();
                collider.size = size;
            }
            
            // Add building component for interaction
            var buildingComponent = buildingObj.AddComponent<BuildingInteraction>();
            buildingComponent.Initialize(osmBuilding, $"building_{osmBuilding.id}");
            
            return buildingObj;
        }
        
        /// <summary>
        /// Generate a simple box mesh for the building
        /// </summary>
        private Mesh GenerateBuildingMesh(Vector3 size)
        {
            Mesh mesh = new Mesh();
            
            // Simple box vertices
            Vector3[] vertices = new Vector3[8];
            Vector3 halfSize = size / 2f;
            
            // Bottom vertices
            vertices[0] = new Vector3(-halfSize.x, -halfSize.y, -halfSize.z);
            vertices[1] = new Vector3(halfSize.x, -halfSize.y, -halfSize.z);
            vertices[2] = new Vector3(halfSize.x, -halfSize.y, halfSize.z);
            vertices[3] = new Vector3(-halfSize.x, -halfSize.y, halfSize.z);
            
            // Top vertices
            vertices[4] = new Vector3(-halfSize.x, halfSize.y, -halfSize.z);
            vertices[5] = new Vector3(halfSize.x, halfSize.y, -halfSize.z);
            vertices[6] = new Vector3(halfSize.x, halfSize.y, halfSize.z);
            vertices[7] = new Vector3(-halfSize.x, halfSize.y, halfSize.z);
            
            // Triangles for box faces
            int[] triangles = new int[]
            {
                // Bottom
                0, 1, 2, 0, 2, 3,
                // Top
                4, 6, 5, 4, 7, 6,
                // Front
                0, 4, 5, 0, 5, 1,
                // Back
                2, 6, 7, 2, 7, 3,
                // Left
                0, 3, 7, 0, 7, 4,
                // Right
                1, 5, 6, 1, 6, 2
            };
            
            // Simple UV mapping
            Vector2[] uvs = new Vector2[8];
            for (int i = 0; i < 8; i++)
            {
                uvs[i] = new Vector2(vertices[i].x, vertices[i].z);
            }
            
            mesh.vertices = vertices;
            mesh.triangles = triangles;
            mesh.uv = uvs;
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            
            return mesh;
        }
        
        /// <summary>
        /// Get appropriate material for building based on type
        /// </summary>
        private Material GetBuildingMaterial(OSMBuilding building)
        {
            if (defaultBuildingMaterial == null)
            {
                // Create default material if none assigned
                defaultBuildingMaterial = new Material(Shader.Find("Standard"));
                defaultBuildingMaterial.color = neutralBuildingColor;
            }
            
            // Return copy of material so we can modify color per building
            var material = new Material(defaultBuildingMaterial);
            
            // Set color based on building type
            var territoryType = OSMUtilities.GetVTMTerritoryType(building);
            switch (territoryType)
            {
                case TerritoryType.FeedingGround:
                    material.color = new Color(0.8f, 0.4f, 0.4f, buildingOpacity); // Reddish
                    break;
                case TerritoryType.Haven:
                    material.color = new Color(0.4f, 0.6f, 0.4f, buildingOpacity); // Greenish
                    break;
                case TerritoryType.Influence:
                    material.color = new Color(0.4f, 0.4f, 0.8f, buildingOpacity); // Bluish
                    break;
                case TerritoryType.Elysium:
                    material.color = new Color(0.8f, 0.6f, 0.4f, buildingOpacity); // Goldish
                    break;
                default:
                    material.color = new Color(neutralBuildingColor.r, neutralBuildingColor.g, neutralBuildingColor.b, buildingOpacity);
                    break;
            }
            
            return material;
        }
        
        /// <summary>
        /// Update building material when territory is claimed/released
        /// </summary>
        public void UpdateBuildingClan(string territoryId, string clanName)
        {
            if (generatedBuildings.ContainsKey(territoryId))
            {
                var buildingObj = generatedBuildings[territoryId];
                var renderer = buildingObj.GetComponent<MeshRenderer>();
                
                if (renderer != null)
                {
                    var material = new Material(renderer.material);
                    
                    if (string.IsNullOrEmpty(clanName))
                    {
                        // Reset to neutral
                        material.color = new Color(neutralBuildingColor.r, neutralBuildingColor.g, neutralBuildingColor.b, buildingOpacity);
                    }
                    else
                    {
                        // Set clan color
                        var clanColor = ClanManager.GetClanColor(clanName);
                        material.color = new Color(clanColor.r, clanColor.g, clanColor.b, buildingOpacity);
                    }
                    
                    renderer.material = material;
                }
            }
        }
        
        /// <summary>
        /// Clear all generated buildings
        /// </summary>
        public void ClearBuildings()
        {
            foreach (var building in generatedBuildings.Values)
            {
                if (building != null)
                    DestroyImmediate(building);
            }
            generatedBuildings.Clear();
        }
    }
}
