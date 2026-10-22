// Export real scene recipes for independent CPU review when WebGL is unavailable.
// This is deliberately not a browser screenshot or a shader/performance test.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PlaneGeometry, BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionTerrainPatches, regionHeight, regionGroundHeight, regionCreek, regionLake, regionLakes, ROCK_ASSETS, REGION_MODULES } from '../src/planet-blueprint.js';
import { regionOverviewPose, constrainRegionCamera } from '../src/planet-camera.js';
import { floraChunkKey, floraChunkCenter, floraLodLevel, TREE_CHUNK_SIZE, CANOPY_MODELS } from '../src/planet-flora.js';
import { regionBiome, regionBiosphere } from '../src/planet-biomes.js';
import { planetSurfacePixels } from '../src/planet-geography.js';
import { createRegionEnvironment, regionHabitat, FLORA_ASSETS } from '../src/planet-environment.js';
import { rockFootprint, fitRockToGround } from '../src/planet-rocks.js';
import { regionSkyProfile } from '../src/planet-sky.js';
import { regionHorizonGeometry } from '../src/planet-horizon.js';
const output = resolve(process.argv[2] ?? 'artifacts/landscapes'), seed = process.argv[3] ?? 'NEREID-3077';
await mkdir(output, { recursive: true });
const biosphere = process.argv.find(a => a.startsWith('--biosphere='))?.split('=')[1] ?? 'terran';
const planet = createPlanetBlueprint(seed, { valley: process.argv[4], biosphere }), pixels = planetSurfacePixels(planet.geography, 1024, 512, regionBiosphere(planet));
await writeFile(resolve(output, 'globe.rgba'), pixels.data);
await writeFile(resolve(output, 'planet.json'), JSON.stringify(planet));
const { models: lods } = JSON.parse(await readFile('web/models/planets/rock-lods.json', 'utf8'));
for (const r of planet.regions.filter(r => !process.argv.includes('--valley-only') || r.module === 'basin')) {
  const region = createRegionBlueprint(planet, r.id), environment = createRegionEnvironment(region), biome = regionBiome(region), terrain = [];
  for (const p of regionTerrainPatches(region)) {
    const g = new PlaneGeometry(p.maxX - p.minX, p.maxZ - p.minZ, p.segmentsX, p.segmentsZ); g.rotateX(-Math.PI / 2); g.translate((p.minX + p.maxX) / 2, 0, (p.minZ + p.maxZ) / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, regionHeight(region, pos.getX(i), pos.getZ(i)));
    g.computeVertexNormals();
    const habitat = [], substrate = [];
    for (let i = 0; i < pos.count; i++) {
      const ny = Math.max(.05, g.attributes.normal.getY(i)), slope = Math.sqrt(Math.max(0, 1 - ny * ny)) / ny;
      const h = regionHabitat(region, pos.getX(i), pos.getZ(i), pos.getY(i), slope);
      habitat.push(h.cover, h.forest, h.moisture, h.snow); substrate.push(h.sediment ?? 0, h.variation ?? .5);
    }
    terrain.push({ positions: Array.from(pos.array), indices: Array.from(g.index.array), habitat, substrate });g.dispose();
  }
  const creek = region.preset === 'temperate' && region.module === 'basin' ? Array.from({ length: 641 }, (_, i) => { const z = -960 + i * 3, c = regionCreek(region, z); return [c.x, c.level ?? regionGroundHeight(region, c.x, z) + c.depth * .48, z, c.width * 1.06]; }) : null;
  const pose = process.argv.includes('--close') ? { eye:{x:-25,y:42,z:95}, target:{x:-82,y:regionGroundHeight(region,-82,-10)+3.5,z:-10}, fov:43 } : regionOverviewPose(region);
  constrainRegionCamera(region,pose.eye,pose.target);
  const target = [pose.target.x, pose.target.y, pose.target.z], camera = [pose.eye.x, pose.eye.y, pose.eye.z];
  const chunks = new Map();
  for (const t of [...environment.trees, ...environment.plants]) {
    const tree = CANOPY_MODELS.includes(t.model), key = `${t.model}/${floraChunkKey(t, t.model === 'fern' ? 1 : 2, tree ? TREE_CHUNK_SIZE : 64)}`;
    if (!chunks.has(key)) chunks.set(key, []); chunks.get(key).push(t);
  }
  for (const plants of chunks.values()) {
    const d = floraChunkCenter(plants).distanceTo(new Vector3(...camera));
    for (const t of plants) t.renderLod = CANOPY_MODELS.includes(t.model) ? floraLodLevel(d) : d < 260 ? 0 : -1;
  }
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
  const horizonGeometry = regionHorizonGeometry(region), horizon = { positions: Array.from(horizonGeometry.attributes.position.array), indices: Array.from(horizonGeometry.index.array), colors: Array.from(horizonGeometry.attributes.color.array) }; horizonGeometry.dispose();
  await writeFile(resolve(output, r.id + '.json'), JSON.stringify({ region, environment, biome, terrain, horizon, sky:regionSkyProfile(region), camera, target, fov:pose.fov, creek, lake:regionLake(region), lakes:regionLakes(region), roads, pads, rocks, rockModels, rockAssets:ROCK_ASSETS, floraAssets:FLORA_ASSETS, module:REGION_MODULES[region.module] }));
  console.log(r.id, biome.name, environment.trees.length, 'trees');
}
