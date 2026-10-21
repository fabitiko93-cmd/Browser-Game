import * as THREE from 'three';
import { regionBiome } from './planet-biomes.js';

// Preserve scanned surface detail, but define living turf independently from
// brown source leaf litter. Raw litter is a small component below tree crowns.
export function blendHabitatGround(material, { meadow, meadowNormal, forest, forestNormal }, region) {
  const biome = regionBiome(region);
  const colors = Object.fromEntries(['meadow', 'moss', 'dry'].map(key => [key, new THREE.Color(biome[key])]));
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, { meadowMap: { value: meadow }, meadowNormal: { value: meadowNormal }, forestMap: { value: forest }, forestNormal: { value: forestNormal }, meadowTint: { value: colors.meadow }, mossTint: { value: colors.moss }, dryTint: { value: colors.dry } });
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 habitat;varying vec3 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHabitat=habitat;vGroundUv=vec2(position.x,-position.z);');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D meadowMap;uniform sampler2D meadowNormal;uniform sampler2D forestMap;uniform sampler2D forestNormal;uniform vec3 meadowTint;uniform vec3 mossTint;uniform vec3 dryTint;varying vec3 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec2 grassUv=vGroundUv/2.4;
        vec2 rotatedUv=mat2(.8,-.6,.6,.8)*grassUv+vec2(.37,.71);
        vec3 grassScan=mix(texture2D(meadowMap,grassUv).rgb,texture2D(meadowMap,rotatedUv).rgb,.45);
        vec3 litter=texture2D(forestMap,vGroundUv/3.1).rgb;
        float textureDetail=clamp(.72+dot(grassScan,vec3(.2126,.7152,.0722))*1.4,.72,1.25);
        vec3 turf=mix(dryTint,meadowTint,.58+vHabitat.z*.42)*textureDetail*(.85+vHabitat.z*.3);
        vec3 moss=mossTint*(.78+dot(litter,vec3(.2126,.7152,.0722))*.75);
        vec3 woodland=mix(moss,litter,.15);
        vec3 livingGround=mix(turf,woodland,vHabitat.y*.72);
        diffuseColor.rgb=mix(diffuseColor.rgb,livingGround,vHabitat.x);`);
    const normals = THREE.ShaderChunk.normal_fragment_maps.replace('mapN.xy *= normalScale;', `vec3 livingNormal=mix(texture2D(meadowNormal,vGroundUv/2.4).xyz,texture2D(forestNormal,vGroundUv/3.1).xyz,vHabitat.y*.5)*2.-1.;
      mapN=mix(mapN,livingNormal,vHabitat.x);mapN.xy *= normalScale;`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', normals);
  };
  material.customProgramCacheKey = () => 'orbit-living-turf-v2';
  return material;
}
