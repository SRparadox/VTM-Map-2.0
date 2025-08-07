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
    
    // Get all recruitable characters across all factions
    getRecruitableCharacters() {
        const recruitable = [];
        Object.values(this.characters).forEach(faction => {
            if (faction && typeof faction === 'object') {
                Object.values(faction).forEach(character => {
                    if (character && character.recruitable) {
                        recruitable.push(character);
                    }
                });
            }
        });
        return recruitable;
    }
    
    // Get recruitable characters by faction
    getRecruitableByFaction(factionName) {
        const faction = this.characters[factionName];
        if (!faction) return [];
        
        return Object.values(faction).filter(character => character && character.recruitable);
    }
    
    // Add character to coterie
    addToCoterie(character) {
        if (!character.recruitable) {
            console.log(`${character.name} is not recruitable for the coterie.`);
            return false;
        }
        
        if (!this.characters.coterie) {
            this.characters.coterie = {};
        }
        
        this.characters.coterie[character.name] = character;
        console.log(`${character.name} has joined the coterie!`);
        return true;
    }
    
    // Remove character from coterie
    removeFromCoterie(characterName) {
        if (this.characters.coterie && this.characters.coterie[characterName]) {
            delete this.characters.coterie[characterName];
            console.log(`${characterName} has left the coterie.`);
            return true;
        }
        return false;
    }
    
    // Get all coterie members
    getCoterieMembers() {
        return this.characters.coterie || {};
    }
    
    // Check all coterie members for loyalty issues
    checkCoterieLoalty() {
        const coterie = this.getCoterieMembers();
        const leavingMembers = [];
        
        Object.values(coterie).forEach(member => {
            if (member.loyalty.current <= 0) {
                leavingMembers.push(member.name);
                this.removeFromCoterie(member.name);
            }
        });
        
        return leavingMembers;
    }
    
    // Initialize player with faction choice and display intro
    initializePlayerFaction(faction) {
        if (!['camarilla', 'anarchs', 'sabbat', 'independent'].includes(faction)) {
            console.error('Invalid faction:', faction);
            return false;
        }
        
        // Set player faction affiliation (this can be changed later through gameplay)
        if (this.characters.player) {
            this.characters.player.startingFaction = faction;
        }
        
        console.log(`Player initialized with ${faction} faction intro`);
        
        // Fire event for UI to display faction intro
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('factionSelected', { 
                detail: { faction: faction }
            }));
        }
        
        return true;
    }
    
    // Get faction-specific starting context
    getFactionStartingContext(faction) {
        const contexts = {
            camarilla: {
                allies: ['prince_vannevar', 'seneschal_helena'],
                enemies: ['baron_garcia', 'pack_leader_varga'],
                startingLocation: 'downtown_sf',
                initialContacts: ['Elizabeth Carmichael (Ventrue Primogen)', 'Helena Markov (Seneschal)'],
                resources: 25000,
                status: 1
            },
            anarchs: {
                allies: ['baron_garcia', 'tech_zero'],
                enemies: ['prince_vannevar', 'sheriff_marcus'],
                startingLocation: 'oakland',
                initialContacts: ['Miguel Garcia (Baron)', 'Zero (Tech Specialist)'],
                resources: 10000,
                status: 0
            },
            sabbat: {
                allies: ['pack_leader_varga', 'pack_priest'],
                enemies: ['prince_vannevar', 'baron_garcia'],
                startingLocation: 'mission_district',
                initialContacts: ['Viktor Varga (Pack Leader)', 'Father Mendez (Pack Priest)'],
                resources: 5000,
                status: 0
            },
            independent: {
                allies: [],
                enemies: [],
                startingLocation: 'random',
                initialContacts: ['Khalil Al-Rashid (Ministry Agent)'],
                resources: 15000,
                status: 0
            }
        };
        
        return contexts[faction] || contexts.independent;
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
            summary: "", // Brief character summary
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
        
        // Recruitable flag for coterie recruitment
        this.recruitable = false;
        
        // Loyalty system for recruitable NPCs
        this.loyalty = {
            current: 50, // 0-100 scale, starts neutral
            max: 100,
            min: 0,
            likes: [], // Things that increase loyalty
            dislikes: [] // Things that decrease loyalty
        };
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
    
    // Loyalty system methods
    adjustLoyalty(amount, reason = "") {
        if (!this.recruitable) return false;
        
        const oldLoyalty = this.loyalty.current;
        this.loyalty.current = Math.max(this.loyalty.min, Math.min(this.loyalty.max, this.loyalty.current + amount));
        
        console.log(`${this.name} loyalty changed from ${oldLoyalty} to ${this.loyalty.current}${reason ? ` (${reason})` : ''}`);
        
        // Check if loyalty dropped to 0
        if (this.loyalty.current === 0 && oldLoyalty > 0) {
            this.triggerLeave();
        }
        
        return true;
    }
    
    // Check if action affects loyalty based on likes/dislikes
    checkLoyaltyReaction(action) {
        if (!this.recruitable) return 0;
        
        let loyaltyChange = 0;
        
        // Check likes
        this.loyalty.likes.forEach(like => {
            if (action.toLowerCase().includes(like.toLowerCase())) {
                loyaltyChange += 10;
            }
        });
        
        // Check dislikes
        this.loyalty.dislikes.forEach(dislike => {
            if (action.toLowerCase().includes(dislike.toLowerCase())) {
                loyaltyChange -= 15;
            }
        });
        
        if (loyaltyChange !== 0) {
            this.adjustLoyalty(loyaltyChange, `reacted to: ${action}`);
        }
        
        return loyaltyChange;
    }
    
    // Trigger when NPC leaves the coterie
    triggerLeave() {
        console.log(`${this.name} has left the coterie due to zero loyalty!`);
        // Remove from coterie if they're in it
        if (characterDB.characters.coterie && characterDB.characters.coterie[this.name]) {
            delete characterDB.characters.coterie[this.name];
            console.log(`${this.name} removed from coterie.`);
        }
        // Fire custom event for UI updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('npcLeft', { 
                detail: { character: this, reason: 'loyalty' }
            }));
        }
    }
    
    // Get loyalty status description
    getLoyaltyStatus() {
        if (!this.recruitable) return "Not recruitable";
        
        const loyalty = this.loyalty.current;
        if (loyalty >= 80) return "Devoted";
        if (loyalty >= 60) return "Loyal";
        if (loyalty >= 40) return "Neutral";
        if (loyalty >= 20) return "Suspicious";
        if (loyalty > 0) return "Hostile";
        return "Gone";
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
            controlledLocations: this.controlledLocations,
            recruitable: this.recruitable,
            loyalty: this.loyalty
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
        character.recruitable = data.recruitable || false;
        if (data.loyalty) {
            Object.assign(character.loyalty, data.loyalty);
        }
        return character;
    }
}

