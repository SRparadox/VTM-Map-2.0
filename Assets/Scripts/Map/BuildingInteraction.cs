using UnityEngine;
using OSM;
using VTM;

namespace Map
{
    /// <summary>
    /// Handles interaction with buildings for territory claiming
    /// </summary>
    public class BuildingInteraction : MonoBehaviour
    {
        [Header("Building Information")]
        [SerializeField] private string territoryId;
        [SerializeField] private string buildingType;
        [SerializeField] private TerritoryType vtmTerritoryType;
        
        [Header("Visual Feedback")]
        [SerializeField] private GameObject selectionIndicator;
        [SerializeField] private Color highlightColor = Color.yellow;
        
        private OSMBuilding osmData;
        private MeshRenderer meshRenderer;
        private Material originalMaterial;
        private Material highlightMaterial;
        private bool isHighlighted = false;
        
        public string TerritoryId => territoryId;
        public string BuildingType => buildingType;
        public TerritoryType VTMTerritoryType => vtmTerritoryType;
        public OSMBuilding OSMData => osmData;
        
        private void Awake()
        {
            meshRenderer = GetComponent<MeshRenderer>();
            if (meshRenderer != null)
            {
                originalMaterial = meshRenderer.material;
                CreateHighlightMaterial();
            }
        }
        
        public void Initialize(OSMBuilding osmBuilding, string territoryId)
        {
            this.osmData = osmBuilding;
            this.territoryId = territoryId;
            this.buildingType = osmBuilding.buildingType ?? "unknown";
            this.vtmTerritoryType = OSMUtilities.GetVTMTerritoryType(osmBuilding);
            
            // Set up name for easier identification
            gameObject.name = $"Building_{osmBuilding.id}_{buildingType}";
            
            // Subscribe to territory events
            if (TerritoryManager.Instance != null)
            {
                TerritoryManager.Instance.OnTerritoryClaimedEvent += OnTerritoryClaimedEvent;
                TerritoryManager.Instance.OnTerritoryReleasedEvent += OnTerritoryReleasedEvent;
            }
        }
        
        private void CreateHighlightMaterial()
        {
            if (originalMaterial != null)
            {
                highlightMaterial = new Material(originalMaterial);
                highlightMaterial.color = highlightColor;
                highlightMaterial.SetFloat("_Metallic", 0.5f);
                highlightMaterial.SetFloat("_Smoothness", 0.8f);
            }
        }
        
        private void OnMouseEnter()
        {
            if (!isHighlighted)
            {
                Highlight(true);
                
                // Show building info in UI
                var gameManager = FindObjectOfType<VTMGameManager>();
                if (gameManager != null)
                {
                    gameManager.ShowBuildingInfo(this);
                }
            }
        }
        
        private void OnMouseExit()
        {
            if (isHighlighted)
            {
                Highlight(false);
                
                // Hide building info in UI
                var gameManager = FindObjectOfType<VTMGameManager>();
                if (gameManager != null)
                {
                    gameManager.HideBuildingInfo();
                }
            }
        }
        
        private void OnMouseDown()
        {
            var gameManager = FindObjectOfType<VTMGameManager>();
            if (gameManager != null)
            {
                if (Input.GetMouseButtonDown(0)) // Left click
                {
                    gameManager.OnBuildingClicked(this);
                }
                else if (Input.GetMouseButtonDown(1)) // Right click
                {
                    gameManager.OnBuildingRightClicked(this);
                }
            }
        }
        
        public void Highlight(bool highlight)
        {
            if (meshRenderer == null) return;
            
            isHighlighted = highlight;
            
            if (highlight && highlightMaterial != null)
            {
                meshRenderer.material = highlightMaterial;
            }
            else if (originalMaterial != null)
            {
                meshRenderer.material = originalMaterial;
            }
        }
        
        public void SetClanColor(string clanName)
        {
            if (meshRenderer == null) return;
            
            var material = new Material(originalMaterial);
            
            if (string.IsNullOrEmpty(clanName))
            {
                // Reset to original color
                meshRenderer.material = originalMaterial;
            }
            else
            {
                // Set clan color
                var clanColor = ClanManager.GetClanColor(clanName);
                material.color = new Color(clanColor.r, clanColor.g, clanColor.b, 0.8f);
                meshRenderer.material = material;
            }
            
            // Update the original material reference
            if (!isHighlighted)
            {
                originalMaterial = meshRenderer.material;
            }
        }
        
        public string GetBuildingInfoText()
        {
            var territory = TerritoryManager.Instance?.GetTerritory(territoryId);
            string ownerText = territory?.clanOwner ?? "Unclaimed";
            
            return $"Building ID: {osmData?.id}\n" +
                   $"Type: {buildingType}\n" +
                   $"Territory Type: {vtmTerritoryType}\n" +
                   $"Owner: {ownerText}\n" +
                   $"Position: {transform.position:F1}";
        }
        
        private void OnTerritoryClaimedEvent(Territory territory)
        {
            if (territory.id == territoryId)
            {
                SetClanColor(territory.clanOwner);
                Debug.Log($"Building {territoryId} claimed by {territory.clanOwner}");
            }
        }
        
        private void OnTerritoryReleasedEvent(Territory territory)
        {
            if (territory.id == territoryId)
            {
                SetClanColor(null);
                Debug.Log($"Building {territoryId} released");
            }
        }
        
        private void OnDestroy()
        {
            // Unsubscribe from events
            if (TerritoryManager.Instance != null)
            {
                TerritoryManager.Instance.OnTerritoryClaimedEvent -= OnTerritoryClaimedEvent;
                TerritoryManager.Instance.OnTerritoryReleasedEvent -= OnTerritoryReleasedEvent;
            }
        }
        
        /// <summary>
        /// Get a detailed description of this building for UI display
        /// </summary>
        public BuildingDetails GetBuildingDetails()
        {
            var territory = TerritoryManager.Instance?.GetTerritory(territoryId);
            
            return new BuildingDetails
            {
                buildingId = osmData?.id.ToString() ?? "Unknown",
                territoryId = territoryId,
                buildingType = buildingType,
                territoryType = vtmTerritoryType,
                clanOwner = territory?.clanOwner,
                claimedDate = territory?.claimedDate,
                position = transform.position,
                osmTags = osmData?.tags
            };
        }
    }
    
    /// <summary>
    /// Data structure for building details
    /// </summary>
    [System.Serializable]
    public struct BuildingDetails
    {
        public string buildingId;
        public string territoryId;
        public string buildingType;
        public TerritoryType territoryType;
        public string clanOwner;
        public System.DateTime? claimedDate;
        public Vector3 position;
        public System.Collections.Generic.Dictionary<string, string> osmTags;
    }
}
