import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Group, PerspectiveCamera, Matrix4, Frustum, Vector3, BufferGeometry, BufferAttribute, MeshStandardMaterial } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionHeight, regionGroundHeight, regionCreek, regionSite } from '../src/planet-blueprint.js';
import { VALLEY_VARIANTS, valleyEcology } from '../src/planet-valley.js';
import { createRegionEnvironment, regionHabitat } from '../src/planet-environment.js';
import { regionOverviewPose } from '../src/planet-camera.js';
import { readFloraLods, addFloraBatches, updateFloraLods } from '../src/planet-flora.js';
const valley = (id, seed = 'NEREID-3077') => { const p = createPlanetBlueprint(seed, { valley: id }); return createRegionBlueprint(p, 'region-1'); };

test('three prepared valley forms survive serialization and differ in landform, river and site layout', () => {
  const signatures = [];
  for (const { id } of VALLEY_VARIANTS) {
    const r = valley(id), copy = JSON.parse(JSON.stringify(r));
    assert.equal(r.valley, id); assert.deepEqual(copy, r);
    const heights = [], water = [];
    for (let z = -500; z <= 500; z += 25) {
      const c = regionCreek(r,z); water.push(+c.x.toFixed(2));
      for (let x = -500; x <= 500; x += 25) {
        assert.equal(regionHeight(r,x,z),regionHeight(copy,x,z));
        heights.push(+regionHeight(r,x,z).toFixed(2));
        const e = valleyEcology(r,x,z); for (const v of Object.values(e)) assert.ok(v >= 0 && v <= 1);
      }
    }
    signatures.push({ heights, water, site:JSON.stringify(r.colony) });
  }
  for (let i=0;i<3;i++) for(let j=i+1;j<3;j++) {
    const rms=Math.sqrt(signatures[i].heights.reduce((s,h,k)=>s+(h-signatures[j].heights[k])**2,0)/signatures[i].heights.length);
    assert.ok(rms > 8,'variants must change the terrain, not just scatter props');
    assert.notDeepEqual(signatures[i].water,signatures[j].water); assert.notEqual(signatures[i].site,signatures[j].site);
  }
});

test('every valley keeps a continuous downhill river, wet bed and a dry gentle construction terrace', () => {
  for (const { id } of VALLEY_VARIANTS) for(const seed of [0,42,'NEREID-3077']) {
    const r=valley(id,seed); let previous=Infinity;
    for(let z=-950;z<=950;z+=6) {
      const c=regionCreek(r,z), bed=regionGroundHeight(r,c.x,z);
      assert.ok(c.level <= previous && Math.abs(c.level-previous)<.04 || previous===Infinity);previous=c.level;
      assert.ok(c.x+c.width < -72,`${id}: floodway overlaps colony`);
      assert.ok(bed<c.level-.8,`${id}/${z}: water must fill a real bed`);
      assert.equal(regionSite(r,c.x,z).water,true);assert.equal(regionHabitat(r,c.x,z,bed).cover,0);
    }
    for(let z=-63;z<=63;z+=6)for(let x=-63;x<=63;x+=6) {
      const site=regionSite(r,x,z);assert.ok(site.buildable && !site.water && site.slope<.035);
    }
    for(const [x,z] of [[-35,-35],[35,-35],[-35,35],[35,35]]) {
      const h=[-15,0,15].flatMap(dx=>[-18,0,18].map(dz=>regionGroundHeight(r,x+dx,z+dz)));
      assert.ok(Math.max(...h)-Math.min(...h)<.55,'large foundations need one gentle surface');
    }
  }
});

