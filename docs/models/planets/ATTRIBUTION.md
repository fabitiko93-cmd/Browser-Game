# Planet preview assets

Planet maps (Earth day, night and clouds, Mars, Moon): **Solar System Scope / INOVE**, https://www.solarsystemscope.com/textures/ — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No changes to the planetary image files.

Terrain models and surface maps: **Poly Haven**, [Namaqualand](https://polyhaven.com/collections/namaqualand) and [Lunar Landscape](https://polyhaven.com/collections/moon) — [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Individual source pages, public retrieval mirrors, source commit IDs, checksums and transformations are recorded in `provenance.json`. Only the listed freely licensed asset files are used from those mirrors. No source code or other assets from the mirror projects are included.

`scripts/prepare-planet-assets.py` selects a single source LOD, embeds bounded textures and converts ground maps to WebP. The additional Namaqualand Boulder 02/05 scans receive a mobile LOD through `scripts/simplify-planet-model.mjs`, retaining source UVs and normals. These LODs are prepared offline with [meshoptimizer 1.3.0](https://github.com/zeux/meshoptimizer) (MIT); no extra runtime decoder is required. Their exact reductions and measured errors are in `provenance.json`.

Broad terrain relief and placement are ORBIT's separate, versioned layout; the global planet maps are fixed reference maps, not newly generated continents. The open cliff scan is retained as a credited source asset but is no longer used as a freestanding rock. Complete rounded and lunar scans are used instead; the layered boulder's open scan underside is buried below the terrain.

The first planet preview does not contain KitBash3D Minerva building models. Access to those source files still requires the creator's account/download flow. There are no invented replacement building models presented as Minerva assets.