// Global character database instance
const characterDB = new CharacterDatabase();

// Generated Character Pool - 20 Vampires across different sects
const characterPool = {
    // CAMARILLA VAMPIRES (7 characters)
    camarilla: {
        // Prince of San Francisco
        prince_vannevar: new NPCCharacter("Vannevar Thomas", "Ventrue", "camarilla", 7),
        
        // Seneschal
        seneschal_helena: new NPCCharacter("Helena Markov", "Toreador", "camarilla", 8),
        
        // Sheriff
        sheriff_marcus: new NPCCharacter("Marcus Stone", "Brujah", "camarilla", 9),
        
        // Primogen Council
        primogen_ventrue: new NPCCharacter("Elizabeth Carmichael", "Ventrue", "camarilla", 8),
        primogen_toreador: new NPCCharacter("Vincent Artois", "Toreador", "camarilla", 9),
        primogen_tremere: new NPCCharacter("Dr. Mikhail Volkov", "Tremere", "camarilla", 9),
        
        // Recruitable Camarilla
        camarilla_recruit: new NPCCharacter("Sarah Mitchell", "Malkavian", "camarilla", 11)
    },
    
    // ANARCH VAMPIRES (7 characters)
    anarchs: {
        // Baron of Oakland
        baron_garcia: new NPCCharacter("Miguel Garcia", "Gangrel", "anarchs", 9),
        
        // Lieutenant
        lieutenant_kane: new NPCCharacter("Rebecca Kane", "Brujah", "anarchs", 10),
        
        // Tech Specialist
        tech_zero: new NPCCharacter("Zero", "Nosferatu", "anarchs", 11),
        
        // Street Leaders
        street_leader_1: new NPCCharacter("Johnny Riot", "Brujah", "anarchs", 12),
        street_leader_2: new NPCCharacter("Luna Blackwood", "Gangrel", "anarchs", 11),
        
        // Recruitable Anarchs
        anarch_recruit_1: new NPCCharacter("Alex Chen", "Toreador", "anarchs", 12),
        anarch_recruit_2: new NPCCharacter("Maria Santos", "Caitiff", "anarchs", 13)
    },
    
    // SABBAT VAMPIRES (4 characters)
    sabbat: {
        // Pack Leader
        pack_leader_varga: new NPCCharacter("Viktor Varga", "Tzimisce", "sabbat", 8),
        
        // Pack Members
        pack_priest: new NPCCharacter("Father Mendez", "Lasombra", "sabbat", 9),
        pack_warrior: new NPCCharacter("Bloodhawk", "Brujah", "sabbat", 10),
        
        // Recruitable Sabbat (for players who go dark)
        sabbat_recruit: new NPCCharacter("Crimson", "Gangrel", "sabbat", 11)
    },
    
    // INDEPENDENT VAMPIRES (2 characters)
    independent: {
        // Ministry Agent
        ministry_agent: new NPCCharacter("Khalil Al-Rashid", "Ministry", "independent", 10),
        
        // Recruitable Independent
        independent_recruit: new NPCCharacter("Dr. Emma Cross", "Hecata", "independent", 12)
    }
};

