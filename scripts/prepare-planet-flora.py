"""Offline Poly Haven CC0 vegetation preparation (no runtime API dependency).

Usage: python scripts/prepare-planet-flora.py artifacts/polyhaven
Cache: /files/{asset} metadata, {asset}.gltf, and glTF include files under
{asset}/. Download with User-Agent ORBIT-3077-game-asset-preparation/1.0.
Alpha maps are separate in Poly Haven's JPG glTF: explicitly restore them.
"""
import copy
import hashlib
import io
import json
from pathlib import Path
import struct
import subprocess
import sys
import numpy as np
from PIL import Image

cache = Path(sys.argv[1]).resolve()
out = Path(__file__).resolve().parents[1] / 'web/models/planets'
records = json.loads((out / 'provenance.json').read_text())['assets']
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def record(value):
    global records
    records = [r for r in records if r['file'] != value['file']] + [value]

def prepare(asset, filename, selected, target):
    source = json.loads((cache / (asset + '.gltf')).read_text())
    buffers = [(cache / asset / b['uri']).read_bytes() for b in source['buffers']]
    doc = {'asset': {'version': '2.0', 'generator': 'ORBIT Poly Haven CC0 mobile vegetation'},
           'scene': 0, 'scenes': [{'nodes': list(range(len(selected)))}], 'nodes': [], 'meshes': [],
           'accessors': [], 'bufferViews': [], 'materials': [], 'textures': [], 'images': []}
    binary = bytearray(); images = {}; materials = {}
    def append(raw, target=None):
        binary.extend(b'\0' * (-len(binary) % 4))
        view = {'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(raw)}
        if target: view['target'] = target
        doc['bufferViews'].append(view); binary.extend(raw)
        return len(doc['bufferViews']) - 1
    def values(index):
        a = source['accessors'][index]; v = source['bufferViews'][a['bufferView']]
        dtype = {5126: '<f4', 5125: '<u4', 5123: '<u2'}[a['componentType']]
        width = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
        offset = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        stride = v.get('byteStride', np.dtype(dtype).itemsize * width)
        return np.ndarray((a['count'], width), dtype=dtype, buffer=buffers[v['buffer']], offset=offset, strides=(stride, np.dtype(dtype).itemsize)).copy()
    def accessor(array, kind):
        a = {'bufferView': append(array.tobytes(), 34963 if kind == 'SCALAR' else 34962), 'componentType': 5126 if array.dtype.kind == 'f' else 5125 if array.dtype.itemsize == 4 else 5123, 'count': len(array), 'type': kind}
        if kind == 'VEC3': a.update(min=array.min(axis=0).tolist(), max=array.max(axis=0).tolist())
        doc['accessors'].append(a); return len(doc['accessors']) - 1
    def texture(index, alpha=False):
        key = (index, alpha)
        if key in images: return images[key]
        item = source['images'][source['textures'][index]['source']]
        image = Image.open(cache / asset / item['uri']).convert('RGBA' if alpha else 'RGB')
        image.thumbnail((512, 512), Image.Resampling.LANCZOS)
        if alpha:
            mask = Image.open(cache / asset / 'alpha.png').convert('L').resize(image.size, Image.Resampling.LANCZOS)
            image.putalpha(mask)
        raw = io.BytesIO(); image.save(raw, 'PNG' if alpha else 'JPEG', **({'optimize': True} if alpha else {'quality': 88}))
        doc['images'].append({'mimeType': 'image/png' if alpha else 'image/jpeg', 'bufferView': append(raw.getvalue()), 'name': item.get('name', '')})
        doc['textures'].append({'source': len(doc['images']) - 1})
        images[key] = len(doc['textures']) - 1
        return images[key]
    def material(index):
        if index in materials: return materials[index]
        original = source['materials'][index]; pbr = original['pbrMetallicRoughness']
        alpha = original.get('alphaMode') in ['MASK', 'BLEND']
        value = {'name': original['name'], 'doubleSided': original.get('doubleSided', False), 'pbrMetallicRoughness': {'baseColorTexture': {'index': texture(pbr['baseColorTexture']['index'], alpha)}, 'metallicFactor': 0, 'roughnessFactor': 1}}
        if alpha: value.update(alphaMode='MASK', alphaCutoff=.42)
        if 'normalTexture' in original: value['normalTexture'] = {'index': texture(original['normalTexture']['index'])}
        materials[index] = len(doc['materials']); doc['materials'].append(value); return materials[index]
    for name, node_index in selected:
        original = source['meshes'][source['nodes'][node_index]['mesh']]
        positions = [values(p['attributes']['POSITION']) for p in original['primitives']]
        low = np.minimum.reduce([p.min(axis=0) for p in positions]); high = np.maximum.reduce([p.max(axis=0) for p in positions]); height = high[1] - low[1]
        offset = np.array([(low[0] + high[0]) / 2, low[1], (low[2] + high[2]) / 2], dtype='<f4')
        mesh = {'name': name, 'primitives': []}
        for p, position in zip(original['primitives'], positions):
            attributes = {'POSITION': accessor(((position - offset) / height).astype('<f4'), 'VEC3')}
            for semantic, kind in [('NORMAL', 'VEC3'), ('TEXCOORD_0', 'VEC2')]:
                if semantic in p['attributes']: attributes[semantic] = accessor(values(p['attributes'][semantic]), kind)
            mesh['primitives'].append({'attributes': attributes, 'indices': accessor(values(p['indices']), 'SCALAR'), 'material': material(p['material'])})
        doc['nodes'].append({'name': name, 'mesh': len(doc['meshes'])}); doc['meshes'].append(mesh)
    binary.extend(b'\0' * (-len(binary) % 4)); doc['buffers'] = [{'byteLength': len(binary)}]
    raw = json.dumps(doc, separators=(',', ':')).encode(); raw += b' ' * (-len(raw) % 4)
    path = out / filename
    path.write_bytes(struct.pack('<IIIII', 0x46546c67, 2, 28 + len(raw) + len(binary), len(raw), 0x4e4f534a) + raw + struct.pack('<II', len(binary), 0x004e4942) + binary)
    reduced = json.loads(subprocess.check_output(['node', str(Path(__file__).with_name('simplify-planet-model.mjs')), str(path), str(target), *(['--foliage'] if asset in ['pine_sapling_small', 'fir_sapling'] else [])], text=True))
    record({'file': filename, 'collection': 'Pine Forest', 'creator': 'Poly Haven', 'source': 'https://polyhaven.com/a/' + asset, 'license': 'CC0-1.0', 'sourceNodes': [source['nodes'][i]['name'] for _, i in selected], 'sourceSha256': sha(cache / (asset + '.gltf')), 'changes': 'Selected source variants, height normalization, attribute-aware mobile geometry, 512 px color/normal textures; original separate alpha restored as PNG with alpha testing.', 'preparationScript': 'scripts/prepare-planet-flora.py', 'sha256': sha(path), 'bytes': path.stat().st_size, **reduced})
    print(filename, path.stat().st_size, reduced, flush=True)

prepare('pine_sapling_small', 'pine-young.glb', [('pine-a', 0), ('pine-b', 1)], 18000)
prepare('fir_sapling', 'fir-young.glb', [('fir-a', 0)], 18000)
prepare('fern_02', 'fern.glb', [('fern-a', 2)], 450)
prepare('grass_medium_01', 'meadow-grass.glb', [('grass-a', 3), ('grass-b', 13)], 260)
for asset, prefix in [('leafy_grass', 'meadow'), ('forest_leaves_04', 'forest-floor')]:
    for key, suffix in [('Diffuse', 'color'), ('nor_gl', 'normal')]:
        source = cache / asset / (key + '.jpg'); image = Image.open(source).convert('RGB')
        image.thumbnail((1024, 1024), Image.Resampling.LANCZOS); path = out / (prefix + '-' + suffix + '.webp'); image.save(path, 'WEBP', quality=88, method=6)
        record({'file': path.name, 'creator': 'Poly Haven', 'source': 'https://polyhaven.com/a/' + asset, 'license': 'CC0-1.0', 'sourceSha256': sha(source), 'changes': '1k WebP conversion.', 'sha256': sha(path), 'bytes': path.stat().st_size})
frames = cache / 'forest-frames'
if all((frames / f'{variant}-{frame}.png').exists() for variant in range(2) for frame in range(8)):
    atlas = Image.new('RGBA', (2048, 1024))
    for variant in range(2):
        for frame in range(8):
            atlas.paste(Image.open(frames / f'{variant}-{frame}.png'), (frame * 256, variant * 512))
    path = out / 'pine-forest-atlas.webp'
    atlas.save(path, 'WEBP', quality=92, method=6)
    record({'file': path.name, 'collection': 'Pine Forest', 'creator': 'Poly Haven; offline views by ORBIT', 'source': 'https://polyhaven.com/a/pine_tree_01', 'license': 'CC0-1.0', 'sourceNodes': ['pine_tree_01_a_LOD2', 'pine_tree_01_b_LOD2'], 'sourceSha256': sha(cache / 'pine_tree_01_1k.blend'), 'changes': 'Eight neutral-light orthographic views per source tree, 256x512 px per view, RGBA WebP atlas for distant forest. Nearby saplings retain 3D geometry.', 'preparationScript': 'scripts/bake-planet-forest.py; scripts/prepare-planet-flora.py', 'sha256': sha(path), 'bytes': path.stat().st_size})
(out / 'provenance.json').write_text(json.dumps({'assets': records}, indent=2) + '\n')
