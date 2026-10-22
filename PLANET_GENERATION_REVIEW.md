# Planet generation v8

The planet preview now chooses its regional landforms from shared spherical geology and climate. Seeds vary continental placement, climate, region composition, local relief, water, vegetation and suitable colony footprints.

## Content

- Eight climate biomes: temperate mixed forest, boreal forest, desert, steppe/savanna, rainforest, wetland, tundra and ice.
- Six inhabited landforms: coast, river basin, upland, caldera, open plain and lake district. Airless worlds retain cratered regolith.
- Three independent flora families: terrestrial, spore forest and coral flora. Biology never changes land, water, climate or construction constraints.
- Six original plant models with two variants each: acacia, tropical broadleaf, palm, willow, cactus and reed. Spatial canopy LODs preserve crown volume; near variants retain individual leaf clusters.
- Seed bookmarks in the options dialog provide one real generated example of every climate biome. Warm, cold, dry and wet world climates remain selectable.

## Validation

- Complete simulation and rendering suite: 398 passing tests. Final targeted generator, asset and grid checks also pass.
- Seed audit: 500 seeds for each of temperate, arid and lunar worlds; 1,500 planets and 7,500 regions. All climate biomes and landforms occur. No failures. Lowest sampled usable building-area fraction: 62.5%. 2,924 distinct colony footprint layouts. Full results: `review/planet/generation-v8.json`.
- The audit checks serialization, prefix stability, globe/region climate agreement, dry footprints and roads, central construction access, finite surfaces, water agreement and camera clearance.
- Browser QA uses the actual WebGL renderer and real local assets in Chromium/SwiftShader. It covers all eight climate examples, both alien families, native inputs, camera dragging, actual build picking, grid toggling, focus, zoom and dry/airless worlds at 390×844, 375×667 and 320×568. The shortest view includes an active tile-information panel.
- Render counters and final browser checks: `review/planet/generation-v8-browser.json`.

## Boundaries

The preview still does not run the strategic colony economy. Existing strategic saves and simulation rules are unchanged. Serialized v7 recipes remain supported; reference fixtures have dedicated regression coverage.

The seed audit is a finite sample, not a proof for every possible seed. WebGL correctness is tested with software rendering; these counters are not physical iPhone frame-rate measurements or a Safari certification.
