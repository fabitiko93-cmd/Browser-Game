"""Prepare the author's CC0 OBJ exports as compact, self-contained glTF 2 models.

Usage: python scripts/prepare-ship-assets.py /path/to/ultimate_spaceships_-_may_2021.zip
Requires Pillow. The source archive is acquired separately from the credited URL.
"""
import hashlib
import io
import json
import struct
import sys
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'web/models/quaternius'
MODELS = ['Executioner', 'Challenger', 'Striker', 'Spitfire']
SOURCE = 'https://opengameart.org/sites/default/files/ultimate_spaceships_-_may_2021.zip'


def prepare(archive, name):
    prefix = f'Ultimate Spaceships - May 2021/{name}/'
    source = archive.read(prefix + f'OBJ/{name}.obj').decode('utf-8-sig')
    vertices, normals, uvs, positions, normal_values, uv_values, indices = [], [], [], [], [], [], []
    unique = {}
    for line in source.splitlines():
        fields = line.split()
        if not fields:
            continue
        if fields[0] == 'v':
            vertices.append(list(map(float, fields[1:4])))
        elif fields[0] == 'vn':
            normals.append(list(map(float, fields[1:4])))
        elif fields[0] == 'vt':
            uvs.append(list(map(float, fields[1:3])))
        elif fields[0] == 'f':
            face = []
            for field in fields[1:]:
                key = tuple(map(int, field.split('/')))
                if len(key) != 3 or not key[1] or not key[2]:
                    raise ValueError(f'{name}: source UVs and normals are required')
                if key not in unique:
                    unique[key] = len(unique)
                    positions.extend(vertices[key[0] - 1])
                    normal_values.extend(normals[key[2] - 1])
                    u, v = uvs[key[1] - 1]
                    uv_values.extend([u, 1 - v])  # OBJ bottom-left -> glTF top-left image origin.
                face.append(unique[key])
            for i in range(1, len(face) - 1):
                indices.extend([face[0], face[i], face[i + 1]])
    texture_path = next(p for p in archive.namelist() if p.startswith(prefix + 'Textures/') and p.endswith('.png'))
    texture = Image.open(io.BytesIO(archive.read(texture_path))).convert('RGB')
    texture.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    jpeg = io.BytesIO()
    texture.save(jpeg, format='JPEG', quality=88, optimize=True)
    binary = bytearray()
    views = []

    def append(data, target=None):
        while len(binary) % 4:
            binary.append(0)
        view = {'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data)}
        if target:
            view['target'] = target
        views.append(view)
        binary.extend(data)
        return len(views) - 1

    position_view = append(struct.pack(f'<{len(positions)}f', *positions), 34962)
    normal_view = append(struct.pack(f'<{len(normal_values)}f', *normal_values), 34962)
    uv_view = append(struct.pack(f'<{len(uv_values)}f', *uv_values), 34962)
    index_type = 'H' if len(unique) < 65536 else 'I'
    index_view = append(struct.pack(f'<{len(indices)}{index_type}', *indices), 34963)
    image_view = append(jpeg.getvalue())
    minimum = [min(positions[axis::3]) for axis in range(3)]
    maximum = [max(positions[axis::3]) for axis in range(3)]
    gltf = {
        'asset': {'version': '2.0', 'generator': 'ORBIT 3077 CC0 OBJ conversion', 'copyright': 'Quaternius — CC0'},
        'scene': 0, 'scenes': [{'nodes': [0]}], 'nodes': [{'mesh': 0, 'name': name}],
        'meshes': [{'name': name, 'primitives': [{'attributes': {'POSITION': 0, 'NORMAL': 1, 'TEXCOORD_0': 2}, 'indices': 3, 'material': 0}]}],
        'materials': [{'name': name, 'pbrMetallicRoughness': {'baseColorTexture': {'index': 0}, 'metallicFactor': 0.25, 'roughnessFactor': 0.72}}],
        'textures': [{'sampler': 0, 'source': 0}],
        'samplers': [{'magFilter': 9729, 'minFilter': 9987, 'wrapS': 10497, 'wrapT': 10497}],
        'images': [{'bufferView': image_view, 'mimeType': 'image/jpeg'}],
        'accessors': [
            {'bufferView': position_view, 'componentType': 5126, 'count': len(unique), 'type': 'VEC3', 'min': minimum, 'max': maximum},
            {'bufferView': normal_view, 'componentType': 5126, 'count': len(unique), 'type': 'VEC3'},
            {'bufferView': uv_view, 'componentType': 5126, 'count': len(unique), 'type': 'VEC2'},
            {'bufferView': index_view, 'componentType': 5123 if index_type == 'H' else 5125, 'count': len(indices), 'type': 'SCALAR'},
        ],
        'bufferViews': views, 'buffers': [{'byteLength': len(binary)}],
    }
    metadata = json.dumps(gltf, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
    metadata += b' ' * (-len(metadata) % 4)
    binary.extend(b'\0' * (-len(binary) % 4))
    glb = struct.pack('<III', 0x46546C67, 2, 28 + len(metadata) + len(binary))
    glb += struct.pack('<II', len(metadata), 0x4E4F534A) + metadata
    glb += struct.pack('<II', len(binary), 0x004E4942) + binary
    output = DEST / (name.lower() + '.glb')
    output.write_bytes(glb)
    record = {'name': name, 'file': output.name, 'sourceObj': prefix + f'OBJ/{name}.obj', 'sourceTexture': texture_path,
              'vertices': len(unique), 'triangles': len(indices) // 3, 'texture': list(texture.size),
              'bytes': len(glb), 'sha256': hashlib.sha256(glb).hexdigest(), 'bounds': [minimum, maximum]}
    print(json.dumps(record))
    return record


if __name__ == '__main__':
    archive_path = Path(sys.argv[1])
    DEST.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive_path) as archive:
        models = [prepare(archive, name) for name in MODELS]
    provenance = {'author': 'Quaternius', 'pack': 'Ultimate Spaceships Pack, May 2021', 'license': 'CC0-1.0',
                  'authorPage': 'https://quaternius.com/packs/ultimatespaceships.html', 'download': SOURCE,
                  'archiveSha256': hashlib.sha256(archive_path.read_bytes()).hexdigest(),
                  'changes': 'OBJ mesh, UVs and normals preserved; UV image origin adapted to glTF; texture resized to 1024px JPEG; packaged as GLB.',
                  'models': models}
    (DEST / 'provenance.json').write_text(json.dumps(provenance, indent=2) + '\n', encoding='utf-8')
