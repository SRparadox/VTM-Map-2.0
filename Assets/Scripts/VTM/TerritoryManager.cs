using System;
using System.Collections.Generic;
using UnityEngine;

namespace VTM
{
    /// <summary>
    /// Represents a territory that can be claimed by vampire clans
    /// </summary>
    [Serializable]
    public class Territory
    {
        public string id;
        public string clanOwner;
        public Vector3 position;
        public TerritoryType type;
        public float influence;
        public DateTime claimedDate;
        public string buildingType;
        public Dictionary<string, object> metadata;
        
        public Territory(string id, Vector3 position, TerritoryType type = TerritoryType.Neutral)
        {
            this.id = id;
            this.position = position;
            this.type = type;
            this.influence = 0f;
            this.metadata = new Dictionary<string, object>();
        }
        
        public void ClaimForClan(string clanName)
        {
            clanOwner = clanName;
            claimedDate = DateTime.Now;
            type = GetTerritoryTypeForClan(clanName);
        }
        
        public void ReleaseClaim()
        {
            clanOwner = null;
            type = TerritoryType.Neutral;
            influence = 0f;
        }
        
        private TerritoryType GetTerritoryTypeForClan(string clanName)
        {
            // Different clans prefer different territory types
            switch (clanName?.ToLower())
            {
                case "ventrue": return TerritoryType.Influence;
                case "toreador": return TerritoryType.Elysium;
                case "brujah": return TerritoryType.FeedingGround;
                case "nosferatu": return TerritoryType.Haven;
                case "gangrel": return TerritoryType.Contested;
                case "tremere": return TerritoryType.Haven;
                case "malkavian": return TerritoryType.Contested;
                default: return TerritoryType.Neutral;
            }
        }
    }

    /// <summary>
    /// Types of territories in VTM
    /// </summary>
    public enum TerritoryType
    {
        Neutral,        // Unclaimed territory
        FeedingGround,  // Bars, clubs, entertainment venues
        Haven,          // Safe houses, residential areas
        Influence,      // Government, corporate, media buildings
        Elysium,        // Museums, theaters, cultural sites
        Contested       // Disputed or dangerous areas
    }

    /// <summary>
    /// Manages all territories in the city
    /// </summary>
    public class TerritoryManager : MonoBehaviour
    {
        [SerializeField] private Dictionary<string, Territory> territories;
        [SerializeField] private Material[] territoryMaterials;
        
        public static TerritoryManager Instance { get; private set; }
        
        public event Action<Territory> OnTerritoryClaimedEvent;
        public event Action<Territory> OnTerritoryReleasedEvent;
        
        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                territories = new Dictionary<string, Territory>();
            }
            else
            {
                Destroy(gameObject);
            }
        }
        
        public void RegisterTerritory(string id, Vector3 position, TerritoryType type = TerritoryType.Neutral)
        {
            if (!territories.ContainsKey(id))
            {
                territories[id] = new Territory(id, position, type);
            }
        }
        
        public bool ClaimTerritory(string territoryId, string clanName)
        {
            if (territories.ContainsKey(territoryId))
            {
                var territory = territories[territoryId];
                territory.ClaimForClan(clanName);
                OnTerritoryClaimedEvent?.Invoke(territory);
                
                Debug.Log($"Territory {territoryId} claimed by {clanName}");
                return true;
            }
            return false;
        }
        
        public bool ReleaseTerritory(string territoryId)
        {
            if (territories.ContainsKey(territoryId))
            {
                var territory = territories[territoryId];
                territory.ReleaseClaim();
                OnTerritoryReleasedEvent?.Invoke(territory);
                
                Debug.Log($"Territory {territoryId} released");
                return true;
            }
            return false;
        }
        
        public Territory GetTerritory(string territoryId)
        {
            return territories.ContainsKey(territoryId) ? territories[territoryId] : null;
        }
        
        public List<Territory> GetTerritoriesForClan(string clanName)
        {
            var clanTerritories = new List<Territory>();
            foreach (var territory in territories.Values)
            {
                if (territory.clanOwner == clanName)
                {
                    clanTerritories.Add(territory);
                }
            }
            return clanTerritories;
        }
        
        public Dictionary<string, int> GetTerritoryStats()
        {
            var stats = new Dictionary<string, int>();
            var clanNames = ClanManager.GetAllClanNames();
            
            foreach (var clanName in clanNames)
            {
                stats[clanName] = 0;
            }
            stats["Neutral"] = 0;
            
            foreach (var territory in territories.Values)
            {
                if (string.IsNullOrEmpty(territory.clanOwner))
                {
                    stats["Neutral"]++;
                }
                else if (stats.ContainsKey(territory.clanOwner))
                {
                    stats[territory.clanOwner]++;
                }
            }
            
            return stats;
        }
        
        public void SaveTerritoriesToFile(string filePath)
        {
            try
            {
                var json = JsonUtility.ToJson(new SerializableTerritoriesList(territories));
                System.IO.File.WriteAllText(filePath, json);
                Debug.Log($"Territories saved to {filePath}");
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to save territories: {e.Message}");
            }
        }
        
        public void LoadTerritoriesFromFile(string filePath)
        {
            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    var json = System.IO.File.ReadAllText(filePath);
                    var territoryList = JsonUtility.FromJson<SerializableTerritoriesList>(json);
                    territories = territoryList.ToDictionary();
                    Debug.Log($"Territories loaded from {filePath}");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to load territories: {e.Message}");
            }
        }
    }

    /// <summary>
    /// Helper class for JSON serialization of territories
    /// </summary>
    [Serializable]
    public class SerializableTerritoriesList
    {
        public List<Territory> territories;
        
        public SerializableTerritoriesList(Dictionary<string, Territory> territoryDict)
        {
            territories = new List<Territory>(territoryDict.Values);
        }
        
        public Dictionary<string, Territory> ToDictionary()
        {
            var dict = new Dictionary<string, Territory>();
            foreach (var territory in territories)
            {
                dict[territory.id] = territory;
            }
            return dict;
        }
    }
}
