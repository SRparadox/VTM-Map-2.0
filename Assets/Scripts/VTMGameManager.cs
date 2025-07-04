using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using OSM;
using VTM;
using Map;

/// <summary>
/// Main game manager for the VTM Territory Mapping system
/// </summary>
public class VTMGameManager : MonoBehaviour
{
    [Header("Game Settings")]
    [SerializeField] private string selectedClan;
    [SerializeField] private OSMCityData currentCityData;
    
    [Header("UI References")]
    [SerializeField] private GameObject clanSelectionPanel;
    [SerializeField] private GameObject buildingInfoPanel;
    [SerializeField] private Text buildingInfoText;
    [SerializeField] private Text statusText;
    [SerializeField] private Text territoryStatsText;
    
    [Header("Camera")]
    [SerializeField] private Camera mainCamera;
    [SerializeField] private CameraController cameraController;
    
    [Header("Data Loading")]
    [SerializeField] private string osmDataPath = "santa-cruz-processed";
    [SerializeField] private bool loadSampleData = true;
    
    public static VTMGameManager Instance { get; private set; }
    
    public string SelectedClan => selectedClan;
    public OSMCityData CurrentCityData => currentCityData;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
            return;
        }
        
        // Initialize camera if not assigned
        if (mainCamera == null)
            mainCamera = Camera.main;
            
        if (cameraController == null)
            cameraController = FindObjectOfType<CameraController>();
    }
    
    private void Start()
    {
        InitializeGame();
    }
    
    private void InitializeGame()
    {
        Debug.Log("Initializing VTM Territory Mapping System...");
        
        // Update status
        UpdateStatusText("Initializing VTM Territory System...");
        
        // Initialize UI
        InitializeUI();
        
        // Load city data
        StartCoroutine(LoadCityData());
    }
    
    private void InitializeUI()
    {
        // Create clan selection buttons
        CreateClanSelectionUI();
        
        // Hide building info initially
        if (buildingInfoPanel != null)
            buildingInfoPanel.SetActive(false);
            
        // Update territory stats
        UpdateTerritoryStats();
    }
    
    private void CreateClanSelectionUI()
    {
        if (clanSelectionPanel == null) return;
        
        var clanNames = ClanManager.GetAllClanNames();
        
        foreach (var clanName in clanNames)
        {
            var clan = ClanManager.GetClan(clanName);
            
            // Create clan button (this would normally be done in the UI system)
            Debug.Log($"Clan available for selection: {clanName} - {clan.description}");
        }
    }
    
    private IEnumerator LoadCityData()
    {
        UpdateStatusText("Loading city data...");
        
        if (loadSampleData)
        {
            // Create sample data for testing
            currentCityData = CreateSampleCityData();
            yield return null;
        }
        else
        {
            // Try to load real OSM data
            yield return StartCoroutine(LoadOSMData());
        }
        
        if (currentCityData != null)
        {
            GenerateCity();
        }
        else
        {
            Debug.LogError("Failed to load city data");
            UpdateStatusText("Failed to load city data");
        }
    }
    
    private IEnumerator LoadOSMData()
    {
        // This would load from the StreamingAssets folder or Resources
        string dataPath = System.IO.Path.Combine(Application.streamingAssetsPath, osmDataPath + ".json");
        
        if (System.IO.File.Exists(dataPath))
        {
            try
            {
                string jsonData = System.IO.File.ReadAllText(dataPath);
                currentCityData = JsonUtility.FromJson<OSMCityData>(jsonData);
                Debug.Log($"Loaded OSM data: {currentCityData.buildings.Count} buildings");
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Failed to load OSM data: {e.Message}");
                currentCityData = CreateSampleCityData();
            }
        }
        else
        {
            Debug.LogWarning("OSM data file not found, using sample data");
            currentCityData = CreateSampleCityData();
        }
        
        yield return null;
    }
    
    private OSMCityData CreateSampleCityData()
    {
        Debug.Log("Creating sample city data...");
        
        var cityData = new OSMCityData
        {
            cityName = "Sample City",
            centerPoint = new GeoCoordinate(36.9741f, -122.0308f), // Santa Cruz center
            southWest = new GeoCoordinate(36.94f, -122.07f),
            northEast = new GeoCoordinate(37.01f, -121.98f)
        };
        
        // Create sample buildings in a grid pattern
        for (int x = -5; x <= 5; x++)
        {
            for (int z = -5; z <= 5; z++)
            {
                if (x == 0 && z == 0) continue; // Skip center
                
                var building = new OSMBuilding
                {
                    id = (x + 5) * 11 + (z + 5),
                    buildingType = GetRandomBuildingType(),
                    height = Random.Range(10f, 50f)
                };
                
                // Create simple rectangular building coordinates
                float offsetLat = x * 0.001f;
                float offsetLon = z * 0.001f;
                float size = 0.0002f;
                
                building.coordinates.Add(new GeoCoordinate(cityData.centerPoint.lat + offsetLat - size, cityData.centerPoint.lon + offsetLon - size));
                building.coordinates.Add(new GeoCoordinate(cityData.centerPoint.lat + offsetLat + size, cityData.centerPoint.lon + offsetLon - size));
                building.coordinates.Add(new GeoCoordinate(cityData.centerPoint.lat + offsetLat + size, cityData.centerPoint.lon + offsetLon + size));
                building.coordinates.Add(new GeoCoordinate(cityData.centerPoint.lat + offsetLat - size, cityData.centerPoint.lon + offsetLon + size));
                
                cityData.buildings.Add(building);
            }
        }
        
        Debug.Log($"Created {cityData.buildings.Count} sample buildings");
        return cityData;
    }
    
    private string GetRandomBuildingType()
    {
        string[] types = { "residential", "commercial", "office", "industrial", "hospital", "school", "religious" };
        return types[Random.Range(0, types.Length)];
    }
    
    private void GenerateCity()
    {
        UpdateStatusText("Generating 3D city...");
        
        // Generate buildings
        var buildingGenerator = BuildingGenerator.Instance;
        if (buildingGenerator != null)
        {
            buildingGenerator.GenerateBuildings(currentCityData);
        }
        else
        {
            Debug.LogError("BuildingGenerator not found in scene");
        }
        
        // Position camera to view the city
        PositionCameraForCity();
        
        UpdateStatusText($"City loaded: {currentCityData.buildings.Count} buildings");
        UpdateTerritoryStats();
    }
    
    private void PositionCameraForCity()
    {
        if (mainCamera == null || currentCityData == null) return;
        
        // Calculate city bounds
        var centerWorld = OSMUtilities.GeoToWorldPosition(currentCityData.centerPoint, currentCityData.centerPoint);
        var swWorld = OSMUtilities.GeoToWorldPosition(currentCityData.southWest, currentCityData.centerPoint);
        var neWorld = OSMUtilities.GeoToWorldPosition(currentCityData.northEast, currentCityData.centerPoint);
        
        float cityWidth = Mathf.Abs(neWorld.x - swWorld.x);
        float cityHeight = Mathf.Abs(neWorld.z - swWorld.z);
        float maxDimension = Mathf.Max(cityWidth, cityHeight);
        
        // Position camera above and back from city center
        Vector3 cameraPosition = centerWorld + new Vector3(0, maxDimension * 0.8f, maxDimension * 0.6f);
        mainCamera.transform.position = cameraPosition;
        mainCamera.transform.LookAt(centerWorld);
        
        Debug.Log($"Camera positioned at {cameraPosition} looking at {centerWorld}");
    }
    
    public void SelectClan(string clanName)
    {
        if (ClanManager.GetClan(clanName) != null)
        {
            selectedClan = clanName;
            var clan = ClanManager.GetClan(clanName);
            UpdateStatusText($"{clanName} selected - Click buildings to claim territory");
            Debug.Log($"Selected clan: {clanName} - {clan.description}");
        }
    }
    
    public void OnBuildingClicked(BuildingInteraction building)
    {
        if (string.IsNullOrEmpty(selectedClan))
        {
            UpdateStatusText("Please select a clan first!");
            return;
        }
        
        var territory = TerritoryManager.Instance?.GetTerritory(building.TerritoryId);
        
        if (territory != null)
        {
            if (string.IsNullOrEmpty(territory.clanOwner))
            {
                // Claim territory
                TerritoryManager.Instance.ClaimTerritory(building.TerritoryId, selectedClan);
                UpdateStatusText($"Territory claimed for {selectedClan}");
            }
            else if (territory.clanOwner == selectedClan)
            {
                UpdateStatusText($"Territory already belongs to {selectedClan}");
            }
            else
            {
                UpdateStatusText($"Territory belongs to {territory.clanOwner} - Right-click to contest");
            }
            
            UpdateTerritoryStats();
        }
    }
    
    public void OnBuildingRightClicked(BuildingInteraction building)
    {
        var territory = TerritoryManager.Instance?.GetTerritory(building.TerritoryId);
        
        if (territory != null && !string.IsNullOrEmpty(territory.clanOwner))
        {
            // Release territory
            TerritoryManager.Instance.ReleaseTerritory(building.TerritoryId);
            UpdateStatusText($"Territory released from {territory.clanOwner}");
            UpdateTerritoryStats();
        }
    }
    
    public void ShowBuildingInfo(BuildingInteraction building)
    {
        if (buildingInfoPanel != null && buildingInfoText != null)
        {
            buildingInfoPanel.SetActive(true);
            buildingInfoText.text = building.GetBuildingInfoText();
        }
    }
    
    public void HideBuildingInfo()
    {
        if (buildingInfoPanel != null)
        {
            buildingInfoPanel.SetActive(false);
        }
    }
    
    private void UpdateStatusText(string message)
    {
        if (statusText != null)
            statusText.text = message;
        Debug.Log($"Status: {message}");
    }
    
    private void UpdateTerritoryStats()
    {
        if (territoryStatsText == null || TerritoryManager.Instance == null) return;
        
        var stats = TerritoryManager.Instance.GetTerritoryStats();
        string statsText = "Territory Control:\n";
        
        foreach (var kvp in stats)
        {
            if (kvp.Value > 0)
            {
                statsText += $"{kvp.Key}: {kvp.Value}\n";
            }
        }
        
        territoryStatsText.text = statsText;
    }
    
    private void Update()
    {
        // Handle keyboard shortcuts
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            selectedClan = null;
            UpdateStatusText("Clan selection cleared");
        }
        
        // Handle number keys for clan selection
        if (Input.GetKeyDown(KeyCode.Alpha1)) SelectClan("Ventrue");
        if (Input.GetKeyDown(KeyCode.Alpha2)) SelectClan("Toreador");
        if (Input.GetKeyDown(KeyCode.Alpha3)) SelectClan("Brujah");
        if (Input.GetKeyDown(KeyCode.Alpha4)) SelectClan("Malkavian");
        if (Input.GetKeyDown(KeyCode.Alpha5)) SelectClan("Nosferatu");
        if (Input.GetKeyDown(KeyCode.Alpha6)) SelectClan("Gangrel");
        if (Input.GetKeyDown(KeyCode.Alpha7)) SelectClan("Tremere");
    }
}
