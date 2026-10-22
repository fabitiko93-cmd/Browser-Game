import test from 'node:test';
import assert from 'node:assert/strict';
import { SphereGeometry, PerspectiveCamera, Vector3 } from 'three';
import { createReferencePlanetBlueprint as createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionSite, regionCreek, regionLake, regionShore } from '../src/planet-blueprint.js';
import { createPlanetGeography, samplePlanetSurface, planetSurfacePixels } from '../src/planet-geography.js';
import { createRegionEnvironment, regionHabitat } from '../src/planet-environment.js';
import { colonyClearance } from '../src/planet-colony.js';
import { regionOverviewPose } from '../src/planet-camera.js';
import { regionBiome } from '../src/planet-biomes.js';

test('markers occupy real seeded land and carry the exact climate shown by the globe', () => {
  for (const seed of [0, 1, 42, 3077, 'NEREID-3077', 'NEREID-3078', 'rolling-geology']) {
    const planet = createPlanetBlueprint(seed, { regionCount: 5 });
    assert.deepEqual(JSON.parse(JSON.stringify(planet)), planet);
    assert.deepEqual(planet.regions.slice(0, 4), createPlanetBlueprint(seed).regions);
    for (const marker of planet.regions) {
      const s = samplePlanetSurface(planet.geography, marker.latitude, marker.longitude);
      assert.equal(s.ocean, false);
      for (const key of Object.keys(marker.climate)) assert.equal(marker.climate[key], s[key]);
      const region = createRegionBlueprint(planet, marker.id);
      assert.deepEqual(region.climate, marker.climate);
      assert.equal(region.latitude, marker.latitude); assert.equal(region.longitude, marker.longitude);
      assert.equal(region.rotation, marker.rotation);
    }
    const [coast, valley, highland, volcanic] = planet.regions;
    assert.ok(coast.climate.elevationM < 100);
    assert.ok(highland.climate.elevationM > coast.climate.elevationM + 500);
    assert.ok(coast.climate.temperatureC > highland.climate.temperatureC + 6);
    assert.ok(valley.climate.moisture > .53);
    assert.ok(volcanic.climate.volcanism > .6);
    let nearbyOcean = false;
    for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) nearbyOcean ||= samplePlanetSurface(planet.geography, coast.latitude + a, coast.longitude + b).ocean;
    assert.ok(nearbyOcean, 'coastal marker must actually be beside the sea');
  }
});

test('spherical geography has no date-line seam and texture UVs agree with marker coordinates', () => {
  const surface = createPlanetGeography(42);
  assert.notDeepEqual(surface, createPlanetGeography(43));
  for (let lat = -90; lat <= 90; lat += 10) {
    const a = samplePlanetSurface(surface, lat, -180), b = samplePlanetSurface(surface, lat, 180);
    for (const key of ['land', 'elevationM', 'temperatureC', 'moisture']) assert.ok(Math.abs(a[key] - b[key]) < 1e-8);
  }
  const sphere = new SphereGeometry(1, 32, 16), pos = sphere.attributes.position, uv = sphere.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const lat = Math.asin(pos.getY(i)) * 180 / Math.PI;
    assert.ok(Math.abs(lat - (uv.getY(i) * 180 - 90)) < .0001);
    if (Math.abs(lat) > 89) continue;
    const lon = Math.atan2(-pos.getZ(i), pos.getX(i)) * 180 / Math.PI;
    assert.ok(Math.abs(((lon - (uv.getX(i) * 360 - 180) + 540) % 360) - 180) < .0001);
  }
  sphere.dispose();
  const pixels = planetSurfacePixels(surface, 180, 90);
  assert.equal(pixels.data.length, 180 * 90 * 4);
  assert.ok(pixels.data.every((v, i) => i % 4 !== 3 || v === 255));
});

