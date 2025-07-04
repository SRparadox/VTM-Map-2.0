using System;
using System.Collections.Generic;
using UnityEngine;
using System.Collections;

namespace OSM
{
    /// <summary>
    /// Represents a geographic coordinate (latitude, longitude)
    /// </summary>
    [Serializable]
    public struct GeoCoordinate
    {
        public float lat;
        public float lon;
        
        public GeoCoordinate(float latitude, float longitude)
        {
            lat = latitude;
            lon = longitude;
        }
        
        public Vector2 ToVector2()
        {
            return new Vector2(lon, lat);
        }
    }

    /// <summary>
    /// Represents a building from OpenStreetMap data
    /// </summary>
    [Serializable]
    public class OSMBuilding
    {
        public long id;
        public List<GeoCoordinate> coordinates;
        public Dictionary<string, string> tags;
        public string buildingType;
        public float height;
        public int levels;
        
        public OSMBuilding()
        {
            coordinates = new List<GeoCoordinate>();
            tags = new Dictionary<string, string>();
        }
        
        public Vector3 GetCenterPosition(GeoCoordinate referencePoint)
        {
            if (coordinates.Count == 0) return Vector3.zero;
            
            float sumLat = 0f, sumLon = 0f;
            foreach (var coord in coordinates)
            {
                sumLat += coord.lat;
                sumLon += coord.lon;
            }
            
            var center = new GeoCoordinate(sumLat / coordinates.Count, sumLon / coordinates.Count);
            return OSMUtilities.GeoToWorldPosition(center, referencePoint);
        }
        
        public Bounds GetBounds(GeoCoordinate referencePoint)
        {
            if (coordinates.Count == 0) return new Bounds();
            
            var worldPositions = new List<Vector3>();
            foreach (var coord in coordinates)
            {
                worldPositions.Add(OSMUtilities.GeoToWorldPosition(coord, referencePoint));
            }
            
            var bounds = new Bounds(worldPositions[0], Vector3.zero);
            foreach (var pos in worldPositions)
            {
                bounds.Encapsulate(pos);
            }
            
            return bounds;
        }
    }

    /// <summary>
    /// Represents a road from OpenStreetMap data
    /// </summary>
    [Serializable]
    public class OSMRoad
    {
        public long id;
        public List<GeoCoordinate> coordinates;
        public Dictionary<string, string> tags;
        public string roadType;
        public float width;
        
        public OSMRoad()
        {
            coordinates = new List<GeoCoordinate>();
            tags = new Dictionary<string, string>();
        }
    }

    /// <summary>
    /// Represents an amenity or point of interest from OpenStreetMap
    /// </summary>
    [Serializable]
    public class OSMAmenity
    {
        public long id;
        public GeoCoordinate coordinate;
        public Dictionary<string, string> tags;
        public string amenityType;
        public string name;
        
        public OSMAmenity()
        {
            tags = new Dictionary<string, string>();
        }
    }

    /// <summary>
    /// Container for all OSM data for a city
    /// </summary>
    [Serializable]
    public class OSMCityData
    {
        public string cityName;
        public GeoCoordinate centerPoint;
        public GeoCoordinate southWest;
        public GeoCoordinate northEast;
        public List<OSMBuilding> buildings;
        public List<OSMRoad> roads;
        public List<OSMAmenity> amenities;
        public DateTime extractedAt;
        
        public OSMCityData()
        {
            buildings = new List<OSMBuilding>();
            roads = new List<OSMRoad>();
            amenities = new List<OSMAmenity>();
        }
    }

    /// <summary>
    /// Utility functions for working with OSM data
    /// </summary>
    public static class OSMUtilities
    {
        private const float EARTH_RADIUS = 6371000f; // Earth radius in meters
        
        /// <summary>
        /// Convert geographic coordinates to Unity world position
        /// </summary>
        public static Vector3 GeoToWorldPosition(GeoCoordinate geoCoord, GeoCoordinate referencePoint)
        {
            // Convert lat/lon difference to meters using Mercator projection
            float lat1 = referencePoint.lat * Mathf.Deg2Rad;
            float lat2 = geoCoord.lat * Mathf.Deg2Rad;
            float deltaLon = (geoCoord.lon - referencePoint.lon) * Mathf.Deg2Rad;
            
            float x = deltaLon * Mathf.Cos((lat1 + lat2) / 2) * EARTH_RADIUS;
            float z = (lat2 - lat1) * EARTH_RADIUS;
            
            return new Vector3(x, 0, z);
        }
        
