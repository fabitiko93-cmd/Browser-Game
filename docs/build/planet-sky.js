import { BoxGeometry, Mesh, ShaderMaterial, BackSide, Color, Vector3 } from 'three';
import { PLANET_SKIES } from './planet-sky-data.js';
import { REGION_MODULES } from './planet-blueprint.js';
import { regionBiosphere, regionBiome } from './planet-biomes.js';

// Presentation only: fixed daytime weather, never a new geography/save recipe.
export function regionSkyProfile(region) {
  if (region.preset === 'lunar' || region.module === 'regolith') return null;
  const earth = region.preset === 'temperate', biology = regionBiosphere(region);
  const biome = regionBiome(region);
  const cloudy = biome?.natural ? ['rainforest', 'wetland', 'ice'].includes(biome.id) || biome.moisture > .82 : region.module === 'caldera' || ((region.climate?.moisture ?? 0) > .88 && (region.climate?.temperatureC ?? 20) < 10);
  const weather = earth ? cloudy ? 'overcast' : 'fair' : 'dust';
  const id = biology.alien ? `${region.biosphere}-${weather}` : weather, overcast = weather === 'overcast';
  const source = PLANET_SKIES[id], module = REGION_MODULES[region.module];
  const azimuth = -2.57 + (region.rotation ?? 0) * .2 + Math.sin((region.latitude ?? 0) * Math.PI / 180) * .15;
  const elevation = source?.elevation ?? .65;
  return {
    id, file: source?.file ?? null, yaw: azimuth - (source?.azimuth ?? 0),
    horizon: source?.horizon ?? module.fog, top: module.sky,
    sunDirection: [Math.cos(elevation) * Math.cos(azimuth), Math.sin(elevation), Math.cos(elevation) * Math.sin(azimuth)],
    sunColor: region.biosphere === 'coral' ? '#ffe1b7' : region.biosphere === 'spore' ? '#e7f4e6' : earth ? '#fff3df' : '#ffe1b0', sunIntensity: overcast ? .8 : earth ? 2.6 : 2.3,
    ambientColor: biology.alien ? region.biosphere === 'spore' ? '#a9c6ce' : '#c8bfca' : overcast ? '#c7d3df' : earth ? '#b7d0e8' : '#c4ab94',
    ambientIntensity: overcast ? 1.45 : earth ? 1.05 : .85,
    fogDensity: biome?.natural && biome.id === 'rainforest' ? .0019 : biome?.natural && biome.id === 'wetland' ? .00165 : overcast ? .00125 : earth ? region.module === 'upland' ? .00085 : .00105 : .0015
  };
}

export function createRegionSky(profile, texture) {
  const sky = new Mesh(new BoxGeometry(2, 2, 2), new ShaderMaterial({
    name: 'PlanetSky', side: BackSide, depthWrite: false, depthTest: false, toneMapped: false,
    uniforms: { panorama: { value: texture }, photographed: { value: texture ? 1 : 0 }, yaw: { value: profile.yaw }, horizon: { value: new Color(profile.horizon) }, top: { value: new Color(profile.top) }, sunDirection: { value: new Vector3(...profile.sunDirection) } },
    // Remove camera translation: an infinite sky never intersects the terrain
    // or changes size when zooming. Draw first, without touching scene depth.
    vertexShader: `varying vec3 skyDirection;
      void main(){skyDirection=position;vec4 p=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.);gl_Position=p.xyww;}`,
    fragmentShader: `uniform sampler2D panorama;uniform float photographed;uniform float yaw;uniform vec3 horizon;uniform vec3 top;uniform vec3 sunDirection;varying vec3 skyDirection;
      void main(){
        vec3 d=normalize(skyDirection);vec3 color;
        if(photographed>.5){
          vec2 uv=vec2((atan(d.z,d.x)-yaw)/6.28318530718+.5,asin(clamp(d.y,-1.,1.))/3.14159265359+.5);
          color=texture2D(panorama,uv).rgb;
        }else{
          color=mix(horizon,top,pow(max(d.y,0.),.5));
          float toward=max(dot(d,sunDirection),0.);
          color+=vec3(.21,.13,.06)*pow(toward,24.)+vec3(.55,.4,.21)*smoothstep(.99965,.9999,toward);
        }
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }`
  }));
  sky.name = 'Planet skybox'; sky.frustumCulled = false; sky.renderOrder = -1000;
  return sky;
}