test('all three portrait overviews expose both the settlement terrace and the river', () => {
  for(const {id} of VALLEY_VARIANTS)for(const aspect of [.7,1,1.28]) {
    const r=valley(id),pose=regionOverviewPose(r),c=new PerspectiveCamera(pose.fov,aspect,.2,1800);
    c.position.copy(pose.eye);c.lookAt(pose.target.x,pose.target.y,pose.target.z);c.updateMatrixWorld();
    for(const [x,z] of [[0,0],[regionCreek(r,-20).x,-20]]) {
      const p=new Vector3(x,regionGroundHeight(r,x,z),z).project(c);assert.ok(Math.abs(p.x)<.85&&Math.abs(p.y)<.85);
    }
  }
});

test('dense woodland uses camera-dependent 3D LODs within a bounded visible geometry budget', async () => {
  const {models}=JSON.parse(await readFile(new URL('../web/models/planets/tree-lods.json',import.meta.url)));
  const geometries=Object.fromEntries(Object.entries(models).map(([id,source])=>[id,readFloraLods(source)]));
  for(const levels of Object.values(geometries))for(const variant of levels) {
    assert.ok(variant[1].reduce((n,g)=>n+g.index.count/3,0)<650);
    for(const parts of variant)for(const g of parts) {
      assert.equal(g.attributes.normal.count,g.attributes.position.count);assert.equal(g.attributes.uv.count,g.attributes.position.count);
      for(const i of g.index.array)assert.ok(i<g.attributes.position.count);
    }
  }
  const material=new MeshStandardMaterial(),full={};
  for(const model of ['oak','aspen']) {
    const bytes=await readFile(new URL(`../web/models/planets/woodland-${model}.glb`,import.meta.url)),length=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+length)),bin=bytes.subarray(28+length);
    const attribute=(id,width)=>{const a=doc.accessors[id],v=doc.bufferViews[a.bufferView],offset=bin.byteOffset+(v.byteOffset??0)+(a.byteOffset??0);return new BufferAttribute(a.componentType===5126?new Float32Array(bin.buffer,offset,a.count*width):new Uint32Array(bin.buffer,offset,a.count),width);};
    full[model]=doc.meshes.map(m=>m.primitives.map(p=>({geometry:new BufferGeometry().setAttribute('position',attribute(p.attributes.POSITION,3)).setIndex(attribute(p.indices,1)),material})));
  }
  for(const {id} of VALLEY_VARIANTS) {
    const r=valley(id),e=createRegionEnvironment(r),group=new Group(),pose=regionOverviewPose(r),camera=new PerspectiveCamera(pose.fov,.75,.2,1800);
    assert.ok(e.trees.length>2800&&e.trees.length<6000);assert.ok(e.trees.some(t=>Math.hypot(t.x,t.z)>500));
    for(const model of ['oak','aspen']) {
      const source=full[model];
      addFloraBatches(group,e.trees.filter(t=>t.model===model),source,{trees:true,lods:geometries[model]});
    }
    camera.position.copy(pose.eye);camera.lookAt(pose.target.x,pose.target.y,pose.target.z);camera.updateMatrixWorld();
    assert.ok(updateFloraLods(group,camera));
    const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
    let triangles=0,draws=0;
    for(const mesh of group.children)if(frustum.intersectsSphere(mesh.boundingSphere)) {triangles+=mesh.geometry.index.count/3*mesh.count;draws++;}
    assert.ok(triangles<2000000,`${id}: ${triangles} visible tree triangles`);assert.ok(draws<240,`${id}: ${draws} tree draws`);
    const batch=group.children[0];camera.position.copy(batch.userData.lodCenter).add(new Vector3(20,15,20));updateFloraLods(group,camera);assert.equal(batch.userData.lodLevel,0);
    camera.position.copy(batch.userData.lodCenter).add(new Vector3(300,80,0));updateFloraLods(group,camera);assert.equal(batch.userData.lodLevel,2);
    for(const m of group.children)m.dispose();
  }
  for(const variants of Object.values(geometries))for(const levels of variants)for(const parts of levels)for(const g of parts)g.dispose();
  for(const variants of Object.values(full))for(const parts of variants)for(const p of parts)p.geometry.dispose();material.dispose();
});
