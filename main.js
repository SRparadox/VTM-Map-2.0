// Game State Management
class GameState {
    constructor() {
        this.currentNight = 1;
        this.currentPhase = 'Dusk';
        this.phases = ['Dusk', 'Evening', 'Midnight', 'Dawn'];
        this.currentPhaseIndex = 0;
        this.playerActions = 3; // Actions per turn
        this.locations = [];
    }
    
    nextTurn() {
        this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phases.length;
        this.currentPhase = this.phases[this.currentPhaseIndex];
        
        if (this.currentPhase === 'Dusk') {
            this.currentNight++;
            this.playerActions = 3; // Reset actions for new night
        }
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('currentNight').textContent = this.currentNight;
        document.getElementById('currentPhase').textContent = this.currentPhase;
        
        // Update moon animation and header lighting
        this.updateMoonAnimation();
        
        // Update action buttons based on remaining actions
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.disabled = this.playerActions <= 0;
        });
    }
    
    updateMoonAnimation() {
        const moonContainer = document.querySelector('.moon-container');
        const gameHeader = document.querySelector('.game-header');
        const moon = document.getElementById('moon');
        const moonGlow = document.querySelector('.moon-glow');
        
        // Remove all existing phase classes
        moonContainer.classList.remove('dusk', 'evening', 'midnight', 'dawn');
        gameHeader.classList.remove('dusk', 'evening', 'midnight', 'dawn');
        
        // Add current phase class
        const phaseClass = this.currentPhase.toLowerCase();
        moonContainer.classList.add(phaseClass);
        gameHeader.classList.add(phaseClass);
        
        // Keep moon as full moon but change glow intensity and color based on phase
        const moonFace = moon.querySelector('.moon-face');
        moonFace.textContent = '🌕'; // Always full moon
        
        switch(this.currentPhase) {
            case 'Dusk':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 220, 180, 0.15) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.4';
                break;
            case 'Evening':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.7';
                break;
            case 'Midnight':
                moonGlow.style.background = 'radial-gradient(circle, rgba(240, 248, 255, 0.35) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.9';
                break;
            case 'Dawn':
                moonGlow.style.background = 'radial-gradient(circle, rgba(255, 240, 245, 0.15) 0%, transparent 70%)';
                moonGlow.style.opacity = '0.3';
                break;
        }
    }
}

