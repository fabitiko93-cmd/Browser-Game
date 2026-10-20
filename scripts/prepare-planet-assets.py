"""Prepare the credited planet/terrain scans with optional mobile LOD preparation.

Usage: python scripts/prepare-planet-assets.py /path/to/planet-assets-source
Boulders: python scripts/prepare-planet-assets.py /path/to/model-mirror --boulders
Only the explicitly listed CC0 models are read from the source mirrors.
Other project files/code in those mirrors are not used by ORBIT.
"""
import copy
import hashlib
import io
import json
from pathlib import Path
import struct
import subprocess
import sys
from PIL import Image

source = Path(sys.argv[1]).resolve()
out = Path(__file__).resolve().parents[1] / 'web/models/planets'
out.mkdir(parents=True, exist_ok=True)
records = []

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def commit(folder):
    return subprocess.check_output(['git', '-C', str(source / folder), 'rev-parse', 'HEAD'], text=True).strip()

def texture(path, name, size=1024):
    with Image.open(path) as original:
        image = original.convert('RGB')
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
        image.save(out / name, 'WEBP', quality=92, method=6)
    return {'sourceSha256': sha(path), 'sha256': sha(out / name), 'bytes': (out / name).stat().st_size}

def model(path, name, lod):
    original = json.loads(path.read_text())
    # The source LOD is selected explicitly. Never render overlapping LODs.
    selected = original['nodes'][lod]
    mesh = copy.deepcopy(original['meshes'][selected['mesh']])
    source_buffers = [(path.parent / b['uri']).read_bytes() for b in original['buffers']]
    chunks = bytearray()
    doc = {'asset': {'version': '2.0', 'generator': 'ORBIT 3077 source-preserving asset preparation'}, 'scene': 0,
           'scenes': [{'nodes': [0]}], 'nodes': [dict(selected, mesh=0)], 'meshes': [mesh], 'bufferViews': [], 'accessors': [],
           'materials': copy.deepcopy(original.get('materials', [])), 'textures': copy.deepcopy(original.get('textures', [])),
           'samplers': copy.deepcopy(original.get('samplers', [])), 'images': []}
    doc['nodes'][0].pop('children', None)
    views, accessors = {}, {}
    def append(data, target=None):
        while len(chunks) % 4: chunks.append(0)
        view = {'buffer': 0, 'byteOffset': len(chunks), 'byteLength': len(data)}
        if target: view['target'] = target
        doc['bufferViews'].append(view)
        chunks.extend(data)
        return len(doc['bufferViews']) - 1
    def accessor(index):
        if index in accessors: return accessors[index]
        value = copy.deepcopy(original['accessors'][index])
        old = value['bufferView']
        if old not in views:
            view = original['bufferViews'][old]
            offset = view.get('byteOffset', 0)
            views[old] = append(source_buffers[view['buffer']][offset:offset + view['byteLength']], view.get('target'))
            if 'byteStride' in view: doc['bufferViews'][-1]['byteStride'] = view['byteStride']
        value['bufferView'] = views[old]
        accessors[index] = len(doc['accessors'])
        doc['accessors'].append(value)
        return accessors[index]
    triangles = 0
    for primitive in mesh['primitives']:
        triangles += original['accessors'][primitive['indices']]['count'] // 3
        primitive['indices'] = accessor(primitive['indices'])
        primitive['attributes'] = {key: accessor(value) for key, value in primitive['attributes'].items()}
    for item in original.get('images', []):
        with Image.open(path.parent / item['uri']) as image:
            image = image.convert('RGB')
            image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            encoded = io.BytesIO()
            image.save(encoded, 'JPEG', quality=92)
        doc['images'].append({'mimeType': 'image/jpeg', 'bufferView': append(encoded.getvalue()), 'name': item.get('name', '')})
    while len(chunks) % 4: chunks.append(0)
    doc['buffers'] = [{'byteLength': len(chunks)}]
    encoded = json.dumps(doc, separators=(',', ':')).encode()
    encoded += b' ' * (-len(encoded) % 4)
    result = struct.pack('<III', 0x46546c67, 2, 28 + len(encoded) + len(chunks)) + struct.pack('<II', len(encoded), 0x4e4f534a) + encoded + struct.pack('<II', len(chunks), 0x004e4942) + chunks
    (out / name).write_bytes(result)
    return {'sourceSha256': sha(path), 'sha256': sha(out / name), 'bytes': len(result), 'triangles': triangles, 'sourceNode': selected['name']}

if '--boulders' in sys.argv[2:]:
    existing = json.loads((out / 'provenance.json').read_text())['assets']
    for number in ['02', '05']:
        asset = 'namaqualand_boulder_' + number
        path = source / ('Assets/Models/Props/' + asset + '/' + asset + '.gltf')
        name = 'boulder-' + number + '.glb'
        prepared = model(path, name, 0)
        simplified = json.loads(subprocess.check_output(['node', str(Path(__file__).with_name('simplify-planet-model.mjs')), str(out / name), '4000'], text=True))
        item = {'file': name, 'collection': 'Namaqualand', 'creator': 'Poly Haven', 'source': 'https://polyhaven.com/a/' + asset, 'license': 'CC0-1.0', 'mirror': 'https://github.com/shadow-kernel/Vortex-Engine-OpenWorld-Template', 'mirrorCommit': subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip(), 'changes': 'Source scan with attribute-aware mobile LOD (meshoptimizer 1.3.0), existing UVs/normals and 1024 px textures retained.', 'sourceSha256': sha(path), 'sha256': sha(out / name), 'bytes': (out / name).stat().st_size, **simplified}
        existing = [r for r in existing if r['file'] != name] + [item]
        print(name, item['bytes'], item['triangles'])
    (out / 'provenance.json').write_text(json.dumps({'assets': existing}, indent=2) + '\n')
    sys.exit(0)