// Initialize all characters with proper stats and recruitable tags
function initializeCharacterPool() {
    // Initialize Camarilla characters
    Object.values(characterPool.camarilla).forEach(char => {
        char.details.imageSrc = "assets/portraits/blank.png";
        char.recruitable = char.name === "Sarah Mitchell";
    });
    
    // Prince Vannevar Thomas - Powerful Ventrue Prince
    characterPool.camarilla.prince_vannevar.attributes = { physical: 3, social: 5, mental: 4 };
    characterPool.camarilla.prince_vannevar.stats.bloodPool = { current: 15, max: 15 };
    characterPool.camarilla.prince_vannevar.stats.humanity = { current: 5, max: 10 };
    characterPool.camarilla.prince_vannevar.stats.willpower = { current: 8, max: 8 };
    characterPool.camarilla.prince_vannevar.stats.resources = 500000;
    characterPool.camarilla.prince_vannevar.politics.status = 5;
    characterPool.camarilla.prince_vannevar.politics.titles = ["Prince of San Francisco"];
    characterPool.camarilla.prince_vannevar.details.summary = "Calculating Ventrue Prince who rules through corporate power and political manipulation.";
    characterPool.camarilla.prince_vannevar.details.description = "The Ventrue Prince of San Francisco, a calculating businessman who rules through political maneuvering and economic influence.";
    
    // Seneschal Helena Markov - Toreador advisor
    characterPool.camarilla.seneschal_helena.attributes = { physical: 2, social: 4, mental: 4 };
    characterPool.camarilla.seneschal_helena.stats.bloodPool = { current: 12, max: 12 };
    characterPool.camarilla.seneschal_helena.stats.humanity = { current: 6, max: 10 };
    characterPool.camarilla.seneschal_helena.politics.status = 4;
    characterPool.camarilla.seneschal_helena.politics.titles = ["Seneschal"];
    characterPool.camarilla.seneschal_helena.details.summary = "Cultured Toreador Seneschal who maintains the Prince's cultural connections and public image.";
    characterPool.camarilla.seneschal_helena.details.description = "The Prince's right hand, a former art gallery owner who maintains the cultural facade of the Camarilla.";
    
    // Sheriff Marcus Stone - Brujah enforcer
    characterPool.camarilla.sheriff_marcus.attributes = { physical: 5, social: 2, mental: 3 };
    characterPool.camarilla.sheriff_marcus.stats.bloodPool = { current: 11, max: 11 };
    characterPool.camarilla.sheriff_marcus.stats.humanity = { current: 4, max: 10 };
    characterPool.camarilla.sheriff_marcus.politics.status = 3;
    characterPool.camarilla.sheriff_marcus.politics.titles = ["Sheriff"];
    characterPool.camarilla.sheriff_marcus.details.summary = "Former SFPD detective turned Brujah Sheriff, maintains order through controlled violence.";
    characterPool.camarilla.sheriff_marcus.details.description = "A former SFPD detective turned Brujah Sheriff, he maintains order through controlled violence.";
    
    // Primogen members
    characterPool.camarilla.primogen_ventrue.details.summary = "Wealthy Ventrue Primogen representing banking and financial interests.";
    characterPool.camarilla.primogen_toreador.details.summary = "Artistic Toreador Primogen controlling the city's entertainment scene.";
    characterPool.camarilla.primogen_tremere.details.summary = "Mysterious Tremere Primogen and university researcher with occult knowledge.";
    
    // Recruitable Camarilla - Sarah Mitchell
    characterPool.camarilla.camarilla_recruit.attributes = { physical: 2, social: 3, mental: 4 };
    characterPool.camarilla.camarilla_recruit.stats.bloodPool = { current: 9, max: 9 };
    characterPool.camarilla.camarilla_recruit.stats.humanity = { current: 7, max: 10 };
    characterPool.camarilla.camarilla_recruit.details.summary = "Idealistic Malkavian lawyer questioning Camarilla traditions and seeking justice.";
    characterPool.camarilla.camarilla_recruit.details.description = "A young Malkavian lawyer who questions the Camarilla's rigid hierarchy. Potential coterie member.";
    characterPool.camarilla.camarilla_recruit.loyalty.current = 45;
    characterPool.camarilla.camarilla_recruit.loyalty.likes = ["justice", "helping mortals", "honesty", "protecting the innocent", "legal solutions"];
    characterPool.camarilla.camarilla_recruit.loyalty.dislikes = ["corruption", "needless violence", "lying", "breaking the masquerade", "authoritarian behavior"];
    
    // Initialize Anarch characters
    Object.values(characterPool.anarchs).forEach(char => {
        char.details.imageSrc = "assets/portraits/blank.png";
        char.recruitable = char.name === "Alex Chen" || char.name === "Maria Santos";
    });
    
    // Baron Miguel Garcia - Gangrel leader
    characterPool.anarchs.baron_garcia.attributes = { physical: 4, social: 3, mental: 3 };
    characterPool.anarchs.baron_garcia.stats.bloodPool = { current: 11, max: 11 };
    characterPool.anarchs.baron_garcia.stats.humanity = { current: 5, max: 10 };
    characterPool.anarchs.baron_garcia.politics.status = 4;
    characterPool.anarchs.baron_garcia.politics.titles = ["Baron of Oakland"];
    characterPool.anarchs.baron_garcia.details.summary = "Pragmatic Gangrel Baron who earned Oakland through strength and survival instincts.";
    characterPool.anarchs.baron_garcia.details.description = "A pragmatic Gangrel who earned his territory through strength and cunning. Leads the Oakland Anarchs.";
    
    // Lieutenant Rebecca Kane
    characterPool.anarchs.lieutenant_kane.details.summary = "Fierce Brujah lieutenant and Garcia's trusted second-in-command.";
    
    // Tech Specialist Zero - Nosferatu hacker
    characterPool.anarchs.tech_zero.attributes = { physical: 1, social: 2, mental: 5 };
    characterPool.anarchs.tech_zero.stats.bloodPool = { current: 9, max: 9 };
    characterPool.anarchs.tech_zero.stats.humanity = { current: 6, max: 10 };
    characterPool.anarchs.tech_zero.details.summary = "Brilliant Nosferatu hacker providing intelligence and digital warfare capabilities.";
    characterPool.anarchs.tech_zero.details.description = "A brilliant Nosferatu hacker who provides intelligence and tech support to the Anarch movement.";
    
    // Street Leaders
    characterPool.anarchs.street_leader_1.details.summary = "Violent Brujah street fighter leading the punk scene in the Mission District.";
    characterPool.anarchs.street_leader_2.details.summary = "Wild Gangrel leading outcasts and runaways in Golden Gate Park.";
    
    // Recruitable Anarchs
    characterPool.anarchs.anarch_recruit_1.attributes = { physical: 2, social: 4, mental: 3 };
    characterPool.anarchs.anarch_recruit_1.stats.humanity = { current: 7, max: 10 };
    characterPool.anarchs.anarch_recruit_1.details.summary = "Disillusioned Toreador artist seeking authenticity and creative freedom.";
    characterPool.anarchs.anarch_recruit_1.details.description = "A disillusioned Toreador artist seeking purpose in the Anarch cause. Potential coterie member.";
    characterPool.anarchs.anarch_recruit_1.loyalty.current = 55;
    characterPool.anarchs.anarch_recruit_1.loyalty.likes = ["artistic expression", "freedom", "creativity", "rebellion", "authentic experiences"];
    characterPool.anarchs.anarch_recruit_1.loyalty.dislikes = ["censorship", "conformity", "pretentious art", "corporate influence", "traditional hierarchy"];
    
    characterPool.anarchs.anarch_recruit_2.attributes = { physical: 3, social: 3, mental: 2 };
    characterPool.anarchs.anarch_recruit_2.stats.humanity = { current: 6, max: 10 };
    characterPool.anarchs.anarch_recruit_2.details.summary = "Tough Caitiff survivor fighting for acceptance and a place in vampire society.";
    characterPool.anarchs.anarch_recruit_2.details.description = "A Caitiff survivor fighting for acceptance and freedom. Potential coterie member.";
    characterPool.anarchs.anarch_recruit_2.loyalty.current = 40;
    characterPool.anarchs.anarch_recruit_2.loyalty.likes = ["equality", "survival", "loyalty", "street justice", "proving worth"];
    characterPool.anarchs.anarch_recruit_2.loyalty.dislikes = ["discrimination", "abandonment", "clan prejudice", "being underestimated", "betrayal"];
    
    // Initialize Sabbat characters
    Object.values(characterPool.sabbat).forEach(char => {
        char.details.imageSrc = "assets/portraits/blank.png";
        char.recruitable = char.name === "Crimson";
    });
    
    // Pack Leader Viktor Varga - Tzimisce
    characterPool.sabbat.pack_leader_varga.attributes = { physical: 4, social: 3, mental: 4 };
    characterPool.sabbat.pack_leader_varga.stats.bloodPool = { current: 12, max: 12 };
    characterPool.sabbat.pack_leader_varga.stats.humanity = { current: 2, max: 10 };
    characterPool.sabbat.pack_leader_varga.politics.status = 4;
    characterPool.sabbat.pack_leader_varga.politics.titles = ["Pack Leader"];
    characterPool.sabbat.pack_leader_varga.details.summary = "Sadistic Tzimisce pack leader focused on spreading chaos and testing limits.";
    characterPool.sabbat.pack_leader_varga.details.description = "A sadistic Tzimisce pack leader focused on spreading chaos and corruption in San Francisco.";
    
    // Pack Members
    characterPool.sabbat.pack_priest.details.summary = "Fanatical Lasombra priest preaching the Sabbat's dark gospel.";
    characterPool.sabbat.pack_warrior.details.summary = "Brutal Brujah warrior specializing in violence and intimidation.";
    
    // Recruitable Sabbat - Crimson
    characterPool.sabbat.sabbat_recruit.attributes = { physical: 4, social: 2, mental: 2 };
    characterPool.sabbat.sabbat_recruit.stats.humanity = { current: 3, max: 10 };
    characterPool.sabbat.sabbat_recruit.details.summary = "Feral Gangrel torn between savage instincts and remnants of humanity.";
    characterPool.sabbat.sabbat_recruit.details.description = "A feral Gangrel seeking redemption or deeper corruption. Potential coterie member for dark paths.";
    characterPool.sabbat.sabbat_recruit.loyalty.current = 30;
    characterPool.sabbat.sabbat_recruit.loyalty.likes = ["strength", "survival", "honest brutality", "respect", "pack loyalty"];
    characterPool.sabbat.sabbat_recruit.loyalty.dislikes = ["weakness", "manipulation", "false promises", "abandonment", "being caged"];
    
    // Initialize Independent characters
    Object.values(characterPool.independent).forEach(char => {
        char.details.imageSrc = "assets/portraits/blank.png";
        char.recruitable = char.name === "Dr. Emma Cross";
    });
    
    // Ministry Agent - Khalil Al-Rashid
    characterPool.independent.ministry_agent.attributes = { physical: 3, social: 4, mental: 3 };
    characterPool.independent.ministry_agent.stats.bloodPool = { current: 10, max: 10 };
    characterPool.independent.ministry_agent.stats.humanity = { current: 4, max: 10 };
    characterPool.independent.ministry_agent.details.summary = "Charming Ministry operative working to expand Setite influence through temptation.";
    characterPool.independent.ministry_agent.details.description = "A Ministry operative working to expand Setite influence in the Bay Area.";
    
    // Recruitable Independent - Dr. Emma Cross
    characterPool.independent.independent_recruit.attributes = { physical: 2, social: 3, mental: 5 };
    characterPool.independent.independent_recruit.stats.humanity = { current: 6, max: 10 };
    characterPool.independent.independent_recruit.details.summary = "Brilliant Hecata forensic pathologist seeking forbidden knowledge about death.";
    characterPool.independent.independent_recruit.details.description = "A forensic pathologist Embraced by the Hecata. Seeks knowledge and purpose. Potential coterie member.";
    characterPool.independent.independent_recruit.loyalty.current = 60;
    characterPool.independent.independent_recruit.loyalty.likes = ["knowledge", "scientific method", "helping victims", "uncovering truth", "learning"];
    characterPool.independent.independent_recruit.loyalty.dislikes = ["ignorance", "wasted potential", "covering up crimes", "anti-intellectualism", "destroying evidence"];
    
    // Add all characters to the database
    Object.entries(characterPool).forEach(([faction, characters]) => {
        Object.entries(characters).forEach(([id, character]) => {
            characterDB.addCharacter(id, character, faction);
        });
    });
    
    console.log("Character Pool initialized with 20 vampires across all factions");
}

