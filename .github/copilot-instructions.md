<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# VTM Territory Mapping System - Copilot Instructions

This is a Unity 3D project for creating a Vampire: The Masquerade territory mapping system using real-world OpenStreetMap data.

## Project Context

### Game Concept
- **Vampire: The Masquerade territory mapping tool**
- Players can assign buildings and areas to different vampire clans
- Real-world city data from OpenStreetMap is converted into 3D environments
- Interactive 3D visualization for tabletop RPG campaign management

### Core Systems
1. **VTM Clan System** (`Assets/Scripts/VTM/`):
   - 7 main vampire clans (Ventrue, Toreador, Brujah, Malkavian, Nosferatu, Gangrel, Tremere)
   - Each clan has distinct colors, disciplines, and territory preferences
   - Use `ClanManager.cs` for clan-related functionality

2. **Territory Management** (`Assets/Scripts/VTM/TerritoryManager.cs`):
   - Buildings can be claimed by clans
   - Different territory types: Feeding Grounds, Havens, Influence, Elysium, Contested
   - Persistent territory data with save/load functionality

3. **OSM Data Integration** (`Assets/Scripts/OSM/`):
   - Real OpenStreetMap data parsing and conversion
   - Geographic coordinates to Unity world space conversion
   - Building height estimation and type classification

4. **3D Map Generation** (`Assets/Scripts/Map/`):
   - Procedural building generation from OSM data
   - Interactive building selection and territory assignment
   - Camera controls for city navigation

### Code Style Guidelines
- Use Unity's component-based architecture
- Follow C# naming conventions (PascalCase for public, camelCase for private)
- Prefer composition over inheritance
- Use events for loose coupling between systems
- Always null-check Unity object references
- Use SerializeField for inspector-visible private fields

### VTM-Specific Guidelines
- All clan names should use proper VTM naming (Ventrue, not ventrue)
- Territory types should follow VTM lore (Feeding Grounds for bars/clubs, Havens for residential)
- Clan colors should match the established color scheme in `ClanManager.cs`
- Use proper VTM terminology (territories, clans, disciplines, etc.)

### Unity Best Practices
- Always check for null references when accessing Unity objects
- Use `[SerializeField]` instead of public fields for inspector values
- Prefer `GetComponent<>()` caching over repeated calls
- Use object pooling for frequently created/destroyed objects
- Follow the SingletonPattern for managers (see `TerritoryManager` and `VTMGameManager`)

### Common Patterns in This Project
- **Manager Singletons**: Core systems use singleton pattern with `Instance` property
- **Event-Driven Architecture**: Territory changes broadcast events to update UI/visuals
- **Component-Based Buildings**: Each building has `BuildingInteraction` component for user interaction
- **Geographic Conversion**: Use `OSMUtilities` for lat/lon to Unity world space conversion

### When Adding New Features
- Follow the existing namespace structure (`VTM`, `OSM`, `Map`)
- Add appropriate XML documentation for public methods
- Consider VTM lore and terminology
- Test with both sample and real OSM data
- Update the README.md with new functionality

### Dependencies
- Unity 2022.3+ (LTS)
- Standard Unity packages (no external dependencies required)
- JSON data files for OSM data (in StreamingAssets or Resources)

### Common Issues to Watch For
- Geographic coordinate precision (use double for lat/lon calculations)
- Unity's left-handed coordinate system vs. geographic conventions
- Building mesh generation edge cases (degenerate triangles, invalid coordinates)
- Memory management for large city datasets
- UI scaling and responsiveness for different screen sizes
