# Planet construction and clearing

Selecting a tile in the planet preview now offers a local habitat construction probe. Its 8 × 8 metre foundation occupies 4 × 4 grid cells. Successful placement removes overlapping trees, understory and loose stones immediately. Demolition preserves the clearing; an explicit reset restores the original landscape.

## Placement and rendering

- Validation checks the complete footprint at one metre intervals, its edges and the underlying terrain vertices. Water, slopes of 0.12 or greater, more than 1.2 metres of height difference, occupied footprints and large rock outcrops reject the entire operation before clearing occurs.
- Vegetation uses the union of all model parts and all camera LOD bounds, transformed into world coordinates. Overhanging crowns are cleared with their entire tree, including roots outside the foundation.
- Rocks use their actual, tilted model bounds. Loose rocks are removable when their horizontal span is at most 3 metres and their exposed height is at most 2 metres. Larger outcrops block placement.
- Existing GPU instance batches are compacted without moving or recolouring neighbours. Camera LOD changes retain the same cleared population. Habitats use original code geometry with seven material batches per building.
- Region identity excludes biosphere, so comparisons retain buildings and clear the corresponding new flora. Region identity includes terrain and climate to keep different physical recipes independent.
- A separate versioned local save retains up to 32 visited regions, with at most 32 habitats and 256 clearing footprints per region. Invalid stored data falls back to an empty probe. Storage failures leave the current session usable and display a message.

## Validation

- `npm run build`, `npm test` and `npm run build:check` pass; 403 tests, zero failures.
- Five construction tests cover successful clearing, atomic rejection, footprint boundaries, water under a dry-centred footprint, actual model obstruction classification, all flora LODs, unchanged neighbouring matrices/colours, demolition, reconstruction, serialization and unavailable storage.
- Actual WebGL construction QA passes four interaction groups and six captured views at 390 × 844, 375 × 667 and 320 × 568. It tests terrain picking, build controls, GPU instance contents, reload, region switching, biosphere comparison, demolition, reconstruction, reset and a real scanned blocking rock. No console, page or asset errors.
- Screenshots and machine-readable inspection are in `review/planet/construction-*`.

## Current scope

The probe is separate from the strategic colony economy. It does not charge construction materials or simulate production. Existing ground rendering blends turf, forest floor, dry/mineral ground and snow; it does not yet define a soil classification with fertility, bearing capacity or production modifiers.

Browser verification uses software-rendered Chromium. Physical iPhone frame rates and Safari-specific behaviour remain unmeasured.
