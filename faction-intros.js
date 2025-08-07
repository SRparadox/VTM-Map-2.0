// Faction Introduction Messages - VTM San Francisco
// Contains flavor text and styling for each faction's opening scenario

const FactionIntros = {
    camarilla: {
        type: "telegram",
        title: "TELEGRAM",
        font: "monospace",
        backgroundColor: "#f4f1e8",
        textColor: "#2c2c2c",
        borderColor: "#8b7355",
        content: `
═══════════════════════════════════════════════════════════════
                            TELEGRAM
═══════════════════════════════════════════════════════════════

TO:     [CLASSIFIED KINDRED]
FROM:   CAMARILLA HIGH COMMAND - INNER CIRCLE
DATE:   ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
CIPHER: VENTRUE-ALPHA-7

URGENT - PRIORITY ALPHA

KINDRED OPERATIVE,

THE CAMARILLA PRESENCE IN SAN FRANCISCO HAS BEEN SIGNIFICANTLY 
COMPROMISED. ANARCH INSURGENTS AND SABBAT INFILTRATORS THREATEN
OUR CENTURIES-OLD DOMINION OVER THE BAY AREA.

PRINCE VANNEVAR THOMAS REQUIRES IMMEDIATE REINFORCEMENT. YOUR
TALENTS ARE NEEDED TO:

• RESTORE CAMARILLA AUTHORITY IN KEY DISTRICTS
• ELIMINATE ANARCHIST THREATS TO THE MASQUERADE  
• INVESTIGATE SABBAT PACK ACTIVITIES
• SECURE MORTAL INSTITUTIONS UNDER OUR INFLUENCE

REPORT TO SENESCHAL HELENA MARKOV AT THE FAIRMONT HOTEL FOR
BRIEFING. DISCRETION IS PARAMOUNT. FAILURE IS NOT AN OPTION.

THE IVORY TOWER ENDURES.

═══════════════════════════════════════════════════════════════
        BURN AFTER READING - MASQUERADE PROTOCOL ACTIVE
═══════════════════════════════════════════════════════════════
        `,
        musicCue: "classical_orchestral"
    },

    sabbat: {
        type: "burnt_letter",
        title: "SCORCHED MISSIVE",
        font: "serif",
        backgroundColor: "#1a0f0a",
        textColor: "#d4af37",
        borderColor: "#8b0000",
        content: `
        ╔═══════════════════════════════════════════════════════════╗
        ║                                                           ║
        ║  [The parchment is singed at the edges, written in what   ║
        ║   appears to be dried blood. Parts are barely legible]    ║
        ║                                                           ║
        ╠═══════════════════════════════════════════════════════════╣

                        ~~ Blood calls to Blood ~~

        To the worthy Children of Caine,

        The time of reckoning approaches in the city by the bay.
        The false Princes of the Camarilla grow weak behind their
        ivory facades, while the anarchist rabble squabbles over
        scraps like mortal beggars.

        Pack Leader Viktor Varga calls for TRUE KINDRED to join
        our sacred cause. San Francisco shall burn with righteous
        flame, and from its ashes we shall build a NEW SABBAT
        STRONGHOLD.

        The Giovanni grow fat on their death-money. The Tremere
        cower in their chantries. The Ventrue count coins while
        their empire crumbles. NOW IS OUR MOMENT TO STRIKE.

        Come to the abandoned church in the Mission District when
        the moon is dark. Bring nothing but your hunger and your
        hatred for the lies of the Antediluvians.

        Remember: There is no salvation save through fire.
                  There is no unity save through destruction.

        ~ Per aspera ad astra ~

        [The rest burns away to ash in your hands...]

        ╚═══════════════════════════════════════════════════════════╝
        `,
        musicCue: "dark_ambient"
    },

    anarchs: {
        type: "encrypted_broadcast",
        title: "ENCRYPTED TRANSMISSION",
        font: "monospace",
        backgroundColor: "#0a0a0a",
        textColor: "#00ff41",
        borderColor: "#8b0000",
        content: `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
██████╗ ██╗██████╗  █████╗ ████████╗███████╗    ██████╗  █████╗ ██████╗ ██╗ ██████╗ 
██╔══██╗██║██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗
██████╔╝██║██████╔╝███████║   ██║   █████╗      ██████╔╝███████║██║  ██║██║██║   ██║
██╔═══╝ ██║██╔══██╗██╔══██║   ██║   ██╔══╝      ██╔══██╗██╔══██║██║  ██║██║██║   ██║
██║     ██║██║  ██║██║  ██║   ██║   ███████╗    ██║  ██║██║  ██║██████╔╝██║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝ 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

>>> SIGNAL ACQUIRED
>>> DECRYPTION: AES-256 [GHOST_PROTOCOL]
>>> AUTHENTICATION: VERIFIED
>>> BROADCAST TIME: ${new Date().toLocaleTimeString('en-US', { hour12: false })} PST

==============================================================================

Subject: [URGENT] Bay Area Freedom Network - Recruitment Drive

Fellow Free Kindred,

This is Baron Miguel Garcia broadcasting from the Oakland underground.
The situation in San Francisco has reached a critical juncture.

INTEL SUMMARY:
- Camarilla Prince tightening control over financial sectors
- Sabbat pack activity increasing in Mission District  
- Giovanni mortuary operations expanding
- Tremere chantry fortifying defenses

WE NEED YOU.

The Anarch Movement offers:
→ Freedom from archaic Traditions
→ Territory you can actually call your own
→ Voice in collective decisions
→ Protection from Camarilla oppression

RECRUITMENT MEETING:
Location: [ENCRYPTED] - Contact Zero for coordinates
Time: After sunset, any night this week
Code phrase: "The tower cracks at its foundation"

Remember: We are the future. They are the past.
Stay free. Stay alive. Stay angry.

Signal terminating in 3... 2... 1...

==============================================================================
>>> CONNECTION SEVERED
>>> LOGS PURGED
>>> TRACE PROTECTION: ACTIVE
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        `,
        musicCue: "cyberpunk_electronic"
    },

    independent: {
        type: "journal_entry",
        title: "PERSONAL JOURNAL",
        font: "serif",
        backgroundColor: "#2f2f2f",
        textColor: "#e8e8e8",
        borderColor: "#666666",
        content: `
        ╭─────────────────────────────────────────────────────────────╮
        │                                                             │
        │                    PERSONAL JOURNAL                         │
        │                                                             │
        │    [Leather-bound journal, pages yellowed with age]         │
        │                                                             │
        ╰─────────────────────────────────────────────────────────────╯

        ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}

        It has been three weeks since my Embrace. Three weeks since
        my mortal life ended and this... existence began. I still
        catch myself reaching for food, still expect to see my
        reflection in mirrors.

        My sire disappeared the night after creating me, leaving
        only cryptic warnings about "the Jyhad" and "choosing sides."
        I understand now what they meant. This city is a battlefield
        between ancient factions, each claiming to represent the "true"
        way of our kind.

        The Camarilla speaks of tradition and order, but I see only
        oppression wrapped in silk and ceremony. The Anarchs preach
        freedom, yet their freedom seems to mean chaos and violence.
        The Sabbat... I dare not even write their name here. Their
        very presence makes the Beast within me stir restlessly.

        I am caught between worlds - too new to understand the ancient
        grudges, too aware to ignore them. The other kindred look at
        me with suspicion, wondering which banner I will eventually
        serve under.

        But perhaps... perhaps there is another way. A path that
        doesn't require kneeling to Prince or Baron or Pack Leader.
        Other independents must exist in this city - those who have
        found their own purpose beyond these eternal conflicts.

        Tonight I begin my search for answers. For allies. For my
        place in this dark new world.

        The Beast whispers that I should simply take what I want,
        but my humanity... what remains of it... tells me there
        must be more to undeath than endless hunger.

        I pray I am right.

        [The entry ends here, ink still wet]

        ╭─────────────────────────────────────────────────────────────╮
        │  "In the end, we all must choose our own damnation."        │
        ╰─────────────────────────────────────────────────────────────╯
        `,
        musicCue: "melancholic_piano"
    }
};

