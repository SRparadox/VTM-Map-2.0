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
        
        // Update action buttons based on remaining actions
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.disabled = this.playerActions <= 0;
        });
    }
}

// Initialize game state
const gameState = new GameState();

// Important San Francisco locations for vampire politics
const importantLocations = [
    // Banks - Financial District
    { name: "Bank of America Corporate Center", type: "bank", coords: [37.7749, -122.4194], description: "Major financial influence hub" },
    { name: "Wells Fargo Bank", type: "bank", coords: [37.7849, -122.4094], description: "Old money connections" },
    
    // Hospitals - Blood sources
    { name: "UCSF Medical Center", type: "hospital", coords: [37.7629, -122.4577], description: "Premier medical facility" },
    { name: "San Francisco General Hospital", type: "hospital", coords: [37.7575, -122.4044], description: "Public hospital with steady blood supply" },
    { name: "California Pacific Medical Center", type: "hospital", coords: [37.7886, -122.4324], description: "Private medical center" },
    
    // Bars & Clubs - Feeding grounds
    { name: "The Tonga Room", type: "bar", coords: [37.7919, -122.4103], description: "Upscale tiki bar, wealthy clientele" },
    { name: "Ruby Skye", type: "bar", coords: [37.7873, -122.4072], description: "Nightclub, young crowd" },
    { name: "The Fillmore", type: "bar", coords: [37.7840, -122.4334], description: "Historic music venue" },
    { name: "Top of the Mark", type: "bar", coords: [37.7925, -122.4097], description: "Elite social gathering spot" },
    
    // Landmarks - Political meeting places
    { name: "City Hall", type: "landmark", coords: [37.7793, -122.4193], description: "Political power center" },
    { name: "Transamerica Pyramid", type: "landmark", coords: [37.7952, -122.4028], description: "Corporate influence hub" },
    { name: "Golden Gate Bridge", type: "landmark", coords: [37.8199, -122.4783], description: "Iconic meeting point" },
    { name: "Alcatraz Island", type: "landmark", coords: [37.8267, -122.4230], description: "Isolated meeting location" },
    
    // Blood Drives - Easy feeding
    { name: "American Red Cross", type: "blood", coords: [37.7749, -122.4094], description: "Regular blood drive location" },
    { name: "Blood Centers of the Pacific", type: "blood", coords: [37.7649, -122.4194], description: "Blood donation center" }
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

// Custom icons for different location types
const locationIcons = {
    bank: '🏦',
    hospital: '🏥',
    bar: '🍷',
    landmark: '🏛️',
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
        case 'bar': return 'Feed';
        case 'landmark': return 'Meet';
        case 'blood': return 'Acquire';
        default: return 'Interact';
    }
}

// Handle location actions
function handleLocationAction(type, locationName) {
    if (gameState.playerActions <= 0) {
        alert("No actions remaining this turn!");
        return;
    }
    
    gameState.playerActions--;
    
    const messages = {
        bank: `You attempt to establish influence at ${locationName}. Your connections grow stronger.`,
        hospital: `You investigate ${locationName} for potential feeding opportunities and medical contacts.`,
        bar: `You feed discreetly at ${locationName}. Your hunger is temporarily sated.`,
        landmark: `You arrange a clandestine meeting at ${locationName}. Political wheels turn.`,
        blood: `You acquire resources from ${locationName}. Your blood supply increases.`
    };
    
    alert(messages[type] || "You interact with the location.");
    gameState.updateUI();
}

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
    
    .custom-marker.bank { background: rgba(255, 215, 0, 0.9); border-color: #ffd700; }
    .custom-marker.hospital { background: rgba(255, 255, 255, 0.9); border-color: #fff; color: #000; }
    .custom-marker.bar { background: rgba(139, 0, 0, 0.9); border-color: #8b0000; }
    .custom-marker.landmark { background: rgba(128, 128, 128, 0.9); border-color: #808080; }
    .custom-marker.blood { background: rgba(220, 20, 60, 0.9); border-color: #dc143c; }
    
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
        alert("Select a location on the map to influence, or use the bank locations for maximum effect.");
    } else {
        alert("No actions remaining this turn!");
    }
});

document.getElementById('feedBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        alert("Select a bar, club, or hospital to feed. Be careful not to break the Masquerade!");
    } else {
        alert("No actions remaining this turn!");
    }
});

document.getElementById('gatherBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        alert("You gather intelligence about vampire politics in the city. Knowledge is power.");
        gameState.playerActions--;
        gameState.updateUI();
    } else {
        alert("No actions remaining this turn!");
    }
});

document.getElementById('meetBtn').addEventListener('click', () => {
    if (gameState.playerActions > 0) {
        alert("Select a landmark or important location to arrange a meeting with other vampires.");
    } else {
        alert("No actions remaining this turn!");
    }
});

// Initialize UI
gameState.updateUI();

console.log("Vampire: The Masquerade - San Francisco by Night initialized");
console.log("Stage 1: Map with location markers - Complete");
console.log("Stage 2: Basic turn management - Complete");
console.log("Ready for political intrigue...");
