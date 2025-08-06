// Character Class - Stage 4.5
class Character {
    constructor(name = "", clan = "", imageSrc = "", faction = "camarilla") {
        this.name = name;
        this.clan = clan;
        this.imageSrc = imageSrc;
        this.faction = faction; // Player's faction alignment
        
        // Attributes (1-5 dots each)
        this.attributes = {
            physical: 1,
            social: 1,
            mental: 1
        };
        
        // Base stats
        this.stats = {
            bloodPool: { current: 5, max: 10 },
            humanity: { current: 7, max: 10 },
            resources: this.getStartingResources(clan),
            contacts: this.getStartingContacts(clan)
        };
        
        // Clan-specific traits
        this.traits = this.getClanTraits(clan);
        
        // Coterie (empty at creation)
        this.coterie = [];
        
        // Controlled locations (for map pin coloring)
        this.controlledLocations = [];
        
        // Character flags and history
        this.flags = {
            hasBlueBlood: clan === 'Ventrue',
            generation: 13, // Neonate
            embrace: new Date().getFullYear(),
            experience: 0
        };
    }
    
    getStartingResources(clan) {
        switch(clan) {
            case 'Ventrue': return 35000; // +10k for blue bloods
            case 'Toreador': return 28000; // +3k for connections
            case 'Tremere': return 20000; // Austere
            case 'Brujah': return 22000; // Street smart
            case 'Gangrel': return 18000; // Nomadic
            default: return 25000;
        }
    }
    
    getStartingContacts(clan) {
        switch(clan) {
            case 'Ventrue': return 6; // +1 contact
            case 'Toreador': return 7; // +2 contacts
            case 'Tremere': return 4; // Secretive
            case 'Brujah': return 5; // Standard
            case 'Gangrel': return 3; // Loners
            default: return 5;
        }
    }
    
    getClanTraits(clan) {
        const traits = {
            'Ventrue': {
                bane: 'Blue Blood - Can only feed from mortals of good breeding or above',
                discipline1: 'Dominate',
                discipline2: 'Fortitude',
                discipline3: 'Presence',
                weakness: 'Selective feeding',
                strength: 'Natural leadership and wealth'
            },
            'Toreador': {
                bane: 'Artistic obsession - May become entranced by beauty',
                discipline1: 'Auspex',
                discipline2: 'Celerity',
                discipline3: 'Presence',
                weakness: 'Distracted by art and beauty',
                strength: 'Social connections and artistic insight'
            },
            'Tremere': {
                bane: 'Blood bond to clan hierarchy',
                discipline1: 'Auspex',
                discipline2: 'Dominate',
                discipline3: 'Thaumaturgy',
                weakness: 'Clan loyalty required',
                strength: 'Blood sorcery and knowledge'
            },
            'Brujah': {
                bane: 'Difficulty controlling frenzy when angered',
                discipline1: 'Celerity',
                discipline2: 'Potence',
                discipline3: 'Presence',
                weakness: 'Quick to anger',
                strength: 'Physical prowess and passion'
            },
            'Gangrel': {
                bane: 'Gains animal features when frenzying',
                discipline1: 'Animalism',
                discipline2: 'Fortitude',
                discipline3: 'Protean',
                weakness: 'Bestial features',
                strength: 'Survival instincts and shapeshifting'
            }
        };
        
        return traits[clan] || {
            bane: 'Unknown',
            discipline1: 'None',
            discipline2: 'None',
            discipline3: 'None',
            weakness: 'Unknown',
            strength: 'Unknown'
        };
    }
    
    // Get faction information
    getFactionInfo(faction) {
        const factionData = {
            'camarilla': {
                name: 'Camarilla',
                description: 'The Ivory Tower - Ancient vampires who rule through tradition and hierarchy',
                color: '#c9a96e',
                benefits: 'Political influence, established domains, ancient knowledge'
            },
            'anarchs': {
                name: 'Anarch Movement', 
                description: 'Revolutionary vampires who reject the old ways and embrace freedom',
                color: '#8b0000',
                benefits: 'Flexibility, street connections, modern adaptability'
            },
            'sabbat': {
                name: 'Sabbat',
                description: 'Monstrous vampires who embrace their beast nature and wage war',
                color: '#2c1810', 
                benefits: 'Raw power, fear tactics, supernatural abilities'
            },
            'independent': {
                name: 'Independent',
                description: 'Unaligned vampires who chart their own course through the nights',
                color: '#4a4a4a',
                benefits: 'Freedom of choice, neutral standing, flexibility'
            }
        };
        
        return factionData[faction] || factionData['independent'];
    }
    
    // Get faction color for map pins
    getFactionColor() {
        return this.getFactionInfo(this.faction).color;
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
    
    // Calculate total attribute points (for validation)
    getTotalAttributePoints() {
        return this.attributes.physical + this.attributes.social + this.attributes.mental;
    }
    
    // Validate character is properly built
    isValid() {
        const hasName = this.name.trim().length > 0;
        const hasClan = this.clan !== "";
        const validAttributes = this.getTotalAttributePoints() >= 3 && 
                               Object.values(this.attributes).every(val => val >= 1 && val <= 5);
        
        return hasName && hasClan && validAttributes;
    }
    
    // Convert to save data
    toSaveData() {
        return {
            name: this.name,
            clan: this.clan,
            imageSrc: this.imageSrc,
            faction: this.faction,
            attributes: this.attributes,
            stats: this.stats,
            traits: this.traits,
            coterie: this.coterie,
            controlledLocations: this.controlledLocations,
            flags: this.flags
        };
    }
    
    // Load from save data
    static fromSaveData(data) {
        const character = new Character(data.name, data.clan, data.imageSrc, data.faction);
        character.attributes = data.attributes || character.attributes;
        character.stats = data.stats || character.stats;
        character.traits = data.traits || character.traits;
        character.coterie = data.coterie || character.coterie;
        character.controlledLocations = data.controlledLocations || character.controlledLocations;
        character.flags = data.flags || character.flags;
        return character;
    }
}

// Game State Management
class GameState {
    constructor() {
        console.log('=== GAME STATE INITIALIZATION ===');
        this.currentNight = 1;
        this.currentPhase = 'Dusk';
        this.phases = ['Dusk', 'Night', 'Midnight', 'Dawn'];
        this.phaseIndex = 0;
        this.playerActions = 3; // Actions per turn
        
        // Character reference (will be set when character is created)
        this.character = null;
        
        console.log('Initial phase:', this.currentPhase);
        console.log('Initial phase index:', this.phaseIndex);
        console.log('All phases:', this.phases);
        
        // Player stats
        this.playerStats = {
            bloodPool: { current: 10, max: 10 },
            humanity: { current: 7, max: 10 },
            influence: { current: 3, max: 10 },
            contacts: 5,
            resources: 25000
        };
        
        this.updateUI();
        this.setupEventListeners();
        
        // Start a periodic debug check
        setInterval(() => {
            console.log('=== PERIODIC DEBUG CHECK ===');
            console.log('Current phase:', this.currentPhase);
            console.log('Current phase index:', this.phaseIndex);
            console.log('Expected phase:', this.phases[this.phaseIndex]);
            
            const moonContainer = document.querySelector('.moon-container');
            const header = document.querySelector('.game-header');
            if (moonContainer && header) {
                console.log('Moon container classes:', Array.from(moonContainer.classList));
                console.log('Header classes:', Array.from(header.classList));
            }
            console.log('=== END PERIODIC DEBUG ===');
        }, 5000); // Check every 5 seconds
        
        console.log('=== END INITIALIZATION ===');
    }
    
    setupEventListeners() {
        document.getElementById('nextTurnBtn').addEventListener('click', () => this.nextTurn());
        document.getElementById('saveGameBtn').addEventListener('click', () => this.saveGame());
        document.getElementById('loadGameBtn').addEventListener('click', () => this.loadGame());
        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetGame());
        
        // Debug button for testing phase cycling
        document.getElementById('debugPhaseBtn').addEventListener('click', () => {
            console.log('=== DEBUG PHASE CYCLE ===');
            this.nextTurn();
            console.log('After nextTurn - Phase:', this.currentPhase, 'Index:', this.phaseIndex);
        });
        
