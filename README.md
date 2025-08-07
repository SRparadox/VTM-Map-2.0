# Consept

A vampire the masquerade game where the player is able to set up an politic with other vampires, sects and coteries in any city in the world (or at least some of the major ones). This will be a work in concept which will feature only San Francisco as the demo. The feel of the game will be like if the player was playing ontop of a board game. For now the game will be hosted on Github Pages.

For inspiration see
- Infection Free Zone
- Cultist Simulator
- Catan Boardgame, Pandemic Boardgame

# Stage 1
Download the data of San Fransisco utilizing OpenStreetApi. This will set up the the board map. Lock the borders so that the camera does not move after a certain distance around the city (Want to not have the game load too much unnecessary stuff). 

# Stage 2
Game Mechanics to be implemented. Create a turn manager (turn manager will move forward the time aka move to the next nights) and keep track of the progression of time. It is inside of these turns that the player will be able to move and interact.

Icons (Pins) will display important locations. Such as Banks, Blood Drives, Hospitals, Bars, Important landmarks, (list to be determined).


# Stage 2.5
Include options and menus for interactions for each key location

# Stage 3
Including core game features.

Including Saving and Loading Game state.
Player stats and resources displayed instead of important locations on the left side bar

# Stage 4
Make an intro screen, with a start, load, options and exits buttons. For now the options and exit buttons are disabled. 

# Stage 4.5 
Creation of a character class which will host valuable information, flags and will be used in reference.

Start button will lead to character creation. Character Creation is a screen screen which will display the character sheet, with at the the end, a create button which will launch into the main game, or a back button which will backtrack to the intro screen.
The player's character and states will also be saved in the save files when a game is saved/
Character Creation will have the following:
A box where players can insert a png or jpeg for the picture of their character.
A attribute blocks which will display 3 attributes: Physical, Social, Mental. Each with five dots. Each dot represents how strong a character is in that department. Skills checks will be tested against a character's dots.
Dots can only go up to 5 (ie level 5 is maximum).
A drop down meny for the factions that the player aligns themselves with (this can change later down the story)

A dropdown menu where player can choose clan:
    - Ventrue [has the blue blood tag (this tag will prevent them from feeding from anything other than normal or good blood), a bit more money to start with, +1 contacts]
    - Toreador
    - Tremere
    - Brujah
    - Gangrel
Then there will be the stat blocks which will list the following stats.
Blood Pool: out of 10, (player will start with 5/10) this will determine how hungry the player is. Difficulty checks can be increased by how hungry a player is
Humanity: out of 10 (player will start with 7) this will determine how moral a person is, there will be some difficulty checks that will test humanity
Resources: Money (this will be used to pay for stuff) there will be a daily drain in finances, and hovering over the resource stat in game will display what drains (for example -$1000 a night for renting locations...etc, or +2000 a night for owning a nightclub, modifiers will be gained or lost depending on choices)
Contacts: This dictates a level of opportunity (based on a nightly difficult check), information gathering (based on a nightly difficulty check), and a potential reroll when a difficulty check is not done (at the expense of 1 contact)

Finally there will be a coterie panel. This will be empty at the character creation, but this is where the NPC the player recruits will show up at with, where the player can hover over npcs in the coterie panel, which will display their stats. For now no npc or stats have been made.

Stage 5: Pre polish
Remove the Character Status by instead showing the character's sheet ( plus picture) and a coterie panel
Add the png symbols for all the clans. Make a foldier where all pngs and pictures will be stores\
replace the intro screen with a vampire the masquerade background with the background found in the foldier
Remove domain control.
Icons on the map will be grey. As they will only show up in color when they are controlled by a faction or the character. The character's faction color depends on what faction the character aligns themselves with.
Create a seperate file. which will be used to list all of the characters in the map/game with their rective stats, summaries and info, and pngs, however for now they will remain empty.

# Stage 6
Implementing 20 NPC across the different sects, with some having the recruitable tags in for joining the coiterie.

Have the intro text be different depending on the faction chosen

Implemented loyalty and recruitable systems for coiterie

# Stage 7


# not yet implemented
Haven Creation and modification
Sects and Influences

Domain Borders
Conflicts
Stats affecting actions such as feedings
Hunters
Expansion (and retribution from other domains)
Conflict and Resolution