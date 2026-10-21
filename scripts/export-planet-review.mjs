// Export real scene recipes for independent CPU review when WebGL is unavailable.
// This is deliberately not a browser screenshot or a shader/performance test.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PlaneGeometry, BufferGeometry, Float32BufferAttribute } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionTerrainPatches, regionHeight, regionGroundHeight, regionCreek, regionLake, ROCK_ASSETS, REGION_MODULES } from '../src/planet-blueprint.js';
import { regionOverviewPose } from '../src/planet-camera.js';
import { regionBiome } from '../src/planet-biomes.js';
import { planetSurfacePixels } from '../src/planet-geography.js';
import { createRegionEnvironment, regionHabitat } from '../src/planet-environment.js';
import { rockFootprint, fitRockToGround } from '../src/planet-rocks.js';
const output = resolve(process.argv[2] ?? 'artifacts/landscapes'), seed = process.argv[3] ?? 'NEREID-3077';
await mkdir(output, { recursive: true });
const planet = createPlanetBlueprint(seed), pixels = planetSurfacePixels(planet.geography);
await writeFile(resolve(output, 'globe.rgba'), pixels.data);
await writeFile(resolve(output, 'planet.json'), JSON.stringify(planet));
const { models: lods } = JSON.parse(await readFile('web/models/planets/rock-lods.json', 'utf8'));
for (const r of planet.regions) {
  const region = createRegionBlueprint(planet, r.id), environment = createRegionEnvironment(region), biome = regionBiome(region), terrain = [];
  for (const p of regionTerrainPatches(region)) {
    const g = new PlaneGeometry(p.maxX - p.minX, p.maxZ - p.minZ, p.segmentsX, p.segmentsZ); g.rotateX(-Math.PI / 2); g.translate((p.minX + p.maxX) / 2, 0, (p.minZ + p.maxZ) / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, regionHeight(region, pos.getX(i), pos.getZ(i)));
    g.computeVertexNormals();
    const habitat = [];
    for (let i = 0; i < pos.count; i++) {
      const ny = Math.max(.05, g.attributes.normal.getY(i)), slope = Math.sqrt(Math.max(0, 1 - ny * ny)) / ny;
      const h = regionHabitat(region, pos.getX(i), pos.getZ(i), pos.getY(i), slope);
      habitat.push(h.cover, h.forest, h.moisture, h.snow);
    }
    terrain.push({ positions: Array.from(pos.array), indices: Array.from(g.index.array), habitat });g.dispose();
  }
  const creek = region.module === 'basin' ? Array.from({ length: 641 }, (_, i) => { const z = -960 + i * 3, c = regionCreek(region, z); return [c.x, regionGroundHeight(region, c.x, z) + c.depth * .48, z, c.width * 1.18]; }) : null;
  const pose = regionOverviewPose(region), target = [pose.target.x, pose.target.y, pose.target.z], camera = [pose.eye.x, pose.eye.y, pose.eye.z];
  const rockModels = lods;
  const rocks = [...region.rocks, ...environment.rocks].map(rock => {
    const m = lods[rock.model], g = new BufferGeometry();
    // Set explicit source geometry, exactly as the runtime LOD loader does.
    g.setAttribute('position', new Float32BufferAttribute(m.position, 3));g.setIndex(m.index);
    const pose = fitRockToGround(region, rock, rockFootprint(g));g.dispose();
    return { model: rock.model, matrix: pose.matrix.toArray() };
  });
  const site = region.colony;
  const roads = site.roads.map(path => path.map(([x,z]) => [x, regionGroundHeight(region,x,z)+.05,z]));
  const pads = site.pads.map(([x,z,w,d]) => {const g=new PlaneGeometry(w,d,Math.ceil(w/2),Math.ceil(d/2));g.rotateX(-Math.PI/2);g.translate(x,0,z);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,regionGroundHeight(region,p.getX(i),p.getZ(i))+.05);const result={positions:Array.from(p.array),indices:Array.from(g.index.array)};g.dispose();return result;});
  await writeFile(resolve(output, r.id + '.json'), JSON.stringify({ region, environment, biome, terrain, camera, target, fov:pose.fov, creek, lake:regionLake(region), roads, pads, rocks, rockModels, rockAssets:ROCK_ASSETS, module:REGION_MODULES[region.module] }));
  console.log(r.id, biome.name, environment.trees.length, 'trees');
}