        // Action buttons
        document.getElementById('influenceBtn').addEventListener('click', () => this.useInfluence());
        document.getElementById('feedBtn').addEventListener('click', () => this.feed());
        document.getElementById('gatherBtn').addEventListener('click', () => this.gatherIntel());
        document.getElementById('meetBtn').addEventListener('click', () => this.meetContact());
        
        // Character sheet button
        document.getElementById('createCharacterSheetBtn').addEventListener('click', () => {
            // Show character creation screen
            if (typeof introScreenManager !== 'undefined' && introScreenManager) {
                introScreenManager.showCharacterCreation();
            } else {
                console.error('introScreenManager not available');
            }
        });
    }
    
    nextTurn() {
        console.log('=== NEXT TURN DEBUG ===');
        console.log('Current phase index:', this.phaseIndex);
        console.log('Current phase:', this.currentPhase);
        console.log('All phases:', this.phases);
        
        this.phaseIndex = (this.phaseIndex + 1) % this.phases.length;
        this.currentPhase = this.phases[this.phaseIndex];
        
        console.log('NEW phase index:', this.phaseIndex);
        console.log('NEW phase:', this.currentPhase);
        
        // Reset player actions each turn
        this.playerActions = 3;
        
        if (this.phaseIndex === 0) {
            this.currentNight++;
            console.log('New night started:', this.currentNight);
            this.processNightlyEvents();
        }
        
        this.updateUI();
        this.updateMoonAnimation();
        console.log('=== END TURN DEBUG ===');
    }
    
    processNightlyEvents() {
        // Reduce blood pool each night
        this.playerStats.bloodPool.current = Math.max(0, this.playerStats.bloodPool.current - 1);
        
        // Random events that might affect stats
        if (Math.random() < 0.3) {
            this.generateRandomEvent();
        }
    }
    
    generateRandomEvent() {
        const events = [
            { type: 'influence', change: 1, message: 'Your network grows stronger' },
            { type: 'resources', change: 5000, message: 'Business ventures prove profitable' },
            { type: 'contacts', change: 1, message: 'New ally joins your circle' },
            { type: 'humanity', change: -1, message: 'The Beast stirs within' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.applyStatChange(event.type, event.change);
        
        showTelegram('Night Events', event.message, [
            { text: 'Acknowledge', action: 'close' }
        ]);
    }
    
    applyStatChange(stat, change) {
        switch(stat) {
            case 'influence':
                this.playerStats.influence.current = Math.min(this.playerStats.influence.max, 
                    Math.max(0, this.playerStats.influence.current + change));
                break;
            case 'resources':
                this.playerStats.resources = Math.max(0, this.playerStats.resources + change);
                break;
            case 'contacts':
                this.playerStats.contacts = Math.max(0, this.playerStats.contacts + change);
                break;
            case 'humanity':
                this.playerStats.humanity.current = Math.min(this.playerStats.humanity.max, 
                    Math.max(0, this.playerStats.humanity.current + change));
                break;
            case 'bloodPool':
                this.playerStats.bloodPool.current = Math.min(this.playerStats.bloodPool.max, 
                    Math.max(0, this.playerStats.bloodPool.current + change));
                break;
        }
        this.updatePlayerStats();
    }
    
    useInfluence() {
        if (this.playerActions <= 0) {
            showTelegram('No Actions', 'You have no actions remaining this turn.', [
                { text: 'Understood', action: 'close' }
            ]);
            return;
        }
        
        if (this.playerStats.influence.current >= 1) {
            this.playerActions--;
            this.applyStatChange('influence', -1);
            // Increase influence in a random area
            this.playerStats.influence.current = Math.min(10, this.playerStats.influence.current + 1);
            
            showTelegram('Influence Used', `You've expanded your control over ${randomDomain} operations.`, [
                { text: 'Excellent', action: 'close' }
            ]);
        } else {
            showTelegram('Insufficient Influence', 'You need more influence to take this action.', [
                { text: 'Understood', action: 'close' }
            ]);
        }
    }
    
    feed() {
        if (this.playerActions <= 0) {
            showTelegram('No Actions', 'You have no actions remaining this turn.', [
                { text: 'Understood', action: 'close' }
            ]);
            return;
        }
        
        // Check for Ventrue blue blood restriction
        if (this.character && this.character.flags.hasBlueBlood) {
            const feedingOptions = [
                { text: 'Feed from elite social clubs', action: 'feedElite', class: 'primary' },
                { text: 'Visit upscale establishments', action: 'feedUpscale', class: 'success' },
                { text: 'Cancel feeding', action: 'close' }
            ];
            
            showTelegram('Blue Blood Restriction', 'As a Ventrue, you can only feed from mortals of good breeding. Choose your hunting grounds carefully.', feedingOptions);
            return;
        }
        
        if (this.playerStats.bloodPool.current < this.playerStats.bloodPool.max) {
            this.playerActions--;
            this.applyStatChange('bloodPool', 3);
            if (Math.random() < 0.2) {
                this.applyStatChange('humanity', -1);
            }
            
            showTelegram('Feeding', 'You have fed, restoring your vitae. The Beast is sated... for now.', [
                { text: 'Continue', action: 'close' }
            ]);
        } else {
            showTelegram('Already Fed', 'Your blood pool is full. You have no need to feed right now.', [
                { text: 'Understood', action: 'close' }
            ]);
        }
    }
    
    gatherIntel() {
        if (this.playerActions <= 0) {
            showTelegram('No Actions', 'You have no actions remaining this turn.', [
                { text: 'Understood', action: 'close' }
            ]);
            return;
        }
        
        if (this.playerStats.resources >= 1000) {
            this.playerActions--;
            this.applyStatChange('resources', -1000);
            this.applyStatChange('contacts', 1);
            
            showTelegram('Intelligence Gathered', 'Your informants have provided valuable information. New contact acquired.', [
                { text: 'Excellent', action: 'close' }
            ]);
        } else {
            showTelegram('Insufficient Resources', 'You need at least $1,000 to gather intelligence.', [
                { text: 'Understood', action: 'close' }
            ]);
        }
    }
    
    meetContact() {
        if (this.playerActions <= 0) {
            showTelegram('No Actions', 'You have no actions remaining this turn.', [
                { text: 'Understood', action: 'close' }
            ]);
            return;
        }
        
        if (this.playerStats.contacts >= 1) {
            this.playerActions--;
            const outcomes = [
                { influence: 1, message: 'Your contact provides valuable assistance.' },
                { resources: 2000, message: 'Your contact offers a lucrative opportunity.' },
                { humanity: 1, message: 'Your contact reminds you of your mortal past.' }
            ];
            
            const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            const stat = Object.keys(outcome)[0];
            this.applyStatChange(stat, outcome[stat]);
            
            showTelegram('Contact Meeting', outcome.message, [
                { text: 'Thank you', action: 'close' }
            ]);
        } else {
            showTelegram('No Contacts', 'You have no contacts available to meet with.', [
                { text: 'Understood', action: 'close' }
            ]);
        }
    }
    
    saveGame() {
        const gameData = {
            currentNight: this.currentNight,
            currentPhase: this.currentPhase,
            phaseIndex: this.phaseIndex,
            playerActions: this.playerActions,
            playerStats: this.playerStats,
            character: this.character ? this.character.toSaveData() : null,
            saveDate: new Date().toISOString()
        };
        
        localStorage.setItem('vtm-sf-save', JSON.stringify(gameData));
        
        showTelegram('Game Saved', 'Your progress has been saved to local storage.', [
            { text: 'Continue', action: 'close' }
        ]);
    }
    
    loadGame() {
        const savedData = localStorage.getItem('vtm-sf-save');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            
            this.currentNight = gameData.currentNight;
            this.currentPhase = gameData.currentPhase;
            this.phaseIndex = gameData.phaseIndex;
            this.playerActions = gameData.playerActions || 3;
            this.playerStats = gameData.playerStats;
            
            // Load character if available
            if (gameData.character) {
                this.character = Character.fromSaveData(gameData.character);
            }
            
            this.updateUI();
            this.updateMoonAnimation();
            
            const saveDate = new Date(gameData.saveDate).toLocaleDateString();
            const characterName = this.character ? this.character.name : 'Unknown';
            showTelegram('Game Loaded', `Welcome back, ${characterName}. Progress restored from save dated ${saveDate}.`, [
                { text: 'Continue', action: 'close' }
            ]);
        } else {
            showTelegram('No Save Found', 'No saved game found in local storage.', [
                { text: 'Understood', action: 'close' }
            ]);
        }
    }
    
    resetGame() {
        if (confirm('Are you sure you want to start a new game? This will erase your current progress.')) {
            localStorage.removeItem('vtm-sf-save');
            location.reload();
        }
    }
    
    updateUI() {
        document.getElementById('currentNight').textContent = this.currentNight;
        document.getElementById('currentPhase').textContent = this.currentPhase;
        document.getElementById('phaseDebug').textContent = this.phaseIndex;
        
        // Update actions display in the next turn button
        const nextTurnBtn = document.getElementById('nextTurnBtn');
        nextTurnBtn.textContent = `Next Turn (${this.playerActions} actions left)`;
        
        this.updatePlayerStats();
        this.updateCharacterSheet();
        this.updateHeaderBackground();
    }

    // Update character sheet display
    updateCharacterSheet() {
        const characterInfo = document.getElementById('characterInfo');
        const noCharacter = document.getElementById('noCharacter');
        
        if (this.character) {
            // Show character info, hide no character message
            characterInfo.style.display = 'flex';
            noCharacter.style.display = 'none';
            
            // Update character details
            document.getElementById('characterName').textContent = this.character.name || 'Unnamed';
            document.getElementById('characterClan').textContent = `Clan: ${this.character.clan}`;
            document.getElementById('characterFaction').textContent = `Faction: ${this.character.faction || 'Independent'}`;
            
            // Update clan symbol
            const clanSymbol = document.getElementById('characterClanSymbol');
            clanSymbol.src = `./assets/clans/${this.character.clan.toLowerCase()}.png`;
            clanSymbol.alt = `${this.character.clan} Symbol`;
            
            // Update attributes
            document.getElementById('characterPhysical').textContent = this.character.attributes.physical;
            document.getElementById('characterSocial').textContent = this.character.attributes.social;
            document.getElementById('characterMental').textContent = this.character.attributes.mental;
        } else {
            // Show no character message, hide character info
            characterInfo.style.display = 'none';
            noCharacter.style.display = 'block';
        }
    }
    
    updatePlayerStats() {
        // Update blood pool
        const bloodPercentage = (this.playerStats.bloodPool.current / this.playerStats.bloodPool.max) * 100;
        document.getElementById('bloodFill').style.width = bloodPercentage + '%';
        document.getElementById('bloodValue').textContent = 
            `${this.playerStats.bloodPool.current}/${this.playerStats.bloodPool.max}`;
        
        // Update humanity
        const humanityPercentage = (this.playerStats.humanity.current / this.playerStats.humanity.max) * 100;
        document.getElementById('humanityFill').style.width = humanityPercentage + '%';
        document.getElementById('humanityValue').textContent = 
            `${this.playerStats.humanity.current}/${this.playerStats.humanity.max}`;
        
        // Update influence
        const influencePercentage = (this.playerStats.influence.current / this.playerStats.influence.max) * 100;
        document.getElementById('influenceFill').style.width = influencePercentage + '%';
        document.getElementById('influenceValue').textContent = 
            `${this.playerStats.influence.current}/${this.playerStats.influence.max}`;
        
        // Update contacts and resources
        document.getElementById('contactsValue').textContent = this.playerStats.contacts;
        document.getElementById('resourcesValue').textContent = 
            `$${this.playerStats.resources.toLocaleString()}`;
    }
    
    updateHeaderBackground() {
        console.log('=== HEADER BACKGROUND DEBUG ===');
        const header = document.querySelector('.game-header');
        const phaseClass = this.currentPhase.toLowerCase();
        
        if (!header) {
            console.error('Header element not found');
            return;
        }
        
        // Remove existing phase classes
        header.classList.remove('dusk', 'night', 'midnight', 'dawn', 'evening');
        
        // Add current phase class
        header.classList.add(phaseClass);
        
        console.log('Header phase class:', phaseClass);
        console.log('Header classes after update:', Array.from(header.classList));
        
        // Check computed background
        const computedStyle = window.getComputedStyle(header);
        console.log('Header computed background:', computedStyle.background);
        console.log('=== END HEADER BACKGROUND DEBUG ===');
    }
    
    updateMoonAnimation() {
        console.log('=== MOON ANIMATION DEBUG ===');
        const moonContainer = document.querySelector('.moon-container');
        const moonIcon = document.getElementById('moonIcon');
        const moonGlow = document.getElementById('moonGlow');
        
        if (!moonContainer || !moonIcon || !moonGlow) {
            console.error('Moon elements not found:', {
                moonContainer: !!moonContainer,
                moonIcon: !!moonIcon,
                moonGlow: !!moonGlow
            });
            return;
        }
        
        // Remove all existing phase classes
        moonContainer.classList.remove('dusk', 'night', 'midnight', 'dawn', 'evening');
        
        // Add current phase class
        const phaseClass = this.currentPhase.toLowerCase();
        moonContainer.classList.add(phaseClass);
        
        // Keep moon as full moon but change glow intensity and color based on phase
        moonIcon.textContent = '🌕'; // Always full moon
        
        // Log for debugging
        console.log('Current phase:', this.currentPhase);
        console.log('Phase class added:', phaseClass);
        console.log('Moon container classes after update:', Array.from(moonContainer.classList));
        
        // Verify computed styles
        const computedStyle = window.getComputedStyle(moonIcon);
        console.log('Moon icon computed position:', {
            left: computedStyle.left,
            top: computedStyle.top,
            position: computedStyle.position
        });
        
        switch(this.currentPhase) {
            case 'Dusk':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 220, 180, 0.15) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.4';
                console.log('Applied Dusk styling');
                break;
            case 'Night':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.7';
                console.log('Applied Night styling');
                break;
            case 'Midnight':
                moonGlow.style.background = 'radial-gradient(circle, rgba(240, 248, 255, 0.35) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.9';
                console.log('Applied Midnight styling');
                break;
            case 'Dawn':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 240, 245, 0.15) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.3';
                console.log('Applied Dawn styling');
                break;
            default:
                console.warn('Unknown phase:', this.currentPhase);
        }
        console.log('=== END MOON ANIMATION DEBUG ===');
    }
}

