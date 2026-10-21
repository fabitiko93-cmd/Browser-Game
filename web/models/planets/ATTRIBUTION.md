# Planet preview assets

Planet maps (Earth day, night and clouds, Mars, Moon): **Solar System Scope / INOVE**, https://www.solarsystemscope.com/textures/ — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No changes to the planetary image files.

Terrain models and surface maps: **Poly Haven**, [Namaqualand](https://polyhaven.com/collections/namaqualand) and [Lunar Landscape](https://polyhaven.com/collections/moon) — [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Individual source pages, public retrieval mirrors, source commit IDs, checksums and transformations are recorded in `provenance.json`. Only the listed freely licensed asset files are used from those mirrors. No source code or other assets from the mirror projects are included.

`scripts/prepare-planet-assets.py` selects a single source LOD, embeds bounded textures and converts ground maps to WebP. The additional Namaqualand Boulder 02/05 scans receive a mobile LOD through `scripts/simplify-planet-model.mjs`, retaining source UVs and normals. These LODs are prepared offline with [meshoptimizer 1.3.0](https://github.com/zeux/meshoptimizer) (MIT); no extra runtime decoder is required. Their exact reductions and measured errors are in `provenance.json`.

Broad terrain relief and placement are ORBIT's separate, versioned layout; the global planet maps are fixed reference maps, not newly generated continents. The open cliff scan is retained as a credited source asset but is no longer used as a freestanding rock. Complete rounded and lunar scans are used instead; the layered boulder's open scan underside is buried below the terrain.

`rock-lods.json` contains geometry-only distant variants of the credited `boulder-02.glb`, `boulder-05.glb` and `moon-rock.glb` scans (CC0). `scripts/prepare-planet-environment-lods.mjs` prepares them offline with meshoptimizer 1.3.0, retaining UVs and normals and recording measured errors. The renderer shares the existing original textures/materials; no extra decoder is used. Vegetation is now sourced from the credited Pine Forest models.

The first planet preview does not contain KitBash3D Minerva building models. Access to those source files still requires the creator's account/download flow. There are no invented replacement building models presented as Minerva assets.

Vegetation: **Poly Haven [Pine Forest](https://polyhaven.com/collections/pine_forest)**, including `pine_sapling_small`, `fir_sapling`, `fern_02`, `grass_medium_01` and `pine_tree_01` (CC0). Ground textures use `leafy_grass` and `forest_leaves_04` (CC0). Direct official downloads are processed offline; the game never calls the asset API. `scripts/prepare-planet-flora.py` selects source variants, restores the separately supplied foliage alpha maps, reduces geometry, and embeds 512 px textures. Nearby plants retain 3D geometry. `scripts/bake-planet-forest.py` renders eight neutral-light views of each of two full mature source pines for the distant forest; the prepared RGBA atlas avoids rendering millions of needles on mobile devices. Exact source nodes, changes, checksums and budgets are recorded in `provenance.json`.
