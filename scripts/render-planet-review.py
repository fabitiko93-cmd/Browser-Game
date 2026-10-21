"""Independent CPU landscape review; not a browser, shader or touch test.
Usage: blender -b --python scripts/render-planet-review.py -- artifacts/landscapes 0
Requires recipes from export-planet-review.mjs. Output stays outside the build.
"""
import bpy, json, math, os, sys
from mathutils import Vector, Matrix
args=sys.argv[sys.argv.index('--')+1:]
root=os.path.abspath(args[0]); num=int(args[1]); assets=os.path.abspath('web/models/planets')
r=json.load(open(os.path.join(root,f'region-{num}.json')))
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=20;scene.cycles.use_denoising=True
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.render.resolution_x=600;scene.render.resolution_y=800;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=0
scene.world=bpy.data.worlds.new('Sky');scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.58,.69,.75,1);scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.6

def linear(v):return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def color(s):return tuple(linear(int(s[i:i+2],16)/255) for i in (1,3,5))
def mix(a,b,t):return tuple(x+(y-x)*max(0,min(1,t)) for x,y in zip(a,b))
def xyz(p):return (p[0],-p[2],p[1])
def material(name,c,rough=1,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color(c),1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color(c),1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;return m

def mesh(name,positions,indices,mat):
 data=bpy.data.meshes.new(name);data.from_pydata([xyz(positions[i:i+3]) for i in range(0,len(positions),3)],[],[indices[i:i+3] for i in range(0,len(indices),3)]);data.update();obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.data.materials.append(mat);return obj

biome=r['biome'];base=color(r['module']['palette'][0]);meadow=color(biome['meadow']);dry=color(biome['dry']);moss=color(biome['moss'])
mat=material('Climate ground','#ffffff');nodes=mat.node_tree.nodes;links=mat.node_tree.links;p=nodes.get('Principled BSDF');attr=nodes.new('ShaderNodeVertexColor');attr.layer_name='habitatColor';links.new(attr.outputs['Color'],p.inputs['Base Color'])
# Scanned surface detail in the same world-space scale as the ground shader.
geom=nodes.new('ShaderNodeNewGeometry')
details=[]
for file,scale in [('meadow-color.webp',1/2.4),(r['module']['ground']+'-color.webp',18/192)]:
 tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(os.path.join(assets,file));tex.extension='REPEAT'
 uv=nodes.new('ShaderNodeVectorMath');uv.operation='SCALE';uv.inputs[3].default_value=scale;links.new(geom.outputs['Position'],uv.inputs[0]);links.new(uv.outputs[0],tex.inputs['Vector'])
 bw=nodes.new('ShaderNodeRGBToBW');links.new(tex.outputs['Color'],bw.inputs[0]);gain=nodes.new('ShaderNodeMath');gain.operation='MULTIPLY_ADD';gain.inputs[1].default_value=1.4 if len(details)==0 else 2;gain.inputs[2].default_value=.72 if len(details)==0 else .35;links.new(bw.outputs[0],gain.inputs[0]);details.append(gain)
cover=attr
blend=nodes.new('ShaderNodeMixRGB');links.new(cover.outputs['Alpha'],blend.inputs[0]);links.new(details[1].outputs[0],blend.inputs[1]);links.new(details[0].outputs[0],blend.inputs[2])
mod=nodes.new('ShaderNodeMixRGB');mod.blend_type='MULTIPLY';mod.inputs[0].default_value=1;links.new(attr.outputs['Color'],mod.inputs[1]);links.new(blend.outputs[0],mod.inputs[2]);links.new(mod.outputs[0],p.inputs['Base Color'])
if r['region'].get('valley'):
 macro=[]
 for scale in [1/18,1/43]:
  tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(os.path.join(assets,'meadow-color.webp'));tex.extension='REPEAT';uv=nodes.new('ShaderNodeVectorMath');uv.operation='SCALE';uv.inputs[3].default_value=scale;links.new(geom.outputs['Position'],uv.inputs[0]);links.new(uv.outputs[0],tex.inputs['Vector']);macro.append(tex)
 mx=nodes.new('ShaderNodeMixRGB');mx.inputs[0].default_value=.4;links.new(macro[0].outputs['Color'],mx.inputs[1]);links.new(macro[1].outputs['Color'],mx.inputs[2]);bw=nodes.new('ShaderNodeRGBToBW');links.new(mx.outputs[0],bw.inputs[0]);gain=nodes.new('ShaderNodeMath');gain.operation='MULTIPLY_ADD';gain.inputs[1].default_value=3.4;gain.inputs[2].default_value=.55;links.new(bw.outputs[0],gain.inputs[0]);final=nodes.new('ShaderNodeMixRGB');final.blend_type='MULTIPLY';final.inputs[0].default_value=1;links.new(mod.outputs[0],final.inputs[1]);links.new(gain.outputs[0],final.inputs[2]);links.new(final.outputs[0],p.inputs['Base Color'])
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.2;bump.inputs['Distance'].default_value=.025;links.new(blend.outputs[0],bump.inputs['Height']);links.new(bump.outputs['Normal'],p.inputs['Normal'])
for i,t in enumerate(r['terrain']):
 obj=mesh(f'Terrain-{i}',t['positions'],t['indices'],mat);a=obj.data.color_attributes.new(name='habitatColor',type='FLOAT_COLOR',domain='POINT')
 for j in range(len(t['positions'])//3):
  cover,forest,moisture,snow=t['habitat'][j*4:j*4+4];c=mix(dry,meadow,.58+moisture*.42);c=tuple(v*(.85+moisture*.3) for v in c);c=mix(c,tuple(v*.98 for v in moss),forest*.72);c=mix(base,c,cover);c=mix(c,(.72,.79,.82),snow)
  if r['region'].get('valley'):
   sediment,variation=t['substrate'][j*2:j*2+2];patch=variation*.8+moisture*.2;c=tuple(v*(.80+patch*.38) for v in c);gravel=mix((.26,.25,.21),(.43,.40,.32),moisture*.3+patch*.35);c=mix(c,gravel,sediment)
  a.data[j].color=(*c,cover)
 for poly in obj.data.polygons:poly.use_smooth=True

# Import the same prepared GLB variants, preserving texture cutouts and source
# part geometry. Linked meshes instance the original data without rebuilding it.
models={}
for model,file in {'oak':'woodland-oak.glb','aspen':'woodland-aspen.glb','pine':'woodland-pine.glb','shrub':'woodland-shrub.glb','fern':'fern.glb','grass':'meadow-grass.glb'}.items():
 before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=os.path.join(assets,file));new=set(bpy.data.objects)-before
 variants={}
 for o in list(new):
  if o.type!='MESH':continue
  node=o
  while node.parent and node.parent in new:node=node.parent
  name=node.name
  variant=0
  if model in ('oak','aspen','pine','shrub'):
   for k in (0,1):
    if f'{model}-{k}' in name:variant=k
  elif model=='grass':
   # PH preparation names source variants grass-0/1.
   variant=1 if name.startswith('grass-b') else 0
  data=o.data.copy();data.transform(o.matrix_world);variants.setdefault(variant,[]).append(data)
 for o in list(new):bpy.data.objects.remove(o,do_unlink=True)
 models[model]=variants
lods=json.load(open(os.path.join(assets,'tree-lods.json')))['models'];lodmodels={}
for model,variants in lods.items():
 lodmodels[model]={}
 for variant,levels in enumerate(variants):
  lodmodels[model][variant]=[]
  for level in levels:
   parts=[]
   for k,part in enumerate(level):
    data=bpy.data.meshes.new(f'{model}-lod');data.from_pydata([xyz(part['position'][i:i+3]) for i in range(0,len(part['position']),3)],[],[part['index'][i:i+3] for i in range(0,len(part['index']),3)]);data.materials.append(models[model][variant][0].materials[k]);uv=data.uv_layers.new()
    for poly in data.polygons:
     poly.use_smooth=True
     for loop in poly.loop_indices:
      v=data.loops[loop].vertex_index;uv.data[loop].uv=(part['uv'][v*2],1-part['uv'][v*2+1])
    parts.append(data)
   lodmodels[model][variant].append(parts)
for plant in r['environment']['trees']+r['environment']['plants']:
 if plant.get('renderLod',0)<0:continue
 variant=models[plant['model']].get(plant.get('variant',0),next(iter(models[plant['model']].values())))
 if plant.get('renderLod',0)>0:variant=lodmodels[plant['model']][plant.get('variant',0)][plant['renderLod']-1]
 for data in variant:
  obj=bpy.data.objects.new(plant['model'],data);scene.collection.objects.link(obj);obj.location=xyz([plant['x'],plant['y'],plant['z']]);obj.rotation_euler.z=plant['rotation'];obj.scale=(plant['size']*plant.get('width',1),plant['size']*plant.get('width',1),plant['size'])

# Actual runtime rock LOD geometry, UVs, source scanned material and fitted pose.
rockdata={}
for key,m in r['rockModels'].items():
 before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=os.path.join(assets,r['rockAssets'][key]));new=set(bpy.data.objects)-before
 source=next(o for o in new if o.type=='MESH');mat=source.data.materials[0].copy();p=mat.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=1
 data=bpy.data.meshes.new(key);data.from_pydata([xyz(m['position'][i:i+3]) for i in range(0,len(m['position']),3)],[],[m['index'][i:i+3] for i in range(0,len(m['index']),3)]);data.materials.append(mat)
 uv=data.uv_layers.new()
 for poly in data.polygons:
  poly.use_smooth=True
  for loop in poly.loop_indices:
   v=data.loops[loop].vertex_index;uv.data[loop].uv=(m['uv'][v*2],1-m['uv'][v*2+1])
 rockdata[key]=data
 for o in new:bpy.data.objects.remove(o,do_unlink=True)
