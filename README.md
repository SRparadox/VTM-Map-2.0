# VTM Territory Mapping System

A Unity 3D application for creating interactive Vampire: The Masquerade territory maps using real-world OpenStreetMap data.

## Overview

This Unity project allows Game Masters and players to visualize and manage vampire clan territories in real-world cities. Buildings and areas can be assigned to different clans, creating an immersive tool for VTM campaigns.

## Features

### ✅ **Core VTM Systems**
- **7 Canonical Clans**: Ventrue, Toreador, Brujah, Malkavian, Nosferatu, Gangrel, Tremere
- **Territory Types**: Feeding Grounds, Havens, Influence areas, Elysium, Contested zones
- **Authentic Clan Colors**: Each clan has lore-appropriate visual styling
- **Territory Management**: Claim, release, and contest territories

### ✅ **3D City Visualization**
- **Real OSM Data**: Import actual city data from OpenStreetMap
- **Procedural Buildings**: Generate 3D buildings from geographic data
- **Interactive Interface**: Click to assign territories, right-click to release
- **Smooth Camera Controls**: Navigate the city with WASD + mouse controls

### ✅ **Geographic Integration**
- **Coordinate Conversion**: Accurate lat/lon to Unity world space mapping
- **Building Classification**: Automatic VTM territory type assignment
- **Height Estimation**: Realistic building heights from OSM data
- **Boundary Management**: Proper city bounds and camera limits

## Getting Started

### Prerequisites
- Unity 2022.3 LTS or newer
- Visual Studio Code with C# extension
- Optional: Real OSM data files in JSON format

### Installation
1. Open the project in Unity 2022.3+
2. Load the `VTMMap` scene in `Assets/Scenes/`
3. Press Play to start with sample data
4. Use number keys 1-7 to select clans
5. Click buildings to assign territories

### Controls
- **WASD**: Move camera
- **Mouse**: Look around (hold middle mouse button)
- **Scroll Wheel**: Zoom in/out
- **Q/E**: Move up/down
- **Shift**: Fast movement mode
- **R**: Reset camera position
- **1-7**: Select vampire clans
- **Left Click**: Assign territory to selected clan
- **Right Click**: Release territory
- **ESC**: Clear clan selection

## Project Structure

```
Assets/
├── Scripts/
│   ├── VTM/                    # Vampire: The Masquerade systems
│   │   ├── ClanManager.cs      # Clan definitions and management
│   │   └── TerritoryManager.cs # Territory claiming and persistence
│   ├── OSM/                    # OpenStreetMap data handling
│   │   └── OSMDataStructures.cs # Geographic data structures
│   ├── Map/                    # 3D map generation
│   │   ├── BuildingGenerator.cs    # Create buildings from OSM data
│   │   └── BuildingInteraction.cs # Handle building clicks
│   ├── VTMGameManager.cs       # Main game coordinator
│   └── CameraController.cs     # Camera movement and controls
├── Scenes/
│   └── VTMMap.unity           # Main scene
├── Materials/                  # Clan and building materials
├── Prefabs/                   # Reusable GameObjects
├── StreamingAssets/           # OSM data files
└── Resources/                 # Runtime-loaded assets
```

## VTM Clans

### The Seven Clans
1. **Ventrue** (Blue) - Clan of kings and nobles
   - Disciplines: Dominate, Fortitude, Presence
   - Preferred Territories: Government buildings, corporate offices

2. **Toreador** (Red) - Clan of artists and hedonists
   - Disciplines: Auspex, Celerity, Presence
   - Preferred Territories: Museums, theaters, galleries

3. **Brujah** (Gold) - Clan of rebels and warriors
   - Disciplines: Celerity, Potence, Presence
   - Preferred Territories: Bars, clubs, underground venues

4. **Malkavian** (Purple) - Clan of madmen and oracles
   - Disciplines: Auspex, Dominate, Obfuscate
   - Preferred Territories: Hospitals, asylums, unusual locations

5. **Nosferatu** (Gray) - Clan of information brokers
   - Disciplines: Animalism, Obfuscate, Potence
   - Preferred Territories: Sewers, tunnels, hidden places

6. **Gangrel** (Green) - Clan of outlanders and survivalists
   - Disciplines: Animalism, Fortitude, Protean
   - Preferred Territories: Parks, wilderness, rural areas

7. **Tremere** (Dark Purple) - Clan of blood sorcerers
   - Disciplines: Auspex, Dominate, Blood Sorcery
   - Preferred Territories: Libraries, laboratories, chantries

## Territory Types

- **Feeding Grounds**: Bars, clubs, entertainment venues where vampires hunt
- **Havens**: Safe houses, residential areas, vampire refuges
- **Influence**: Government, corporate, media buildings for political power
- **Elysium**: Museums, theaters, cultural sites (neutral ground)
- **Contested**: Disputed or dangerous areas

## Adding Real City Data

### OSM Data Format
The system expects JSON files with this structure:
```json
{
  "cityName": "Santa Cruz",
  "centerPoint": { "lat": 36.9741, "lon": -122.0308 },
  "buildings": [
    {
      "id": 12345,
      "coordinates": [
        { "lat": 36.974, "lon": -122.027 },
        { "lat": 36.975, "lon": -122.027 }
      ],
      "buildingType": "residential",
      "height": 15.0
    }
  ]
}
```

### Data Sources
- Use the web version's data extraction tools
- Export from JOSM or similar OSM editors
- Convert from other geographic data formats

## Development

### Key Classes
- `VTMGameManager`: Main game coordinator and UI handler
- `ClanManager`: Static manager for clan definitions
- `TerritoryManager`: Handles territory ownership and persistence
- `BuildingGenerator`: Creates 3D buildings from OSM data
- `OSMUtilities`: Geographic coordinate conversion utilities

### Events System
The project uses Unity events for loose coupling:
- `OnTerritoryClaimedEvent`: Fired when a territory is claimed
- `OnTerritoryReleasedEvent`: Fired when a territory is released

### Adding New Features
1. Follow the existing namespace structure (`VTM`, `OSM`, `Map`)
2. Use the established singleton patterns for managers
3. Add proper XML documentation
4. Consider VTM lore and terminology
5. Test with both sample and real data

## Troubleshooting

### Common Issues
- **Black Screen**: Ensure the camera is positioned correctly and buildings are generated
- **No Buildings**: Check that OSM data is loaded and BuildingGenerator is active
- **Click Not Working**: Verify buildings have colliders and BuildingInteraction components
- **Camera Stuck**: Press R to reset camera position

### Performance Optimization
- Large cities may require object pooling for buildings
- Consider LOD (Level of Detail) for distant buildings
- Use occlusion culling for better performance

## License

This project is created for educational and campaign management purposes. Vampire: The Masquerade is owned by Modiphius Entertainment.

## Contributing

Feel free to submit issues and enhancement requests! This tool is designed to enhance VTM tabletop experiences.

---

*Built with Unity 2022.3 LTS for the Vampire: The Masquerade community*