// Faction intro display function
function displayFactionIntro(faction) {
    const intro = FactionIntros[faction];
    if (!intro) {
        console.error(`No intro found for faction: ${faction}`);
        return null;
    }

    // Create intro element with styling
    const introElement = document.createElement('div');
    introElement.className = `faction-intro faction-intro-${faction}`;
    introElement.style.cssText = `
        font-family: ${intro.font};
        background-color: ${intro.backgroundColor};
        color: ${intro.textColor};
        border: 2px solid ${intro.borderColor};
        padding: 20px;
        margin: 20px auto;
        max-width: 800px;
        white-space: pre-line;
        line-height: 1.4;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
        overflow: hidden;
    `;

    // Add faction-specific effects
    switch(faction) {
        case 'camarilla':
            introElement.style.cssText += `
                border-style: double;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            `;
            break;
        case 'sabbat':
            introElement.style.cssText += `
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23ff6600" stroke-width="1" opacity="0.1"/></svg>');
                animation: flicker 3s infinite;
            `;
            break;
        case 'anarchs':
            introElement.style.cssText += `
                text-shadow: 0 0 5px #00ff41;
                animation: scan-lines 2s linear infinite;
            `;
            break;
        case 'independent':
            introElement.style.cssText += `
                font-style: italic;
                background-image: linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%);
                background-size: 20px 20px;
            `;
            break;
    }

    introElement.innerHTML = intro.content;
    return introElement;
}

// CSS animations for faction effects
const factionStyles = `
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
        75% { opacity: 0.9; }
    }

    @keyframes scan-lines {
        0% { background-position: 0 0; }
        100% { background-position: 0 20px; }
    }

    .faction-intro-anarchs::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.03) 2px,
            rgba(0, 255, 65, 0.03) 4px
        );
        pointer-events: none;
    }

    .faction-intro-sabbat::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: radial-gradient(circle at random%, rgba(255, 100, 0, 0.1) 1px, transparent 1px);
        pointer-events: none;
    }
`;

// Add styles to document if in browser environment
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = factionStyles;
    document.head.appendChild(styleSheet);
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FactionIntros, displayFactionIntro };
} else if (typeof window !== 'undefined') {
    window.FactionIntros = FactionIntros;
    window.displayFactionIntro = displayFactionIntro;
}

console.log("Faction Introductions loaded - all factions available");
console.log("Available factions:", Object.keys(FactionIntros));
console.log("FactionIntros object:", typeof FactionIntros);