// Initialize game state
const gameState = new GameState();

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
    const icon = L.divIcon({
        html: `<div class="custom-marker ${location.type}">${locationIcons[location.type]}</div>`,
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
    const textElement = document.getElementById('telegramText');
    const actionsElement = document.getElementById('telegramActions');
    
    // Set content
    senderElement.textContent = sender;
    textElement.textContent = message;
    
    // Clear previous buttons
    actionsElement.innerHTML = '';
    
    // Add new buttons
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = `telegram-btn ${button.class || ''}`;
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
        return;
    }
    
    // Handle different actions
    switch(action) {
        // Bank actions
        case 'deeperBank':
            showTelegram("Financial Contact", "You establish deeper connections within the banking system. Your financial influence grows significantly, but you've also attracted attention from other vampires who covet such power.", [
                { text: "Prepare for challenges", action: "close", class: "primary" }
            ]);
            break;
            
        // Hospital actions
        case 'recruitNurse':
            showTelegram("Medical Informant", "The night shift nurse is now under your influence. She will provide you with inside information about patient schedules and blood storage. A valuable asset indeed.", [
                { text: "Excellent", action: "close", class: "success" }
            ]);
            break;
            
        case 'secureBlood':
            showTelegram("Medical Informant", "You've secured several blood bags without detection. Your hunger is completely satisfied, and you have reserves for future emergencies. The risk was worth the reward.", [
                { text: "Store safely", action: "close", class: "success" }
            ]);
            break;
            
        // Government actions
        case 'expandNetwork':
            showTelegram("Political Insider", "Your political network expands significantly. You now have contacts in multiple government departments, giving you unprecedented access to city planning and policy decisions.", [
                { text: "Use this power wisely", action: "close", class: "primary" }
            ]);
            break;
            
        case 'accessFiles':
            showTelegram("Political Insider", "You've gained access to classified files revealing the locations of other vampire activities in the city. This information could be valuable... or dangerous.", [
                { text: "Study the intelligence", action: "close", class: "danger" }
            ]);
            break;
            
        // University actions
        case 'recruitStudents':
            showTelegram("Academic Contact", "Several promising students now serve your interests. They will act as your eyes and ears on campus, reporting on faculty activities and potential threats.", [
                { text: "Build student network", action: "close", class: "primary" }
            ]);
            break;
            
        // Transport actions
        case 'establishSurveillance':
            showTelegram("Transit Authority", "Your surveillance network is now active across the city's transport system. You can track the movements of rivals and allies alike through security cameras and schedule monitoring.", [
                { text: "Monitor the city", action: "close", class: "primary" }
            ]);
            break;
            
        // Entertainment actions
        case 'feedAgain':
            if (Math.random() > 0.7) {
                showTelegram("Masquerade Breach", "Your second feeding attempt was too bold! A patron noticed your supernatural nature. You must act quickly to contain this breach of the Masquerade.", [
                    { text: "Use dominate", action: "close", class: "danger" },
                    { text: "Eliminate witness", action: "close", class: "danger" }
                ]);
            } else {
                showTelegram("Night Life Contact", "Your second feeding was successful, but risky. You're completely satiated now, but some patrons seem disturbed by the evening's events.", [
                    { text: "Leave immediately", action: "close", class: "success" }
                ]);
            }
            break;
            
        // Shopping actions
        case 'establishBusiness':
            showTelegram("Commercial Contact", "You've established a legitimate business front in the shopping district. This will provide both income and cover for your vampiric activities.", [
                { text: "Manage the business", action: "close", class: "success" }
            ]);
            break;
            
        // Blood bank actions
        case 'secureMore':
            showTelegram("Blood Bank Contact", "You've secured additional blood supplies, but the quantity you've taken may be noticed. Your reserves are substantial, but scrutiny may follow.", [
                { text: "Lay low for now", action: "close", class: "danger" }
            ]);
            break;
            
        // General action buttons
        case 'gatherIntel':
            showTelegram("Information Network", "Your intelligence gathering reveals rival vampire movements in the financial district. This information could be valuable for future operations.", [
                { text: "File intelligence", action: "close", class: "success" }
            ]);
            gameState.playerActions--;
            gameState.updateUI();
            break;
            
        case 'learnRivals':
            showTelegram("Information Broker", "Your informants reveal that the Tremere clan has been expanding their influence in the university district, while the Ventrue control most of the financial sector. The Brujah are restless in the entertainment areas.", [
                { text: "Adjust strategy", action: "close", class: "primary" }
            ]);
            gameState.playerActions--;
            gameState.updateUI();
            break;
            
        case 'studyPower':
            showTelegram("Information Broker", "The city's power structure is more complex than it appears. The mayor has vampire advisors, the police chief is under supernatural influence, and several corporate boards have undead members.", [
                { text: "Plan accordingly", action: "close", class: "success" }
            ]);
            gameState.playerActions--;
            gameState.updateUI();
            break;
            
        default:
            showTelegram("Unknown Contact", "The shadows whisper of events yet to unfold. Your actions have consequences that will reveal themselves in time.", [
                { text: "Continue", action: "close" }
            ]);
            if (gameState.playerActions > 0) {
                gameState.playerActions--;
                gameState.updateUI();
            }
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
importantLocations.forEach(location => {
    createLocationMarker(location);
});

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

// Initialize UI
gameState.updateUI();

console.log("Vampire: The Masquerade - San Francisco by Night initialized");
console.log("Stage 1: Map with location markers - Complete");
console.log("Stage 2: Basic turn management - Complete");
console.log("Stage 3: Moon arc animation with lighting - Complete");
console.log("Ready for political intrigue...");