conv=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
for rock in r['rocks']:
 o=bpy.data.objects.new('Rock',rockdata[rock['model']]);scene.collection.objects.link(o);a=rock['matrix'];m=Matrix(tuple(tuple(a[c*4+j] for c in range(4)) for j in range(4)));o.matrix_world=conv@m@conv.inverted()

water=material('Water','#496f65',.2,.12)
if r['region']['module']=='coast':mesh('Ocean',[-960,.1,-960,960,.1,-960,960,.1,960,-960,.1,960],[0,2,1,0,3,2],water)
if r['creek']:
 positions=[];indices=[]
 for i,(x,y,z,w) in enumerate(r['creek']):
  positions.extend([x-w,y,z,x+w,y,z])
  if i<len(r['creek'])-1:a=i*2;indices.extend([a,a+2,a+1,a+1,a+2,a+3])
 mesh('River',positions,indices,water)
if r['lake']:
 l=r['lake'];positions=[l['x'],l['level'],l['z']];indices=[]
 for i in range(97):a=i/96*2*math.pi;positions.extend([l['x']+math.cos(a)*l['rx']*1.12,l['level'],l['z']+math.sin(a)*l['rz']*1.12])
 for i in range(96):indices.extend([0,i+2,i+1])
 mesh('Crater lake',positions,indices,water)
# The construction grid is a WebGL fragment overlay, not geometry. This CPU
# review omits it and does not draw the unbuilt road/parcel site-plan recipes.
light=bpy.data.lights.new('Sun','SUN');light.energy=2.5;light.angle=math.radians(3);obj=bpy.data.objects.new('Sun',light);scene.collection.objects.link(obj);obj.location=(-70,45,95);obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Camera');obj=bpy.data.objects.new('Camera',cam);scene.collection.objects.link(obj);obj.location=xyz(r['camera']);obj.rotation_euler=(Vector(xyz(r['target']))-obj.location).to_track_quat('-Z','Y').to_euler();cam.type='PERSP';cam.lens_unit='FOV';cam.angle=math.radians(r.get('fov',43));cam.sensor_fit='VERTICAL';cam.clip_end=2000;scene.camera=obj
scene.render.filepath=os.path.join(root,f'region-{num}.png');bpy.ops.render.render(write_still=True)