// Global game state variable (will be initialized when game starts)
let gameState;

// Important San Francisco locations for vampire politics - Expanded with OSM data structure
const importantLocations = [
    // Banks - Financial power and influence
    { name: "Bank of America Corporate Center", type: "bank", coords: [37.7749, -122.4194], description: "Major financial influence hub", amenity: "bank" },
    { name: "Wells Fargo Bank", type: "bank", coords: [37.7849, -122.4094], description: "Old money connections", amenity: "bank" },
    { name: "Chase Bank Downtown", type: "bank", coords: [37.7889, -122.4074], description: "Corporate banking center", amenity: "bank" },
    { name: "Citibank Financial District", type: "bank", coords: [37.7929, -122.4009], description: "International finance hub", amenity: "bank" },
    { name: "Union Bank", type: "bank", coords: [37.7789, -122.4134], description: "Regional banking power", amenity: "bank" },
    
    // Hospitals & Clinics - Blood sources and medical contacts
    { name: "UCSF Medical Center", type: "hospital", coords: [37.7629, -122.4577], description: "Premier medical facility", amenity: "hospital" },
    { name: "San Francisco General Hospital", type: "hospital", coords: [37.7575, -122.4044], description: "Public hospital with steady blood supply", amenity: "hospital" },
    { name: "California Pacific Medical Center", type: "hospital", coords: [37.7886, -122.4324], description: "Private medical center", amenity: "hospital" },
    { name: "UCSF Parnassus Heights", type: "hospital", coords: [37.7632, -122.4578], description: "Teaching hospital", amenity: "hospital" },
    { name: "Mission Bay Medical Center", type: "hospital", coords: [37.7685, -122.3932], description: "Modern medical complex", amenity: "hospital" },
    { name: "Haight Ashbury Free Clinic", type: "hospital", coords: [37.7692, -122.4481], description: "Community clinic", amenity: "clinic" },
    { name: "North Beach Clinic", type: "hospital", coords: [37.8062, -122.4103], description: "Neighborhood medical center", amenity: "clinic" },
    
    // Government - Political power centers
    { name: "San Francisco City Hall", type: "government", coords: [37.7793, -122.4193], description: "Political power center", amenity: "townhall" },
    { name: "Federal Building", type: "government", coords: [37.7796, -122.4141], description: "Federal authority hub", amenity: "courthouse" },
    { name: "Hall of Justice", type: "government", coords: [37.7541, -122.4058], description: "Criminal justice center", amenity: "courthouse" },
    { name: "SFPD Central Station", type: "government", coords: [37.7957, -122.4053], description: "Police headquarters", amenity: "police" },
    { name: "Fire Department HQ", type: "government", coords: [37.7749, -122.4194], description: "Emergency services", amenity: "fire_station" },
    { name: "Mission Police Station", type: "government", coords: [37.7625, -122.4261], description: "District law enforcement", amenity: "police" },
    
    // Universities - Young blood and academic influence
    { name: "University of San Francisco", type: "university", coords: [37.7762, -122.4505], description: "Private Catholic university", amenity: "university" },
    { name: "San Francisco State University", type: "university", coords: [37.7220, -122.4797], description: "Public university campus", amenity: "university" },
    { name: "Golden Gate University", type: "university", coords: [37.7879, -122.4024], description: "Business and law school", amenity: "university" },
    { name: "Academy of Art University", type: "university", coords: [37.7879, -122.4089], description: "Art and design school", amenity: "college" },
    { name: "City College of San Francisco", type: "university", coords: [37.7253, -122.4526], description: "Community college", amenity: "college" },
    { name: "Lowell High School", type: "university", coords: [37.7408, -122.4629], description: "Elite public school", amenity: "school" },
    
    // Transport - Movement and control points
    { name: "Transbay Terminal", type: "transport", coords: [37.7896, -122.3962], description: "Major transit hub", amenity: "bus_station" },
    { name: "Caltrain Station", type: "transport", coords: [37.7766, -122.3947], description: "Regional rail connection", railway: "station" },
    { name: "Union Square BART", type: "transport", coords: [37.7879, -122.4074], description: "Underground transit", railway: "station" },
    { name: "Ferry Building", type: "transport", coords: [37.7956, -122.3936], description: "Ferry terminal", amenity: "bus_station" },
    { name: "Civic Center BART", type: "transport", coords: [37.7801, -122.4137], description: "Government district transit", railway: "station" },
    
    // Entertainment - Feeding grounds and social hubs
    { name: "The Fillmore", type: "entertainment", coords: [37.7840, -122.4334], description: "Historic music venue", amenity: "theatre" },
    { name: "War Memorial Opera House", type: "entertainment", coords: [37.7788, -122.4213], description: "Elite cultural venue", amenity: "theatre" },
    { name: "AMC Metreon", type: "entertainment", coords: [37.7849, -122.4058], description: "Major cinema complex", amenity: "cinema" },
    { name: "Ruby Skye", type: "entertainment", coords: [37.7873, -122.4072], description: "Upscale nightclub", amenity: "nightclub" },
    { name: "The Tonga Room", type: "entertainment", coords: [37.7919, -122.4103], description: "Tiki bar with wealthy clientele", amenity: "bar" },
    { name: "Top of the Mark", type: "entertainment", coords: [37.7925, -122.4097], description: "Elite rooftop bar", amenity: "bar" },
    { name: "Castro Theatre", type: "entertainment", coords: [37.7615, -122.4349], description: "Historic movie palace", amenity: "cinema" },
    { name: "The Independent", type: "entertainment", coords: [37.7840, -122.4334], description: "Music venue", amenity: "nightclub" },
    
    // Shopping - Commercial influence and feeding
    { name: "Union Square Shopping", type: "shopping", coords: [37.7879, -122.4074], description: "Premier shopping district", amenity: "marketplace" },
    { name: "Westfield San Francisco Centre", type: "shopping", coords: [37.7847, -122.4058], description: "Major shopping mall", shop: "mall" },
    { name: "Ghirardelli Square", type: "shopping", coords: [37.8057, -122.4229], description: "Tourist shopping destination", amenity: "marketplace" },
    { name: "Pier 39", type: "shopping", coords: [37.8086, -122.4098], description: "Waterfront shopping", amenity: "marketplace" },
    { name: "Haight Street Shopping", type: "shopping", coords: [37.7692, -122.4481], description: "Bohemian shopping district", shop: "various" },
    { name: "Chinatown Markets", type: "shopping", coords: [37.7946, -122.4072], description: "Traditional markets", amenity: "marketplace" },
    
    // Blood Drives - Easy feeding opportunities
    { name: "American Red Cross SF", type: "blood", coords: [37.7749, -122.4094], description: "Regular blood drive location" },
    { name: "Blood Centers of the Pacific", type: "blood", coords: [37.7649, -122.4194], description: "Blood donation center" },
    { name: "UCSF Blood Drive", type: "blood", coords: [37.7629, -122.4577], description: "Hospital blood collection" },
    { name: "Mission Community Blood Drive", type: "blood", coords: [37.7625, -122.4261], description: "Community donation event" }
];

