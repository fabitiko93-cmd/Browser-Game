import * as THREE from 'three';
import { valleyDefinition } from './planet-valley.js';
import { regionBiome } from './planet-biomes.js';

// Preserve scanned surface detail, but define living turf independently from
// brown source leaf litter. Raw litter is a small component below tree crowns.
export function blendHabitatGround(material, { meadow, meadowNormal, forest, forestNormal }, region) {
  const biome = regionBiome(region), valley = !!valleyDefinition(region) || !!biome.natural;
  const colors = Object.fromEntries(['meadow', 'moss', 'dry'].map(key => [key, new THREE.Color(biome[key])]));
  const gravel = biome.gravel ? biome.gravel.map(c => new THREE.Color(c)) : [new THREE.Color().setRGB(.26, .25, .21), new THREE.Color().setRGB(.43, .40, .32)];
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, { meadowMap: { value: meadow }, meadowNormal: { value: meadowNormal }, forestMap: { value: forest }, forestNormal: { value: forestNormal }, meadowTint: { value: colors.meadow }, mossTint: { value: colors.moss }, dryTint: { value: colors.dry }, valleyGround: { value: valley ? 1 : 0 }, alienGround: { value: biome.alien ? 1 : 0 }, gravelDark: { value: gravel[0] }, gravelLight: { value: gravel[1] }, groundGlow: { value: new THREE.Color(biome.groundEmission ?? '#000000') }, naturalGround: { value: biome.natural ? 1 : 0 } });
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 habitat;attribute vec2 substrate;varying vec2 vSubstrate;varying vec4 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHabitat=habitat;vSubstrate=substrate;vGroundUv=vec2(position.x,-position.z);');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D meadowMap;uniform sampler2D meadowNormal;uniform sampler2D forestMap;uniform sampler2D forestNormal;uniform vec3 meadowTint;uniform vec3 mossTint;uniform vec3 dryTint;uniform vec3 gravelDark;uniform vec3 gravelLight;uniform vec3 groundGlow;uniform float alienGround;uniform float valleyGround;uniform float naturalGround;varying vec2 vSubstrate;varying vec4 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec2 grassUv=vGroundUv/2.4;
        vec2 rotatedUv=mat2(.8,-.6,.6,.8)*grassUv+vec2(.37,.71);
        vec3 grassScan=mix(texture2D(meadowMap,grassUv).rgb,texture2D(meadowMap,rotatedUv).rgb,.45);
        vec3 litter=texture2D(forestMap,vGroundUv/3.1).rgb;
        float textureDetail=clamp(.72+dot(grassScan,vec3(.2126,.7152,.0722))*1.4,.72,1.25);
        float meadowPatch=clamp(vSubstrate.y*.8+vHabitat.z*.2,0.,1.);
        vec3 mineral=mix(dryTint,gravelLight,clamp(1.-vHabitat.x,0.,1.)*.72)*textureDetail;
        float strata=.94+.06*sin(vGroundUv.x*.13+sin(vGroundUv.y*.07)*2.);
        diffuseColor.rgb=mix(diffuseColor.rgb,mineral*strata,naturalGround);
        vec3 turf=mix(dryTint,meadowTint,.58+vHabitat.z*.42)*textureDetail*(.85+vHabitat.z*.3);
        vec3 macroScan=mix(texture2D(meadowMap,vGroundUv/18.).rgb,texture2D(meadowMap,mat2(.8,-.6,.6,.8)*vGroundUv/43.).rgb,.4);
        float meadowGrain=clamp(.55+dot(macroScan,vec3(.2126,.7152,.0722))*3.4,.65,1.45);
        turf*=mix(1.,(.80+meadowPatch*.38)*meadowGrain,valleyGround);
        vec3 moss=mossTint*(.78+dot(litter,vec3(.2126,.7152,.0722))*.75);
        vec3 woodland=mix(moss,mix(litter,mossTint*(.65+dot(litter,vec3(.2126,.7152,.0722))),alienGround),mix(.15,.32,valleyGround));
        vec3 livingGround=mix(turf,woodland,vHabitat.y*.72);
        diffuseColor.rgb=mix(diffuseColor.rgb,livingGround,vHabitat.x);
        float grit=clamp(dot(grassScan,vec3(.2126,.7152,.0722))*2.4+.7,.7,1.3);
        vec3 gravel=mix(gravelDark,gravelLight,vHabitat.z*.3+meadowPatch*.35)*grit;
        diffuseColor.rgb=mix(diffuseColor.rgb,gravel,vSubstrate.x*valleyGround);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.72,.79,.82)*textureDetail,vHabitat.w);`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance+=groundGlow*vHabitat.x*(.45+.55*vHabitat.z);');
    const normals = THREE.ShaderChunk.normal_fragment_maps.replace('mapN.xy *= normalScale;', `vec3 livingNormal=mix(texture2D(meadowNormal,vGroundUv/2.4).xyz,texture2D(forestNormal,vGroundUv/3.1).xyz,vHabitat.y*.5)*2.-1.;
      mapN=mix(mapN,livingNormal,vHabitat.x);mapN.xy *= normalScale;`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', normals);
  };
  material.customProgramCacheKey = () => 'orbit-climate-ground-v6';
  return material;
}
