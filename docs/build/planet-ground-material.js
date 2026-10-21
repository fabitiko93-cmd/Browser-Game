import * as THREE from 'three';

// Surface scans share habitat weights with the plant generator. World-space
// UVs keep texture scale constant across the central and surrounding patches.
export function blendHabitatGround(material, { meadow, meadowNormal, forest, forestNormal }) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, { meadowMap: { value: meadow }, meadowNormal: { value: meadowNormal }, forestMap: { value: forest }, forestNormal: { value: forestNormal } });
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec2 habitat;varying vec2 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHabitat=habitat;vGroundUv=vec2(position.x,-position.z);');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D meadowMap;uniform sampler2D meadowNormal;uniform sampler2D forestMap;uniform sampler2D forestNormal;varying vec2 vHabitat;varying vec2 vGroundUv;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec3 grassColor=texture2D(meadowMap,vGroundUv/5.).rgb;
        vec3 woodlandColor=texture2D(forestMap,vGroundUv/4.).rgb;
        vec3 livingGround=mix(grassColor,woodlandColor,vHabitat.y*.92);
        diffuseColor.rgb=mix(diffuseColor.rgb,livingGround,vHabitat.x);`);
    const normals = THREE.ShaderChunk.normal_fragment_maps.replace('mapN.xy *= normalScale;', `vec3 livingNormal=mix(texture2D(meadowNormal,vGroundUv/5.).xyz,texture2D(forestNormal,vGroundUv/4.).xyz,vHabitat.y*.92)*2.-1.;
      mapN=mix(mapN,livingNormal,vHabitat.x);mapN.xy *= normalScale;`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', normals);
  };
  material.customProgramCacheKey = () => 'orbit-habitat-ground-v1';
  return material;
}