// Initialize the map centered on San Francisco
const sanFranciscoBounds = [
    [37.639830, -123.173825], // Southwest corner
    [37.929824, -122.281780]  // Northeast corner
];

const map = L.map('map', {
    center: [37.7749, -122.4194],
    zoom: 12,
    maxBounds: sanFranciscoBounds,
    maxBoundsViscosity: 1.0
});

// Dark theme tile layer for gothic atmosphere
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Custom icons for different location types - expanded
const locationIcons = {
    bank: '🏦',
    hospital: '🏥',
    government: '🏛️',
    university: '🎓',
    transport: '🚌',
    entertainment: '�',
    shopping: '🛍️',
    blood: '🩸'
};

// Function to create custom markers
function createLocationMarker(location) {
    // Check if this location is controlled by the player's character or faction
    const isControlled = gameState.character && 
        gameState.character.controlledLocations && 
        gameState.character.controlledLocations.includes(location.name);
    
    // Get faction color if controlled, otherwise use grey
    let markerColor = isControlled && gameState.character && gameState.character.faction 
        ? factionColors[gameState.character.faction] 
        : '#666666'; // Default grey for uncontrolled
    
    const icon = L.divIcon({
        html: `<div class="custom-marker ${location.type}" style="color: ${markerColor}; filter: ${isControlled ? 'none' : 'grayscale(100%)'}">${locationIcons[location.type]}</div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const marker = L.marker(location.coords, { icon: icon }).addTo(map);
    
    // Create popup content
    const popupContent = `
        <div class="location-popup">
            <h4>${location.name}</h4>
            <div class="location-type">${location.type.charAt(0).toUpperCase() + location.type.slice(1)}</div>
            <p>${location.description}</p>
            <p class="location-status">Status: ${isControlled ? 'Controlled by your faction' : 'Uncontrolled'}</p>
            <div class="location-actions">
                <button class="popup-action-btn" onclick="handleLocationAction('${location.type}', '${location.name}')">
                    ${getActionText(location.type)}
                </button>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    return marker;
}

// Get appropriate action text based on location type
function getActionText(type) {
    switch(type) {
        case 'bank': return 'Influence';
        case 'hospital': return 'Investigate';
        case 'government': return 'Lobby';
        case 'university': return 'Recruit';
        case 'transport': return 'Control';
        case 'entertainment': return 'Feed';
        case 'shopping': return 'Influence';
        case 'blood': return 'Acquire';
        default: return 'Interact';
    }
}

// Handle location actions
function handleLocationAction(type, locationName) {
    if (gameState.playerActions <= 0) {
        showTelegram("Insufficient Actions", "No actions remaining this turn! Wait for the next phase.", [
            { text: "Understood", action: "close" }
        ]);
        return;
    }
    
    gameState.playerActions--;
    
    const interactions = {
        bank: {
            sender: "Financial Contact",
            message: `You approach ${locationName} under the cover of darkness. Your supernatural charm works on the night security guard, granting you access to sensitive financial records. Your influence in the banking sector grows stronger.`,
            buttons: [
                { text: "Establish deeper connections", action: "deeperBank", class: "primary" },
                { text: "Gather intelligence on rivals", action: "gatherIntel", class: "success" },
                { text: "Leave quietly", action: "close" }
            ]
        },
        hospital: {
            sender: "Medical Informant",
            message: `At ${locationName}, you blend in with the late-night staff. The scent of blood is intoxicating, but you maintain control. You've identified several potential feeding opportunities and made contact with a night shift nurse who might prove useful.`,
            buttons: [
                { text: "Recruit the nurse", action: "recruitNurse", class: "primary" },
                { text: "Secure blood bags", action: "secureBlood", class: "danger" },
                { text: "Study security patterns", action: "studySecurity", class: "success" },
                { text: "Leave immediately", action: "close" }
            ]
        },
        government: {
            sender: "Political Insider",
            message: `Your presence at ${locationName} doesn't go unnoticed, but your supernatural abilities allow you to influence key personnel. You've planted seeds of suggestion in the minds of several bureaucrats. Political power is within your grasp.`,
            buttons: [
                { text: "Expand political network", action: "expandNetwork", class: "primary" },
                { text: "Access classified files", action: "accessFiles", class: "danger" },
                { text: "Arrange future meetings", action: "arrangeMeetings", class: "success" },
                { text: "Withdraw for now", action: "close" }
            ]
        },
        university: {
            sender: "Academic Contact",
            message: `The young minds at ${locationName} are so susceptible to your influence. You've identified several promising students who could serve your purposes. The future belongs to those who shape the next generation.`,
            buttons: [
                { text: "Recruit promising students", action: "recruitStudents", class: "primary" },
                { text: "Influence faculty", action: "influenceFaculty", class: "success" },
                { text: "Establish safe haven", action: "establishHaven", class: "danger" },
                { text: "Leave campus", action: "close" }
            ]
        },
        transport: {
            sender: "Transit Authority",
            message: `Control over ${locationName} grants you significant influence over the city's movement patterns. Your supernatural abilities allow you to manipulate schedules and routes. The city's arteries now pulse to your rhythm.`,
            buttons: [
                { text: "Establish surveillance network", action: "establishSurveillance", class: "primary" },
                { text: "Control rival movements", action: "controlRivals", class: "danger" },
                { text: "Secure escape routes", action: "secureRoutes", class: "success" },
                { text: "Step back", action: "close" }
            ]
        },
        entertainment: {
            sender: "Night Life Contact",
            message: `The pulsing music and flowing alcohol at ${locationName} create the perfect cover for feeding. You move through the crowd like a predator, selecting your prey carefully. The hunger subsides, but the thrill of the hunt remains.`,
            buttons: [
                { text: "Feed again (risky)", action: "feedAgain", class: "danger" },
                { text: "Recruit club staff", action: "recruitStaff", class: "primary" },
                { text: "Gather social intel", action: "gatherSocial", class: "success" },
                { text: "Leave satisfied", action: "close" }
            ]
        },
        shopping: {
            sender: "Commercial Contact",
            message: `Your influence over ${locationName} grows as you charm merchants and manipulate consumer behavior. Money flows like blood, and you've positioned yourself to benefit from both. Commerce bends to your will.`,
            buttons: [
                { text: "Establish business front", action: "establishBusiness", class: "primary" },
                { text: "Manipulate prices", action: "manipulatePrices", class: "danger" },
                { text: "Gather economic intelligence", action: "gatherEconomic", class: "success" },
                { text: "Complete transaction", action: "close" }
            ]
        },
        blood: {
            sender: "Blood Bank Contact",
            message: `Your visit to ${locationName} proves fruitful. Using your supernatural abilities, you've secured additional blood supplies without raising suspicion. Your reserves are bolstered, ensuring you won't go hungry soon.`,
            buttons: [
                { text: "Secure more supplies", action: "secureMore", class: "primary" },
                { text: "Establish regular access", action: "establishAccess", class: "success" },
                { text: "Leave with current supplies", action: "close" }
            ]
        }
    };
    
    const interaction = interactions[type];
    if (interaction) {
        showTelegram(interaction.sender, interaction.message, interaction.buttons);
    } else {
        showTelegram("Unknown Contact", "You interact with the location, but nothing significant happens.", [
            { text: "Continue", action: "close" }
        ]);
    }
    
    gameState.updateUI();
}

// Telegram system functions
function showTelegram(sender, message, buttons) {
    const popup = document.getElementById('telegramPopup');
    const senderElement = document.getElementById('telegramSender');
    const messageElement = document.getElementById('telegramMessage');
    const actionsElement = document.getElementById('telegramActions');
    
    // Set content
    senderElement.textContent = sender;
    messageElement.textContent = message;
    
    // Clear previous buttons
    actionsElement.innerHTML = '';
    
    // Add new buttons
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = `telegram-action-btn ${button.class || ''}`;
        btn.textContent = button.text;
        btn.onclick = () => handleTelegramAction(button.action, button.data);
        actionsElement.appendChild(btn);
    });
    
    // Show popup
    popup.classList.remove('hidden');
}