// Initialize the character pool
initializeCharacterPool();

// Global loyalty management functions
const LoyaltyManager = {
    // Process action across all coterie members
    processAction(action, description = "") {
        const coterie = characterDB.getCoterieMembers();
        const reactions = [];
        
        Object.values(coterie).forEach(member => {
            const change = member.checkLoyaltyReaction(action);
            if (change !== 0) {
                reactions.push({
                    character: member.name,
                    change: change,
                    newLoyalty: member.loyalty.current,
                    status: member.getLoyaltyStatus()
                });
            }
        });
        
        // Check for any members who need to leave
        const leavers = characterDB.checkCoterieLoalty();
        
        return { reactions, leavers };
    },
    
    // Manual loyalty adjustment
    adjustMemberLoyalty(characterName, amount, reason = "") {
        const coterie = characterDB.getCoterieMembers();
        const member = coterie[characterName];
        
        if (member && member.recruitable) {
            member.adjustLoyalty(amount, reason);
            return {
                character: characterName,
                newLoyalty: member.loyalty.current,
                status: member.getLoyaltyStatus()
            };
        }
        
        return null;
    },
    
    // Get loyalty summary for all coterie members
    getCoterieLoopSummary() {
        const coterie = characterDB.getCoterieMembers();
        const summary = [];
        
        Object.values(coterie).forEach(member => {
            summary.push({
                name: member.name,
                clan: member.clan,
                loyalty: member.loyalty.current,
                status: member.getLoyaltyStatus(),
                likes: member.loyalty.likes,
                dislikes: member.loyalty.dislikes
            });
        });
        
        return summary;
    }
};

console.log("Character Database initialized - Stage 5");