        /// <summary>
        /// Convert Unity world position back to geographic coordinates
        /// </summary>
        public static GeoCoordinate WorldToGeoPosition(Vector3 worldPos, GeoCoordinate referencePoint)
        {
            float lat1 = referencePoint.lat * Mathf.Deg2Rad;
            
            float deltaLat = worldPos.z / EARTH_RADIUS;
            float deltaLon = worldPos.x / (EARTH_RADIUS * Mathf.Cos(lat1 + deltaLat / 2));
            
            float lat = referencePoint.lat + deltaLat * Mathf.Rad2Deg;
            float lon = referencePoint.lon + deltaLon * Mathf.Rad2Deg;
            
            return new GeoCoordinate(lat, lon);
        }
        
        /// <summary>
        /// Calculate distance between two geographic points in meters
        /// </summary>
        public static float CalculateDistance(GeoCoordinate point1, GeoCoordinate point2)
        {
            float lat1 = point1.lat * Mathf.Deg2Rad;
            float lat2 = point2.lat * Mathf.Deg2Rad;
            float deltaLat = (point2.lat - point1.lat) * Mathf.Deg2Rad;
            float deltaLon = (point2.lon - point1.lon) * Mathf.Deg2Rad;
            
            float a = Mathf.Sin(deltaLat / 2) * Mathf.Sin(deltaLat / 2) +
                     Mathf.Cos(lat1) * Mathf.Cos(lat2) *
                     Mathf.Sin(deltaLon / 2) * Mathf.Sin(deltaLon / 2);
            float c = 2 * Mathf.Atan2(Mathf.Sqrt(a), Mathf.Sqrt(1 - a));
            
            return EARTH_RADIUS * c;
        }
        
        /// <summary>
        /// Estimate building height from OSM tags
        /// </summary>
        public static float EstimateBuildingHeight(OSMBuilding building)
        {
            // Check for explicit height tag
            if (building.tags.ContainsKey("height"))
            {
                if (float.TryParse(building.tags["height"], out float height))
                {
                    return height;
                }
            }
            
            // Check for building levels
            if (building.tags.ContainsKey("building:levels"))
            {
                if (int.TryParse(building.tags["building:levels"], out int levels))
                {
                    return levels * 3.5f; // Assume 3.5m per floor
                }
            }
            
            // Estimate based on building type
            string buildingType = building.buildingType?.ToLower() ?? "residential";
            switch (buildingType)
            {
                case "hospital": return 25f;
                case "university": case "school": return 20f;
                case "commercial": case "retail": return 15f;
                case "industrial": return 12f;
                case "government": return 30f;
                case "religious": return 18f;
                case "apartments": return 25f;
                case "house": case "residential": return 8f;
                default: return 10f;
            }
        }
        
        /// <summary>
        /// Get road width based on OSM highway type
        /// </summary>
        public static float GetRoadWidth(string highwayType)
        {
            switch (highwayType?.ToLower())
            {
                case "motorway": return 15f;
                case "trunk": return 12f;
                case "primary": return 10f;
                case "secondary": return 8f;
                case "tertiary": return 6f;
                case "residential": return 4f;
                case "service": return 3f;
                case "footway": case "path": return 1.5f;
                default: return 5f;
            }
        }
        
        /// <summary>
        /// Determine VTM-relevant building category
        /// </summary>
        public static VTM.TerritoryType GetVTMTerritoryType(OSMBuilding building)
        {
            string buildingType = building.buildingType?.ToLower() ?? "";
            
            // Check amenity tags
            if (building.tags.ContainsKey("amenity"))
            {
                string amenity = building.tags["amenity"].ToLower();
                switch (amenity)
                {
                    case "bar": case "pub": case "nightclub": case "restaurant":
                        return VTM.TerritoryType.FeedingGround;
                    case "hospital": case "police": case "fire_station":
                        return VTM.TerritoryType.Influence;
                    case "theatre": case "cinema": case "museum": case "library":
                        return VTM.TerritoryType.Elysium;
                    default:
                        return VTM.TerritoryType.Neutral;
                }
            }
            
            // Check building type
            switch (buildingType)
            {
                case "commercial": case "retail":
                    return VTM.TerritoryType.FeedingGround;
                case "government": case "office":
                    return VTM.TerritoryType.Influence;
                case "residential": case "apartments":
                    return VTM.TerritoryType.Haven;
                case "industrial": case "warehouse":
                    return VTM.TerritoryType.Haven;
                default:
                    return VTM.TerritoryType.Neutral;
            }
        }
    }
}
