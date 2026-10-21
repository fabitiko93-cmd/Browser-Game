"""Blender offline: bake source mature pine LOD2s for the distant forest.
blender -b --factory-startup --disable-autoexec --python scripts/bake-planet-forest.py -- artifacts/polyhaven
The nearby plants retain real 3D geometry. No original tree is loaded at runtime.
"""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
cache=Path(sys.argv[sys.argv.index('--')+1]).resolve()
bpy.ops.wm.open_mainfile(filepath=str(cache/'pine_tree_01_1k.blend'),load_ui=False,use_scripts=False)
keep=[bpy.data.objects['pine_tree_01_a_LOD2'],bpy.data.objects['pine_tree_01_b_LOD2']]
for obj in list(bpy.data.objects):
 if obj not in keep:bpy.data.objects.remove(obj,do_unlink=True)
# Bake soft neutral light. Source albedo is retained, with no missing external
# displacement/roughness maps and no renderer-specific node dependencies.
for mat in bpy.data.materials:
 mat.use_nodes=True;mat.node_tree.nodes.clear();nodes=mat.node_tree.nodes;links=mat.node_tree.links
 output=nodes.new('ShaderNodeOutputMaterial');bs=nodes.new('ShaderNodeBsdfPrincipled');bs.inputs['Roughness'].default_value=1;links.new(bs.outputs['BSDF'],output.inputs['Surface'])
 name=mat.name
 if 'bark' in name or 'dead' in name:kind='bark'
 elif 'trunk' in name:kind=name.split('pine_tree_01_')[-1].split('.')[0]
 else:kind='twig'
 filename=cache/'pine_tree_01/textures'/('pine_tree_01_'+kind+'_diff_1k.jpg')
 if not filename.exists():filename=cache/'pine_tree_01/textures/pine_tree_01_bark_diff_1k.jpg'
 tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(filename),check_existing=True);links.new(tex.outputs['Color'],bs.inputs['Base Color'])
 if kind=='twig':
  alpha=nodes.new('ShaderNodeTexImage');alpha.image=bpy.data.images.load(str(cache/'pine_tree_01/alpha.png'),check_existing=True);alpha.image.colorspace_settings.name='Non-Color';links.new(alpha.outputs['Color'],bs.inputs['Alpha'])
scene=bpy.context.scene
scene.world=bpy.data.worlds.new('Neutral sky');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.79,.9,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.85
bpy.ops.object.light_add(type='AREA',location=(10,-15,20));bpy.context.object.data.energy=700;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=25
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=12;scene.cycles.use_denoising=True
scene.render.resolution_x=256;scene.render.resolution_y=512;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.view_settings.view_transform='Standard';scene.view_settings.look='None';scene.view_settings.exposure=-.3
frames=cache/'forest-frames';frames.mkdir(exist_ok=True)
for variant,obj in enumerate(keep):
 for other in keep:other.hide_render=other!=obj
 obj.location=(0,0,0)
 bounds=[obj.matrix_world@Vector(c)for c in obj.bound_box];low=min(v.z for v in bounds);high=max(v.z for v in bounds);height=high-low;mid=Vector((0,0,(high+low)/2))
 cam.data.ortho_scale=height*1.22
 for frame in range(8):
  angle=frame*math.tau/8;cam.location=mid+Vector((math.sin(angle)*height*3,-math.cos(angle)*height*3,0));cam.rotation_euler=(mid-cam.location).to_track_quat('-Z','Y').to_euler()
  scene.render.filepath=str(frames/f'{variant}-{frame}.png');bpy.ops.render.render(write_still=True)