function closeTelegram() {
    const popup = document.getElementById('telegramPopup');
    popup.classList.add('hidden');
}

function handleTelegramAction(action, data) {
    if (action === 'close') {
        closeTelegram();
        gameState.updateUI();
        return;
    }
    
    // Handle different actions
    switch(action) {
        // Bank actions
        case 'deeperBank':
            gameState.applyStatChange('influence', 1);
            gameState.playerStats.resources += 5000;
            gameState.playerStats.influence.current = Math.min(10, gameState.playerStats.influence.current + 1);
            showTelegram("Financial Contact", "You establish deeper connections within the banking system. Your financial influence grows significantly, but you've also attracted attention from other vampires who covet such power.", [
                { text: "Prepare for challenges", action: "close", class: "primary" }
            ]);
            break;
            
        // Hospital actions
        case 'recruitNurse':
            gameState.applyStatChange('contacts', 1);
            gameState.playerStats.bloodPool.current = Math.min(10, gameState.playerStats.bloodPool.current + 1);
            gameState.playerStats.contacts += 1;
            showTelegram("Medical Informant", "The night shift nurse is now under your influence. She will provide you with inside information about patient schedules and blood storage. A valuable asset indeed.", [
                { text: "Excellent", action: "close", class: "success" }
            ]);
            break;
            
        case 'secureBlood':
            gameState.applyStatChange('bloodPool', 5);
            if (Math.random() < 0.3) {
                gameState.applyStatChange('humanity', -1);
            }
            showTelegram("Medical Informant", "You've secured several blood bags without detection. Your hunger is completely satisfied, and you have reserves for future emergencies. The risk was worth the reward.", [
                { text: "Store safely", action: "close", class: "success" }
            ]);
            break;
            
        // Government actions
        case 'expandNetwork':
            gameState.applyStatChange('influence', 2);
            gameState.playerStats.influence.current = Math.min(10, gameState.playerStats.influence.current + 2);
            gameState.playerStats.resources += 2000;
            showTelegram("Political Insider", "Your political network expands significantly. You now have contacts in multiple government departments, giving you unprecedented access to city planning and policy decisions.", [
                { text: "Use this power wisely", action: "close", class: "primary" }
            ]);
            break;
            
        case 'accessFiles':
            gameState.applyStatChange('contacts', 2);
            showTelegram("Political Insider", "You've gained access to classified files revealing the locations of other vampire activities in the city. This information could be valuable... or dangerous.", [
                { text: "Study the intelligence", action: "close", class: "danger" }
            ]);
            break;
            
        // University actions
        case 'recruitStudents':
            gameState.applyStatChange('contacts', 2);
            gameState.playerStats.influence.current = Math.min(10, gameState.playerStats.influence.current + 1);
            gameState.playerStats.contacts += 2;
            showTelegram("Academic Contact", "Several promising students now serve your interests. They will act as your eyes and ears on campus, reporting on faculty activities and potential threats.", [
                { text: "Build student network", action: "close", class: "primary" }
            ]);
            break;
            
        // Transport actions
        case 'establishSurveillance':
            gameState.applyStatChange('influence', 1);
            gameState.applyStatChange('contacts', 1);
            showTelegram("Transit Authority", "Your surveillance network is now active across the city's transport system. You can track the movements of rivals and allies alike through security cameras and schedule monitoring.", [
                { text: "Monitor the city", action: "close", class: "primary" }
            ]);
            break;
            
        // Entertainment actions
        case 'feedAgain':
            if (Math.random() > 0.7) {
                gameState.applyStatChange('humanity', -2);
                showTelegram("Masquerade Breach", "Your second feeding attempt was too bold! A patron noticed your supernatural nature. You must act quickly to contain this breach of the Masquerade.", [
                    { text: "Use dominate", action: "close", class: "danger" },
                    { text: "Eliminate witness", action: "close", class: "danger" }
                ]);
            } else {
                gameState.applyStatChange('bloodPool', 3);
                showTelegram("Night Life Contact", "Your second feeding was successful, but risky. You're completely satiated now, but some patrons seem disturbed by the evening's events.", [
                    { text: "Leave immediately", action: "close", class: "success" }
                ]);
            }
            break;
            
        // Shopping actions
        case 'establishBusiness':
            gameState.applyStatChange('resources', 10000);
            gameState.playerStats.bloodPool.current = Math.min(10, gameState.playerStats.bloodPool.current + 2);
            gameState.playerStats.resources += 1000;
            showTelegram("Commercial Contact", "You've established a legitimate business front in the shopping district. This will provide both income and cover for your vampiric activities.", [
                { text: "Manage the business", action: "close", class: "success" }
            ]);
            break;
            
        // Blood bank actions
        case 'secureMore':
            gameState.applyStatChange('bloodPool', 7);
            if (Math.random() < 0.4) {
                gameState.applyStatChange('humanity', -1);
            }
            showTelegram("Blood Bank Contact", "You've secured additional blood supplies, but the quantity you've taken may be noticed. Your reserves are substantial, but scrutiny may follow.", [
                { text: "Lay low for now", action: "close", class: "danger" }
            ]);
            break;
            
        // Ventrue feeding actions
        case 'feedElite':
            gameState.playerActions--;
            gameState.applyStatChange('bloodPool', 4); // Better feeding for Ventrue
            if (Math.random() < 0.1) { // Lower humanity loss risk
                gameState.applyStatChange('humanity', -1);
            }
            showTelegram("Elite Feeding", "You feed from the social elite at an exclusive club. The quality blood satisfies your refined palate completely, though the risk of exposure was significant.", [
                { text: "Excellent vintage", action: "close", class: "primary" }
            ]);
            break;
            
        case 'feedUpscale':
            gameState.playerActions--;
            gameState.applyStatChange('bloodPool', 3);
            if (Math.random() < 0.15) {
                gameState.applyStatChange('humanity', -1);
            }
            showTelegram("Upscale Feeding", "You feed from well-bred mortals at an upscale establishment. While not perfect, their blood meets your standards as a Ventrue.", [
                { text: "Adequate sustenance", action: "close", class: "success" }
            ]);
            break;
            
        // General action buttons
        case 'gatherIntel':
            gameState.applyStatChange('contacts', 1);
            showTelegram("Information Network", "Your intelligence gathering reveals rival vampire movements in the financial district. This information could be valuable for future operations.", [
                { text: "File intelligence", action: "close", class: "success" }
            ]);
            break;
            
        case 'learnRivals':
            gameState.applyStatChange('contacts', 1);
            showTelegram("Information Broker", "Your informants reveal that the Tremere clan has been expanding their influence in the university district, while the Ventrue control most of the financial sector. The Brujah are restless in the entertainment areas.", [
                { text: "Adjust strategy", action: "close", class: "primary" }
            ]);
            break;
            
        case 'studyPower':
            gameState.applyStatChange('influence', 1);
            showTelegram("Information Broker", "The city's power structure is more complex than it appears. The mayor has vampire advisors, the police chief is under supernatural influence, and several corporate boards have undead members.", [
                { text: "Plan accordingly", action: "close", class: "success" }
            ]);
            break;
            
        default:
            showTelegram("Unknown Contact", "The shadows whisper of events yet to unfold. Your actions have consequences that will reveal themselves in time.", [
                { text: "Continue", action: "close" }
            ]);
            break;
    }
}

