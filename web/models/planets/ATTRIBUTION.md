# Planet preview assets

Planet maps (Earth day, night and clouds, Mars, Moon): **Solar System Scope / INOVE**, https://www.solarsystemscope.com/textures/ — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). No changes to the planetary image files.

Terrain models and surface maps: **Poly Haven**, [Namaqualand](https://polyhaven.com/collections/namaqualand) and [Lunar Landscape](https://polyhaven.com/collections/moon) — [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Individual source pages, public retrieval mirrors, source commit IDs, checksums and transformations are recorded in `provenance.json`. Only the listed freely licensed asset files are used from those mirrors. No source code or other assets from the mirror projects are included.

`scripts/prepare-planet-assets.py` preserves source mesh geometry, selects a single source LOD, embeds bounded textures and converts ground maps to WebP. Broad terrain relief and placement are ORBIT's separate, versioned layout; the global planet maps are fixed reference maps, not newly generated continents.

The first planet preview does not contain KitBash3D Minerva building models. Access to those source files still requires the creator's account/download flow. There are no invented replacement building models presented as Minerva assets.
