// Characters Database - VTM San Francisco
// This file contains all NPCs, their stats, summaries, info, and images

class CharacterDatabase {
    constructor() {
        this.characters = {
            // Player character will be stored here
            player: null,
            
            // NPCs organized by faction/clan
            camarilla: {},
            anarchs: {},
            sabbat: {},
            independent: {},
            
            // Temporary coterie members
            coterie: {}
        };
        
        // Faction colors for map pins
        this.factionColors = {
            camarilla: '#c9a96e', // Gold
            anarchs: '#8b0000',   // Dark Red
            sabbat: '#2c1810',    // Dark Brown
            independent: '#4a4a4a', // Gray
            uncontrolled: '#666666' // Default gray
        };
    }
    
    // Add a character to the database
    addCharacter(id, character, faction = 'independent') {
        if (!this.characters[faction]) {
            this.characters[faction] = {};
        }
        this.characters[faction][id] = character;
    }
    
    // Get character by ID and faction
    getCharacter(id, faction) {
        return this.characters[faction]?.[id] || null;
    }
    
    // Get all characters from a faction
    getFactionCharacters(faction) {
        return this.characters[faction] || {};
    }
    
    // Get faction color for map pins
    getFactionColor(faction) {
        return this.factionColors[faction] || this.factionColors.uncontrolled;
    }
    
    // Set player character
    setPlayer(character) {
        this.characters.player = character;
    }
    
    // Get player character
    getPlayer() {
        return this.characters.player;
    }
}

// NPC Character Template (for future implementation)
class NPCCharacter {
    constructor(name, clan, faction, generation = 13) {
        this.name = name;
        this.clan = clan;
        this.faction = faction;
        this.generation = generation;
        
        // Attributes (1-5)
        this.attributes = {
            physical: 2,
            social: 2,
            mental: 2
        };
        
        // Stats
        this.stats = {
            bloodPool: { current: 8, max: 10 },
            humanity: { current: 6, max: 10 },
            willpower: { current: 5, max: 5 },
            resources: 15000,
            contacts: 3
        };
        
        // Character details
        this.details = {
            description: "",
            background: "",
            demeanor: "",
            nature: "",
            imageSrc: ""
        };
        
        // Political information
        this.politics = {
            status: 0, // Standing within faction
            titles: [],
            allies: [],
            enemies: [],
            influence: {
                banking: 0,
                medical: 0,
                government: 0,
                academic: 0,
                entertainment: 0
            }
        };
        
        // Relationships
        this.relationships = {};
        
        // Controlled locations
        this.controlledLocations = [];
    }
    
    // Add relationship with another character
    addRelationship(characterId, relationship) {
        this.relationships[characterId] = relationship;
    }
    
    // Add controlled location
    addControlledLocation(locationId) {
        if (!this.controlledLocations.includes(locationId)) {
            this.controlledLocations.push(locationId);
        }
    }
    
    // Remove controlled location
    removeControlledLocation(locationId) {
        const index = this.controlledLocations.indexOf(locationId);
        if (index > -1) {
            this.controlledLocations.splice(index, 1);
        }
    }
    
    // Convert to save data
    toSaveData() {
        return {
            name: this.name,
            clan: this.clan,
            faction: this.faction,
            generation: this.generation,
            attributes: this.attributes,
            stats: this.stats,
            details: this.details,
            politics: this.politics,
            relationships: this.relationships,
            controlledLocations: this.controlledLocations
        };
    }
    
    // Create from save data
    static fromSaveData(data) {
        const character = new NPCCharacter(data.name, data.clan, data.faction, data.generation);
        Object.assign(character.attributes, data.attributes);
        Object.assign(character.stats, data.stats);
        Object.assign(character.details, data.details);
        Object.assign(character.politics, data.politics);
        Object.assign(character.relationships, data.relationships);
        character.controlledLocations = data.controlledLocations || [];
        return character;
    }
}

// Global character database instance
const characterDB = new CharacterDatabase();

// Example NPCs (empty for now as requested)
// These will be populated in future development
const exampleNPCs = {
    // Prince of San Francisco (Camarilla)
    prince: {
        name: "",
        clan: "",
        faction: "camarilla",
        description: "",
        imageSrc: ""
    },
    
    // Anarch Baron
    baron: {
        name: "",
        clan: "",
        faction: "anarchs", 
        description: "",
        imageSrc: ""
    },
    
    // Sabbat Pack Leader
    packLeader: {
        name: "",
        clan: "",
        faction: "sabbat",
        description: "",
        imageSrc: ""
    }
};

console.log("Character Database initialized - Stage 5");