// Close telegram when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('telegramPopup');
    const telegramWindow = document.querySelector('.telegram-window');
    
    if (e.target === popup && !telegramWindow.contains(e.target)) {
        closeTelegram();
    }
});

// Add all important locations to the map
// Initialize important locations and markers on map
importantLocations.forEach(location => {
    createLocationMarker(location);
});

// Function to refresh map markers with current character/faction colors
function refreshMapMarkers() {
    // Clear existing markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Re-add markers with updated colors
    importantLocations.forEach(location => {
        createLocationMarker(location);
    });
}

// Add custom CSS for markers
const style = document.createElement('style');
style.textContent = `
    .custom-marker {
        background: rgba(139, 0, 0, 0.9);
        border: 2px solid #8b0000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.6);
        transition: all 0.3s ease;
    }
    
    .custom-marker:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(139, 0, 0, 0.8);
    }
    
    .custom-marker.bank { background: rgba(255, 215, 0, 0.9); border-color: #ffd700; color: #000; }
    .custom-marker.hospital { background: rgba(255, 255, 255, 0.9); border-color: #fff; color: #000; }
    .custom-marker.government { background: rgba(128, 128, 128, 0.9); border-color: #808080; color: #fff; }
    .custom-marker.university { background: rgba(0, 100, 200, 0.9); border-color: #0064c8; color: #fff; }
    .custom-marker.transport { background: rgba(255, 165, 0, 0.9); border-color: #ffa500; color: #000; }
    .custom-marker.entertainment { background: rgba(139, 0, 139, 0.9); border-color: #8b008b; color: #fff; }
    .custom-marker.shopping { background: rgba(50, 205, 50, 0.9); border-color: #32cd32; color: #000; }
    .custom-marker.blood { background: rgba(220, 20, 60, 0.9); border-color: #dc143c; color: #fff; }
    
    .custom-div-icon {
        background: transparent !important;
        border: none !important;
    }
`;
document.head.appendChild(style);

// Set minimum zoom to prevent zooming out too far
map.setMinZoom(11);

// Handle window resize events to keep map properly sized
window.addEventListener('resize', () => {
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
});

// Event listeners
document.getElementById('nextTurnBtn').addEventListener('click', () => {
    gameState.nextTurn();
});

// Action button event listeners
document.getElementById('influenceBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        showTelegram("Strategic Advisor", "Your network of informants suggests focusing on key influence points throughout the city. Banks and government buildings offer the most political leverage, while shopping centers provide economic control.", [
            { text: "Target financial institutions", action: "targetFinancial", class: "primary" },
            { text: "Focus on government buildings", action: "targetGovernment", class: "success" },
            { text: "Infiltrate commercial districts", action: "targetCommercial", class: "danger" },
            { text: "Cancel", action: "close" }
        ]);
    } else {
        showTelegram("Strategic Advisor", "You lack the energy to pursue any influence operations this turn. Wait for the next phase to regain your strength.", [
            { text: "Understood", action: "close" }
        ]);
    }
});

document.getElementById('feedBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        showTelegram("Hunger", "The Beast within stirs, demanding sustenance. You must feed to maintain your strength and sanity. Choose your hunting grounds carefully to avoid breaking the Masquerade.", [
            { text: "Hunt at entertainment venues", action: "huntEntertainment", class: "primary" },
            { text: "Seek medical facilities", action: "huntMedical", class: "success" },
            { text: "Target university campuses", action: "huntUniversity", class: "danger" },
            { text: "Resist the hunger", action: "close" }
        ]);
    } else {
        showTelegram("Hunger", "You are too weakened to hunt effectively this turn. The Beast will have to wait until the next phase.", [
            { text: "Endure", action: "close" }
        ]);
    }
});

document.getElementById('gatherBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        showTelegram("Information Broker", "Knowledge is power in the world of the undead. Your network of informants has gathered intelligence about vampire politics, rival movements, and potential opportunities in the city.", [
            { text: "Learn about rival vampires", action: "learnRivals", class: "primary" },
            { text: "Study city power structures", action: "studyPower", class: "success" },
            { text: "Investigate recent events", action: "investigateEvents", class: "danger" },
            { text: "Dismiss informant", action: "close" }
        ]);
    } else {
        showTelegram("Information Broker", "Your informants require payment for their services, but you lack the resources this turn. Return when you have regained your strength.", [
            { text: "Return later", action: "close" }
        ]);
    }
});

