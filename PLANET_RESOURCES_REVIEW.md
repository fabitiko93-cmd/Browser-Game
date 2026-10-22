# Resource deposits in the planet probe

The planet probe now has ore, crystal and geothermal deposits, three buildable extractors, a switchable resource map and a production preview. Extraction remains possible on ordinary buildable ground. Deposits substantially increase output and fade continuously through their edges into adjacent ground.

## Rules

- Region geology uses an independent version and seeded stream. Terrain generator v8, existing terrain, flora recipes, construction identities and habitat saves remain compatible. Each generated region receives two ore fields, a crystal field and a geothermal field; rocky and volcanic settings affect potential, while lunar geothermal fields are weaker.
- Fields have irregular, rotated elliptical outlines, a rich core and a smooth density tail beyond the nominal boundary. Overlapping fields use the stronger local density rather than adding peaks.
- Ordinary ice, rock, basalt, sand and sediment provide low background potential. Stone gives more ore than ice. These are resource baselines, with no additional fertility, bearing-capacity or soil-management system.
- Production averages the full 8 × 8 metre foundation and its immediate 2 metre neighbourhood on a fixed sampling lattice. Interior samples have weight 1, neighbouring sides 0.5 and diagonals 0.25. Same-resource extractors share overlapping deposit access; separate resources and background yields do not compete.
- Base production and operating requirements come from the existing building definitions. The probe shows potential output and requirements; it does not book strategic goods, energy, credits, workers or construction costs.
- Extractors follow the existing full-footprint placement and clearing rules. Resource markers disappear where construction clears them. The underground potential remains after construction and demolition.
- Ore seams, faceted crystal clusters, geothermal fissures/steam and all three extractor models are original code geometry. Resource ground shading uses a precomputed vertex attribute and one overlay uniform. No external asset dependency is added.
- Extractor types persist in the existing separate v1 construction save. Region switching and biosphere comparison retain the same geological identity.

## Validation

- `npm run build`, `npm test` and `npm run build:check` pass: 409 tests, zero failures; 276 generated files.
- Six resource test groups cover deterministic generation, biosphere independence, ordinary-ground yields, smooth density falloff, whole-footprint/neighbour access, bounded shared extraction, free placement, persistence, clearing and shader composition.
- The reproducible audit `node scripts/audit-planet-resources.mjs 100 review/planet/resources-generation.json` checks 300 planets, 1,500 regions and 6,000 fields across temperate, arid and lunar presets. No invalid recipes, flooded cores, discontinuous nominal borders or invalid outputs were found.
- Audited core placements yield 12.11–20.90 ore/day, 4.23–7.17 crystals/day and 9.12–58.01 energy/day; the energy range includes deliberately weaker lunar fields. These are location potentials, not strategic economy balances.

## Current scope

This implements the agreed soft resource binding in the 3D planet probe. Strategic colony production remains separate until those colonies are connected. Physical iPhone performance and Safari-specific behaviour are not measured by software Chromium QA.

## Selection and building preview

Selecting a buildable tile now shows the actual chosen building model at its eventual scale, a filled 8 × 8 metre foundation and a frame around its complete height and width. Blocked placements use red. Built structures retain their complete footprint outline; a new ghost returns after demolition.

Tapping a deposit highlights its complete dry density field, including the weak tail beyond the nominal outline and beyond the construction square. Four color levels and four density contours derive from the same density function used by production. Stronger overlapping deposits take selection priority; the selected extractor breaks equal-density ties. The legend identifies the selected resource and its intensity scale. Resource inspection outside the square has no building action or construction marker.

Three additional tests compare every ghost's bounds against its eventual model, verify occupied footprint dimensions and blocked colors, and check overlapping selection, all four color levels and true density contours beyond the build square. The complete suite contains 412 tests. Build and build consistency checks pass for 277 generated files.

Actual software WebGL QA exercises all four ghost types, resource selection, 320 × 568 and 390 × 844 portrait layouts, non-overlapping 44-pixel touch actions, building, demolition, blocked placement, a real terrain click outside the grid, deselection and subsequent building-type changes. No page, asset or shader errors were recorded. Reproduce with `scripts/qa-planet-selection.mjs`; screenshots and inspection data are in `review/planet/selection-*`.