models = [
    ('lunar-source', 'public/moon_rock_01_1k.gltf', 'moon-rock.glb', 2, 'moon_rock_01', 'Lunar Landscape', 'https://github.com/bhushan0705/r3f-physics-world'),
    ('namaqualand-model-source', 'Assets/Models/Rocks/namaqualand_cliff_01/namaqualand_cliff_01_lod.gltf', 'namaqualand-cliff.glb', 0, 'namaqualand_cliff_01', 'Namaqualand', 'https://github.com/shadow-kernel/Vortex-Engine-OpenWorld-Template')
]
for folder, relative, name, lod, asset, collection, mirror in models:
    item = {'file': name, 'collection': collection, 'creator': 'Poly Haven', 'source': 'https://polyhaven.com/a/' + asset, 'license': 'CC0-1.0', 'mirror': mirror, 'mirrorCommit': commit(folder), 'changes': 'Select one provided source mesh/LOD; embed textures resized to 1024 px. Geometry unchanged.'}
    item.update(model(source / folder / relative, name, lod)); records.append(item)

for relative, name, asset, folder, mirror in [
    ('public/assets/three/selene-meridian/materials/regolith/basecolor-1k.jpg', 'regolith-color.webp', 'moon_01', 'lunar-material-source', 'https://github.com/Joker-of-Gotham/Joker-of-Gotham.github.io'),
    ('public/assets/three/selene-meridian/materials/regolith/normal-gl-1k.jpg', 'regolith-normal.webp', 'moon_01', 'lunar-material-source', 'https://github.com/Joker-of-Gotham/Joker-of-Gotham.github.io'),
    ('public/assets/three/selene-meridian/materials/regolith/arm-1k.jpg', 'regolith-arm.webp', 'moon_01', 'lunar-material-source', 'https://github.com/Joker-of-Gotham/Joker-of-Gotham.github.io'),
    ('3D_levels/level_2/assets/env/gravelly_sand_diff_1k.jpg', 'sand-color.webp', 'gravelly_sand', 'namaqualand-material-source', 'https://github.com/einbaumhaus/Dimension-Tension')
]:
    item = {'file': name, 'creator': 'Poly Haven', 'source': 'https://polyhaven.com/a/' + asset, 'license': 'CC0-1.0', 'mirror': mirror, 'mirrorCommit': commit(folder), 'changes': 'WebP conversion, original resolution retained.'}
    item.update(texture(source / folder / relative, name)); records.append(item)

solar = source / 'solar-texture-source/public/textures'
for relative, name in [('earth.jpg', 'earth-day.jpg'), ('mars.jpg', 'mars.jpg'), ('satellites/moon.jpg', 'moon.jpg')]:
    path = solar / relative
    (out / name).write_bytes(path.read_bytes())
    records.append({'file': name, 'creator': 'Solar System Scope / INOVE', 'source': 'https://www.solarsystemscope.com/textures/', 'license': 'CC-BY-4.0', 'mirror': 'https://github.com/Sanghel/solar-system-3d', 'mirrorCommit': commit('solar-texture-source'), 'changes': 'None', 'sha256': sha(out / name), 'bytes': (out / name).stat().st_size})

for name in ['earth-clouds.jpg', 'earth-night.jpg']:
    records.append({'file': name, 'creator': 'Solar System Scope / INOVE', 'source': 'https://www.solarsystemscope.com/textures/', 'license': 'CC-BY-4.0', 'mirror': 'https://github.com/igorSzymczak/AF2-Client/tree/619675d6d7800984955184273c1ac771bcedae35/assets/structures/planets/Earth', 'changes': 'None', 'sha256': sha(out / name), 'bytes': (out / name).stat().st_size})

records.append({'file': 'sand-normal.webp', 'creator': 'Poly Haven / Dario Barresi', 'source': 'https://polyhaven.com/a/gravelly_sand', 'license': 'CC0-1.0', 'mirror': 'https://github.com/DeerajS2004/GODOT-GAME/blob/95ca2fc930d0a9e8347f204546da7b8c0ecf0db9/godot%20materials/gravelly_sand_1k.gltf/textures/gravelly_sand_nor_gl_1k.jpg', 'changes': 'WebP conversion, original resolution retained.', **texture(source / 'gravelly_sand_nor_gl_1k.jpg', 'sand-normal.webp')})

(out / 'provenance.json').write_text(json.dumps({'assets': records}, indent=2) + '\n')
for item in records: print(item['file'], item['bytes'], item.get('triangles', ''))