test('regional forms differ in canopy, open rock, snow line and water beyond the construction footprints', () => {
  const p = createPlanetBlueprint('NEREID-3077'), regions = p.regions.map(r => createRegionBlueprint(p, r.id));
  const environments = regions.map(createRegionEnvironment);
  assert.ok(environments[1].trees.length > environments[0].trees.length * 2);
  assert.ok(environments[1].trees.length > environments[3].trees.length * 6);
  assert.ok(environments[2].trees.filter(t => t.model === 'pine').length > environments[2].trees.length * .6);
  assert.ok(environments[3].trees.every(t => t.size < 9));
  const highland = regions[2], biome = regionBiome(highland);
  let snowy = 0, bare = 0;
  for (let z = -320; z <= -110; z += 10) for (let x = -200; x <= 200; x += 10) {
    const y = regionGroundHeight(highland, x, z), h = regionHabitat(highland, x, z, y);
    if (y > biome.snowLine + 12) { assert.ok(h.snow > .99); snowy++; }
    if (regionHabitat(regions[3], x, z, regionGroundHeight(regions[3], x, z)).cover < .4) bare++;
  }
  assert.ok(snowy > 5 && bare > 30);
  for (const seed of [0, 42, 'NEREID-3077']) {
    const planet = createPlanetBlueprint(seed), valley = createRegionBlueprint(planet, planet.regions[1].id), crater = createRegionBlueprint(planet, planet.regions[3].id);
    for (let z = -960; z <= 960; z += 4) { const c = regionCreek(valley, z); assert.ok(c.x + c.width < -72); assert.equal(regionSite(valley, c.x, z).water, true); }
    const l = regionLake(crater); assert.ok(l.z + l.rz < -96);
    assert.equal(regionSite(crater, l.x, l.z).water, true);
    assert.equal(regionHabitat(crater, l.x, l.z, regionGroundHeight(crater, l.x, l.z)).cover, 0);
  }
});

test('each colony site has its own grounded layout with clear access routes and usable terraces', () => {
  for (const seed of [0, 42, 'NEREID-3077']) {
    const p = createPlanetBlueprint(seed), regions = p.regions.map(r => createRegionBlueprint(p, r.id));
    assert.equal(new Set(regions.map(r => JSON.stringify(r.colony.roads))).size, 4);
    for (const r of regions) {
      assert.ok(regionSite(r, 0, 0).buildable);
      for (const path of r.colony.roads) for (const [x,z] of path) { assert.ok(colonyClearance(r, x,z) <= 0); assert.equal(regionSite(r,x,z).water,false); }
      for (const [x,z,w,d] of r.colony.pads) {
        assert.ok(regionSite(r,x,z).buildable);
        const heights = [-w/2,0,w/2].flatMap(dx => [-d/2,0,d/2].map(dz => regionGroundHeight(r,x+dx,z+dz)));
        assert.ok(Math.max(...heights)-Math.min(...heights)<1.6);
      }
      const e=createRegionEnvironment(r);
      assert.ok(e.trees.every(t=>colonyClearance(r,t.x,t.z)>4));
      assert.ok(e.plants.every(t=>colonyClearance(r,t.x,t.z)>=2.8));
    }
  }
});

test('portrait overviews retain the colony and its identifying landscape in the actual camera pose', () => {
  const p = createPlanetBlueprint('NEREID-3077');
  for (const marker of p.regions) {
    const r = createRegionBlueprint(p, marker.id), { eye, target, fov } = regionOverviewPose(r);
    for (const [width,height] of [[320,250],[375,400],[390,540]]) {
      const camera = new PerspectiveCamera(fov,width/height,.2,1800);
      camera.position.set(eye.x,eye.y,eye.z);camera.lookAt(target.x,target.y,target.z);camera.updateMatrixWorld();
      const center = new Vector3(0,regionGroundHeight(r,0,0),0).project(camera);
      assert.ok(Math.abs(center.x)<.8 && Math.abs(center.y)<.8);
      const feature = r.module==='coast' ? [regionShore(r,-25),-25] : r.module==='basin' ? [regionCreek(r,-20).x,-20] : r.module==='caldera' ? [regionLake(r).x,regionLake(r).z] : null;
      if(feature){const v = new Vector3(feature[0],regionGroundHeight(r,...feature),feature[1]).project(camera);assert.ok(Math.abs(v.x)<.85 && Math.abs(v.y)<.85);}
      else {
        let visibleSnow=0;
        for(let z=-320;z<=-100;z+=10)for(let x=-200;x<=200;x+=10){const y=regionGroundHeight(r,x,z),v=new Vector3(x,y,z).project(camera);if(regionHabitat(r,x,z,y).snow>.5 && Math.abs(v.x)<.95 && Math.abs(v.y)<.95)visibleSnow++;}
        assert.ok(visibleSnow>10,'overview must expose the alpine snow zone');
      }
      const stable=structuredClone({eye,target,fov});
      // Overview generation applies exactly the normal terrain safety rules.
      assert.deepEqual(regionOverviewPose(r),stable);
    }
  }
});
