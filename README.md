# EPA-YA-BISO — Kinshasa 3D prototype

A small, original browser-based 3D exploration prototype. The scene and character meshes are constructed procedurally in JavaScript with Three.js; no Blender project or paid asset pack is required.

## Run
- Enable GitHub Pages for branch `main`, folder `/(root)`.
- Open the published page in a modern browser with WebGL and an internet connection (Three.js is loaded from jsDelivr).
- The first load needs the Three.js module to download.

## Controls
- Mobile: touch the directional pad at bottom-right.
- Desktop: arrow keys or WASD.
- E or Space: enter a nearby taxi/minibus or exit it.
- Approach a yellow taxi or minibus before pressing the action button.

## Project files
- `index.html`: application shell and HUD.
- `style.css`: responsive mobile/desktop interface.
- `game.js`: Three.js scene, procedural city blocks, road signage, vegetation, character meshes, taxi/minibus meshes, walking and driving controls.

## Included landmarks / visual references
The initial scene uses named Kinshasa references as inspiration: Gare Centrale, Poste Centrale, Immeuble Sozacom, Grand Marché, RTNC, Palais du Peuple, Stade des Martyrs, Marché de Matongé, Stade Tata Raphaël, Tour de l'Échangeur, Palais de la Nation and Jardin botanique. These are stylized game representations, not surveyed or geographically exact 3D scans.

## Story and social context
The project can portray urban youth, neighborhood tensions and the social consequences of violence through fictional characters, dialogue, choices and non-graphic missions. It does not reproduce real criminal groups as playable gangs, nor provide real-world violent tactics. The names sometimes used in Kinshasa public discussion should be handled as a sensitive social issue, not as a template for glorifying harm or stereotyping residents.

## Honest status
This is an early low-poly 3D browser prototype, not a finished commercial-quality game and not a PSP/PPSSPP ISO/CSO. A PSP release requires a separate native PSP build, optimized assets, controls, testing and packaging. The current build is designed to make the first real 3D scene playable on Android browsers before expanding the world.