document.getElementById('meetBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        showTelegram("Clandestine Contact", "The shadows conceal many secrets, and tonight offers opportunities for important meetings. Government buildings and transport hubs provide secure locations for vampire political discussions.", [
            { text: "Arrange political meeting", action: "arrangePolitical", class: "primary" },
            { text: "Meet academic contacts", action: "meetAcademic", class: "success" },
            { text: "Coordinate with allies", action: "coordinateAllies", class: "danger" },
            { text: "Postpone meetings", action: "close" }
        ]);
    } else {
        showTelegram("Clandestine Contact", "You lack the energy to engage in vampire politics this turn. Important meetings require your full attention and supernatural presence.", [
            { text: "Wait for better timing", action: "close" }
        ]);
    }
});

// ========== INTRO SCREEN FUNCTIONALITY ==========

// Intro screen management
class IntroScreen {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log('Setting up intro screen event listeners...');
        
        // Start Game button - now leads to character creation
        const startBtn = document.getElementById('startBtn');
        const loadBtn = document.getElementById('loadBtn');
        
        console.log('Start button found:', startBtn);
        console.log('Load button found:', loadBtn);
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Start button clicked!');
                this.showCharacterCreation();
            });
        } else {
            console.error('Start button not found!');
        }
        
        // Load Game button
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                console.log('Load button clicked!');
                this.loadExistingGame();
            });
        } else {
            console.error('Load button not found!');
        }
        
        // Disabled buttons (Options and Exit) - no functionality for now
        const optionsBtn = document.getElementById('optionsBtn');
        const exitBtn = document.getElementById('exitBtn');
        
        if (optionsBtn) {
            optionsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Options button clicked (disabled)');
                // No functionality yet - button is disabled
            });
        }
        
        if (exitBtn) {
            exitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Exit button clicked (disabled)');
                // No functionality yet - button is disabled
            });
        }
    }
    
    showCharacterCreation() {
        console.log('showCharacterCreation called!');
        
        try {
            const introScreen = document.getElementById('introScreen');
            const characterCreationScreen = document.getElementById('characterCreationScreen');
            
            console.log('Intro screen element:', introScreen);
            console.log('Character creation screen element:', characterCreationScreen);
            
            if (!introScreen) {
                console.error('Intro screen element not found!');
                return;
            }
            
            if (!characterCreationScreen) {
                console.error('Character creation screen element not found!');
                return;
            }
            
            introScreen.classList.add('hidden');
            
            setTimeout(() => {
                characterCreationScreen.classList.remove('hidden');
                console.log('Character creation screen should now be visible');
            }, 1000);
        } catch (error) {
            console.error('Error in showCharacterCreation:', error);
        }
    }
    
    startGameWithCharacter(character) {
        const characterCreationScreen = document.getElementById('characterCreationScreen');
        const gameScreen = document.getElementById('gameScreen');
        
        characterCreationScreen.classList.add('hidden');
        
        setTimeout(() => {
            gameScreen.classList.remove('hidden');
            this.initializeGameWithCharacter(character);
            
            // Fix map rendering after screen transition
            setTimeout(() => {
                if (typeof map !== 'undefined') {
                    map.invalidateSize();
                    console.log('Map size invalidated after character creation');
                }
            }, 100);
        }, 1000);
    }
    
    loadExistingGame() {
        console.log('loadExistingGame called!');
        
        try {
            const savedData = localStorage.getItem('vtm-sf-save');
            
            console.log('Saved data found:', !!savedData);
            
            if (savedData) {
                const confirmLoad = confirm('Load existing save game? This will start from your last saved progress.');
                
                if (confirmLoad) {
                    const introScreen = document.getElementById('introScreen');
                    const gameScreen = document.getElementById('gameScreen');
                    
                    console.log('Intro screen element:', introScreen);
                    console.log('Game screen element:', gameScreen);
                    
                    if (!introScreen || !gameScreen) {
                        console.error('Required screen elements not found!');
                        return;
                    }
                    
                    introScreen.classList.add('hidden');
                    
                    setTimeout(() => {
                        gameScreen.classList.remove('hidden');
                        if (!gameState) {
                            gameState = new GameState();
                        }
                        gameState.loadGame();
                        
                        // Fix map rendering after screen transition
                        setTimeout(() => {
                            if (typeof map !== 'undefined') {
                                map.invalidateSize();
                                console.log('Map size invalidated after loading game');
                            }
                        }, 100);
                    }, 1000);
                }
            } else {
                alert('No saved game found. Starting character creation instead.');
                this.showCharacterCreation();
            }
        } catch (error) {
            console.error('Error in loadExistingGame:', error);
        }
    }
    
    initializeGameWithCharacter(character) {
        // Initialize game state with character
        gameState = new GameState();
        gameState.character = character;
        
        // Apply character's starting stats to game state
        gameState.playerStats = {
            bloodPool: character.stats.bloodPool,
            humanity: character.stats.humanity,
            influence: { current: 3, max: 10 }, // Standard starting influence
            contacts: character.stats.contacts,
            resources: character.stats.resources
        };
        
        // Reset game progression
        gameState.currentNight = 1;
        gameState.currentPhase = 'Dusk';
        gameState.phaseIndex = 0;
        gameState.playerActions = 3;
        
        // Update all UI elements
        gameState.updateUI();
        gameState.updateMoonAnimation();
        
        // Refresh map markers with new character faction colors
        if (typeof refreshMapMarkers === 'function') {
            refreshMapMarkers();
        }
        
        // Show welcome message with character name
        setTimeout(() => {
            showTelegram('Welcome, ' + character.name, `Welcome to San Francisco by Night, ${character.name} of Clan ${character.clan}. The Prince has granted you a small territory to prove your worth. Build your influence, expand your domain, and survive the political machinations of the Camarilla. Remember: the First Tradition above all - Maintain the Masquerade.`, [
                { text: 'Begin my unlife', action: 'close', class: 'primary' }
            ]);
        }, 500);
    }
    
    // Method to return to intro screen (for future use)
    showIntroScreen() {
        const introScreen = document.getElementById('introScreen');
        const gameScreen = document.getElementById('gameScreen');
        const characterCreationScreen = document.getElementById('characterCreationScreen');
        
        gameScreen.classList.add('hidden');
        characterCreationScreen.classList.add('hidden');
        
        setTimeout(() => {
            introScreen.classList.remove('hidden');
        }, 1000);
    }
}

