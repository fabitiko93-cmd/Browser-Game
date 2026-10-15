"""Preserve Harbinger geometry/materials; encode 2K color/normal and 1K ORM KTX2.
Requires Pillow and Khronos toktx 4.4.2. The runtime model is stored in small
binary parts to support the connected GitHub publisher and resumable caching.
Usage: python scripts/prepare-harbinger.py original.glb /path/to/toktx
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import sys, json, struct, io, tempfile, subprocess, hashlib, copy
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]); encoder=Path(sys.argv[2]); encoder.chmod(0o755)
data=source.read_bytes(); assert data[:4]==b'glTF'
length=struct.unpack_from('<I',data,12)[0]; doc=json.loads(data[20:20+length]); start=28+length
views=[data[start+v.get('byteOffset',0):start+v.get('byteOffset',0)+v['byteLength']] for v in doc['bufferViews']]
srgb=set(); normals=set()
for m in doc['materials']:
 for t in [m.get('pbrMetallicRoughness',{}).get('baseColorTexture'),m.get('emissiveTexture')]:
  if t: srgb.add(doc['textures'][t['index']]['source'])
 if m.get('normalTexture'): normals.add(doc['textures'][m['normalTexture']['index']]['source'])
with tempfile.TemporaryDirectory() as temp:
 temp=Path(temp)
 def encode(i):
  image=Image.open(io.BytesIO(views[doc['images'][i]['bufferView']])).convert('RGBA'); original=image.size
  maximum=2048 if i in srgb or i in normals else 1024
  image.thumbnail((maximum,maximum),Image.Resampling.LANCZOS)
  png=temp/f'{i}.png'; out=temp/f'{i}.ktx2'; image.save(png)
  space='srgb' if i in srgb else 'linear'
  subprocess.run([str(encoder),'--encode','uastc','--uastc_quality','2','--zcmp','18','--uastc_rdo_l','.25' if i in normals else '.5','--uastc_rdo_m','--genmipmap','--assign_oetf',space,'--assign_primaries','bt709','--upper_left_maps_to_s0t0','--threads','2',str(out),str(png)],check=True,capture_output=True)
  result=out.read_bytes(); print(f'Texture {i+1}/19: {image.size}, {len(result)} bytes',flush=True)
  return i,result,{'index':i,'size':list(image.size),'originalSize':list(original),'colorSpace':space}
 with ThreadPoolExecutor(max_workers=3) as pool: encoded=list(pool.map(encode,range(len(doc['images']))))
 replacements={doc['images'][i]['bufferView']:payload for i,payload,_ in encoded}
 binary=bytearray(); model=copy.deepcopy(doc)
 for i,raw in enumerate(views):
  binary.extend(b'\0'*(-len(binary)%4)); payload=replacements.get(i,raw)
  model['bufferViews'][i].update(byteOffset=len(binary),byteLength=len(payload)); binary.extend(payload)
 for item in model['images']: item['mimeType']='image/ktx2'
 for texture in model['textures']: texture.setdefault('extensions',{})['KHR_texture_basisu']={'source':texture.pop('source')}
 for key in ['extensionsUsed','extensionsRequired']: model[key]=list(dict.fromkeys(model.get(key,[])+['KHR_texture_basisu']))
 model['buffers'][0]['byteLength']=len(binary)
 model['asset']['generator']='ORBIT Harbinger / KTX-Software 4.4.2'
 model['asset'].setdefault('extras',{})['changes']='Geometry, normals, UVs and material factors preserved. 2K color/normal, 1K ORM, UASTC KTX2 mipmaps.'
 metadata=json.dumps(model,separators=(',',':')).encode(); metadata+=b' '*(-len(metadata)%4); binary.extend(b'\0'*(-len(binary)%4))
 result=struct.pack('<4sII',b'glTF',2,28+len(metadata)+len(binary))+struct.pack('<II',len(metadata),0x4e4f534a)+metadata+struct.pack('<II',len(binary),0x004e4942)+binary
 output=root/'web/models/harbinger'; output.mkdir(parents=True,exist_ok=True)
 parts=[]
 for i,offset in enumerate(range(0,len(result),600000)):
  payload=result[offset:offset+600000]; name=f'hull-{i:03}.part'; (output/name).write_bytes(payload); parts.append({'file':name,'bytes':len(payload)})
 manifest={'bytes':len(result),'sha256':hashlib.sha256(result).hexdigest(),'parts':parts,'author':'Comrade1280','license':'CC-BY-4.0','source':'https://sketchfab.com/3d-models/dss-harbinger-battle-cruiser-474f62d00ed54212b37f93ce91569c53'}
 (output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 (output/'provenance.json').write_text(json.dumps({**manifest,'sourceBytes':len(data),'sourceSha256':hashlib.sha256(data).hexdigest(),'geometryByteIdentical':True,'textures':[r for _,_,r in encoded]},indent=2)+'\n')
 print(f'Prepared {len(result)} bytes in {len(parts)} parts.',flush=True)
