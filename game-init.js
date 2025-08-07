// Game Initialization Integration - VTM San Francisco
// Integration functions for faction intros with existing character creation

// Function to be called from character creation when player finishes
function initializeGameWithFaction(character) {
    // This replaces the old generic welcome
    // Called from main.js after character creation is complete
    
    console.log(`Initializing game for ${character.name} of faction: ${character.faction}`);
    
    // Initialize player faction in character database
    if (typeof characterDB !== 'undefined') {
        characterDB.setPlayer(character);
        characterDB.initializePlayerFaction(character.faction);
    }
    
    // Get starting context for the faction
    const startingContext = getStartingContextForFaction(character.faction);
    
    // Apply starting context to character
    if (startingContext) {
        applyStartingContext(character, startingContext);
    }
    
    return { character, startingContext };
}

// Get faction-specific starting context
function getStartingContextForFaction(faction) {
    const contexts = {
        camarilla: {
            allies: ['prince_vannevar', 'seneschal_helena'],
            enemies: ['baron_garcia', 'pack_leader_varga'],
            startingLocation: 'downtown_sf',
            initialContacts: ['Elizabeth Carmichael (Ventrue Primogen)', 'Helena Markov (Seneschal)'],
            resources: 25000,
            status: 1,
            welcomeBonus: 'Camarilla Standing (+1)'
        },
        anarchs: {
            allies: ['baron_garcia', 'tech_zero'],
            enemies: ['prince_vannevar', 'sheriff_marcus'],
            startingLocation: 'oakland',
            initialContacts: ['Miguel Garcia (Baron)', 'Zero (Tech Specialist)'],
            resources: 10000,
            status: 0,
            welcomeBonus: 'Anarch Reputation'
        },
        sabbat: {
            allies: ['pack_leader_varga', 'pack_priest'],
            enemies: ['prince_vannevar', 'baron_garcia'],
            startingLocation: 'mission_district',
            initialContacts: ['Viktor Varga (Pack Leader)', 'Father Mendez (Pack Priest)'],
            resources: 5000,
            status: 0,
            welcomeBonus: 'Pack Loyalty'
        },
        independent: {
            allies: [],
            enemies: [],
            startingLocation: 'random',
            initialContacts: ['Khalil Al-Rashid (Ministry Agent)'],
            resources: 15000,
            status: 0,
            welcomeBonus: 'Freedom of Movement'
        }
    };
    
    return contexts[faction] || contexts.independent;
}

// Apply starting context to character
function applyStartingContext(character, context) {
    // Add starting resources
    if (character.resources !== undefined) {
        character.resources += context.resources;
    }
    
    // Set starting location preference (for future map integration)
    character.startingLocation = context.startingLocation;
    
    // Add initial contacts (for future implementation)
    character.initialContacts = context.initialContacts;
    
    // Set faction status
    character.factionStatus = context.status;
    
    console.log(`Applied starting context for ${character.faction}:`, context);
}

// Event listener for faction selection
if (typeof window !== 'undefined') {
    window.addEventListener('factionSelected', (event) => {
        const faction = event.detail.faction;
        console.log(`Faction intro displayed for: ${faction}`);
        
        // Here you could trigger additional game initialization
        // - Set up starting location on map
        // - Initialize faction relationships
        // - Set up initial game state
        // - Display starting scenario
    });
    
    // Make functions globally available
    window.initializeGameWithFaction = initializeGameWithFaction;
    window.getStartingContextForFaction = getStartingContextForFaction;
    window.applyStartingContext = applyStartingContext;
}

// Export for use in main game files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializeGameWithFaction, 
        getStartingContextForFaction, 
        applyStartingContext 
    };
}

console.log("Game initialization functions loaded");