// Character Creation Management
class CharacterCreation {
    constructor() {
        console.log('CharacterCreation constructor called');
        
        try {
            this.character = new Character();
            this.maxAttributePoints = 7; // Total points to spend (3 base + 4 extra)
            this.setupEventListeners();
            this.updateUI();
            console.log('CharacterCreation initialized successfully');
        } catch (error) {
            console.error('Error in CharacterCreation constructor:', error);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up CharacterCreation event listeners...');
        
        try {
            // Portrait upload
            const portraitBtn = document.getElementById('portraitBtn');
            const portraitInput = document.getElementById('portraitInput');
            const portraitPlaceholder = document.getElementById('portraitPlaceholder');
            
            if (portraitBtn && portraitInput && portraitPlaceholder) {
                portraitBtn.addEventListener('click', () => {
                    portraitInput.click();
                });
                
                portraitInput.addEventListener('change', (e) => {
                    this.handleImageUpload(e);
                });
                
                portraitPlaceholder.addEventListener('click', () => {
                    portraitInput.click();
                });
            } else {
                console.warn('Some portrait elements not found:', { portraitBtn, portraitInput, portraitPlaceholder });
            }
            
            // Character name
            const characterNameInput = document.getElementById('characterName');
            if (characterNameInput) {
                characterNameInput.addEventListener('input', (e) => {
                    this.character.name = e.target.value;
                    this.validateCharacter();
                });
            } else {
                console.warn('Character name input not found');
            }
            
            // Attribute dots
            this.setupAttributeDots();
            
            // Clan selection
            const clanSelect = document.getElementById('clanSelect');
            if (clanSelect) {
                clanSelect.addEventListener('change', (e) => {
                    this.character.clan = e.target.value;
                    this.character.stats.resources = this.character.getStartingResources(e.target.value);
                    this.character.stats.contacts = this.character.getStartingContacts(e.target.value);
                    this.character.traits = this.character.getClanTraits(e.target.value);
                    this.updateClanInfo();
                    this.updateStatsPreview();
                    this.validateCharacter();
                });
            }
            
            // Faction selection
            const factionSelect = document.getElementById('factionSelect');
            if (factionSelect) {
                factionSelect.addEventListener('change', (e) => {
                    this.character.faction = e.target.value;
                    this.updateFactionInfo();
                    this.validateCharacter();
                });
            }
            
            // Back to intro
            const backToIntroBtn = document.getElementById('backToIntroBtn');
            if (backToIntroBtn) {
                backToIntroBtn.addEventListener('click', () => {
                    introScreenManager.showIntroScreen();
                });
            }
            
            // Create character
            const createCharacterBtn = document.getElementById('createCharacterBtn');
            if (createCharacterBtn) {
                createCharacterBtn.addEventListener('click', () => {
                    if (this.character.isValid()) {
                        introScreenManager.startGameWithCharacter(this.character);
                    }
                });
            }
            
            console.log('CharacterCreation event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up CharacterCreation event listeners:', error);
        }
    }
    
    setupAttributeDots() {
        ['physical', 'social', 'mental'].forEach(attribute => {
            const dotsContainer = document.getElementById(attribute + 'Dots');
            const dots = dotsContainer.querySelectorAll('.dot');
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    const newValue = index + 1;
                    const currentValue = this.character.attributes[attribute];
                    
                    // Calculate current total points used
                    const currentTotal = this.character.getTotalAttributePoints();
                    const pointsUsed = currentTotal - 3; // Subtract base 3 points
                    const pointsAvailable = this.maxAttributePoints - pointsUsed;
                    const pointsNeeded = newValue - currentValue;
                    
                    // Check if we have enough points
                    if (pointsNeeded > pointsAvailable) {
                        return; // Not enough points
                    }
                    
                    // Update attribute
                    this.character.attributes[attribute] = newValue;
                    this.updateAttributeDisplay(attribute, newValue);
                    this.updateAttributePoints();
                    this.validateCharacter();
                });
            });
        });
    }
    
    updateAttributeDisplay(attribute, value) {
        const dotsContainer = document.getElementById(attribute + 'Dots');
        const dots = dotsContainer.querySelectorAll('.dot');
        const valueDisplay = document.getElementById(attribute + 'Value');
        
        dots.forEach((dot, index) => {
            if (index < value) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        valueDisplay.textContent = value;
    }
    
    updateAttributePoints() {
        const totalUsed = this.character.getTotalAttributePoints();
        const pointsUsed = totalUsed - 3; // Subtract base 3 points
        const pointsRemaining = this.maxAttributePoints - pointsUsed;
        
        const display = document.getElementById('attributePoints');
        display.textContent = `(${pointsRemaining} points remaining)`;
        
        if (pointsRemaining < 0) {
            display.style.color = '#ff4444';
        } else if (pointsRemaining === 0) {
            display.style.color = '#44ff44';
        } else {
            display.style.color = '#8b0000';
        }
    }
    
    updateClanInfo() {
        const clanInfo = document.getElementById('clanInfo');
        const clan = this.character.clan;
        
        if (!clan) {
            clanInfo.innerHTML = '<p class="clan-description">Select a clan to see their traits and abilities.</p>';
            return;
        }
        
        const traits = this.character.traits;
        clanInfo.innerHTML = `
            <div class="clan-details">
                <div class="clan-image">
                    <img src="./assets/clans/${clan.toLowerCase()}.png" 
                         alt="${clan} Symbol" 
                         class="clan-preview-symbol"
                         onerror="this.style.display='none'">
                </div>
                <div class="clan-text">
                    <p class="clan-description">${this.getClanDescription(clan)}</p>
                    <div class="clan-traits">
                        <strong>Disciplines:</strong> ${traits.discipline1}, ${traits.discipline2}, ${traits.discipline3}<br>
                        <strong>Bane:</strong> ${traits.bane}<br>
                        <strong>Strength:</strong> ${traits.strength}
                    </div>
                </div>
            </div>
        `;
    }
    
    updateFactionInfo() {
        const factionInfo = document.getElementById('factionInfo');
        const faction = this.character.faction;
        
        const factionData = this.character.getFactionInfo(faction);
        factionInfo.innerHTML = `
            <p class="faction-description">${factionData.description}</p>
            <div class="faction-traits" style="color: ${factionData.color};">
                <strong>Benefits:</strong> ${factionData.benefits}<br>
                <strong>Pin Color:</strong> <span style="background: ${factionData.color}; padding: 2px 8px; border-radius: 3px; color: #fff;">${factionData.color}</span>
            </div>
        `;
    }
    
    getClanDescription(clan) {
        const descriptions = {
            'Ventrue': 'The aristocratic Blue Bloods who rule from the shadows with wealth and authority.',
            'Toreador': 'Passionate artists and socialites who see beauty in eternal unlife.',
            'Tremere': 'Secretive blood sorcerers bound by rigid hierarchy and mystical power.',
            'Brujah': 'Rebellious idealists who fight against oppression with fist and fury.',
            'Gangrel': 'Nomadic survivors who embrace their bestial nature and freedom.'
        };
        return descriptions[clan] || 'Ancient bloodline with mysterious origins.';
    }
    
    updateStatsPreview() {
        const resources = document.getElementById('resourcesPreview');
        const contacts = document.getElementById('contactsPreview');
        
        resources.textContent = `$${this.character.stats.resources.toLocaleString()}`;
        contacts.textContent = this.character.stats.contacts;
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.match(/^image\/(png|jpe?g)$/)) {
            alert('Please select a PNG or JPEG image file.');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image file must be smaller than 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('characterPortrait');
            const placeholder = document.getElementById('portraitPlaceholder');
            
            img.src = e.target.result;
            img.classList.remove('hidden');
            placeholder.classList.add('hidden');
            
            this.character.imageSrc = e.target.result;
            this.validateCharacter();
        };
        
        reader.readAsDataURL(file);
    }
    
    validateCharacter() {
        const createBtn = document.getElementById('createCharacterBtn');
        const isValid = this.character.isValid();
        const pointsUsed = this.character.getTotalAttributePoints() - 3;
        const withinPointLimit = pointsUsed <= (this.maxAttributePoints - 3);
        
        if (isValid && withinPointLimit) {
            createBtn.classList.remove('disabled');
        } else {
            createBtn.classList.add('disabled');
        }
    }
    
    updateUI() {
        // Initialize attribute displays
        ['physical', 'social', 'mental'].forEach(attribute => {
            this.updateAttributeDisplay(attribute, this.character.attributes[attribute]);
        });
        
        this.updateAttributePoints();
        this.updateStatsPreview();
        this.updateClanInfo();
        this.updateFactionInfo();
        this.validateCharacter();
    }
}

// Initialize intro screen when page loads
let introScreenManager;
let characterCreationManager;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded!');
    
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        console.log('Initializing intro screen...');
        introScreenManager = new IntroScreen();
        characterCreationManager = new CharacterCreation();
        
        // Initially hide the game screen and character creation screen
        const gameScreen = document.getElementById('gameScreen');
        const characterCreationScreen = document.getElementById('characterCreationScreen');
        
        if (gameScreen) {
            gameScreen.classList.add('hidden');
        }
        if (characterCreationScreen) {
            characterCreationScreen.classList.add('hidden');
        }
        
        // Debug map container visibility
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            console.log('Map container found:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);
        } else {
            console.error('Map container not found!');
        }
    }, 100);
});

console.log("Vampire: The Masquerade - San Francisco by Night initialized");
console.log("Stage 1: Map with location markers - Complete");
console.log("Stage 2: Basic turn management - Complete");
console.log("Stage 3: Moon arc animation with lighting - Complete");
console.log("Stage 4: Intro screen with Start, Load, Options, Exit buttons - Complete");
console.log("Ready for political intrigue...");
