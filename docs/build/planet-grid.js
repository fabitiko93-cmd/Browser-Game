import { REGION_BUILD_GRID } from './planet-blueprint.js';

// Draw on the actual terrain fragments: no floating line segments, mismatched
// surface triangles or coplanar road/pad overlays. Widths are in CSS pixels.
export function blendBuildGrid(material, { visible = true, pixelRatio = 1 } = {}) {
  const enabled = { value: visible ? 1 : 0 }, ratio = { value: pixelRatio };
  const previous = material.onBeforeCompile, previousKey = material.customProgramCacheKey.bind(material);
  material.onBeforeCompile = shader => {
    previous.call(material, shader);
    Object.assign(shader.uniforms, { buildGridEnabled: enabled, buildGridPixelRatio: ratio });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vBuildGridXZ;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBuildGridXZ=position.xz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec2 vBuildGridXZ;
      uniform float buildGridEnabled;
      uniform float buildGridPixelRatio;
      float buildGridStroke(vec2 p,vec2 footprint,float radius){
        vec2 distancePx=abs(fract(p+.5)-.5)/max(footprint,vec2(.00001));
        return 1.-smoothstep(max(0.,radius-.5),radius+.5,min(distancePx.x,distancePx.y));
      }`)
      // After lighting and fog, this is a readable planning overlay in output
      // colour space. Other scene objects still occlude the terrain normally.
      .replace('#include <fog_fragment>', `#include <fog_fragment>
        vec2 gridP=(vBuildGridXZ+${REGION_BUILD_GRID.halfExtent.toFixed(1)})/${REGION_BUILD_GRID.cellSize.toFixed(1)};
        vec2 gridFootprint=fwidth(gridP),gridMajorFootprint=gridFootprint/4.;
        float gridInside=step(max(abs(vBuildGridXZ.x),abs(vBuildGridXZ.y)),${REGION_BUILD_GRID.halfExtent.toFixed(1)})*buildGridEnabled;
        float gridFineFade=1.-smoothstep(.45,.9,max(gridFootprint.x,gridFootprint.y)*buildGridPixelRatio);
        float gridMajorFade=1.-smoothstep(.45,.9,max(gridMajorFootprint.x,gridMajorFootprint.y)*buildGridPixelRatio);
        float gridFine=buildGridStroke(gridP,gridFootprint,.42*buildGridPixelRatio)*gridFineFade;
        float gridMajor=buildGridStroke(gridP/4.,gridMajorFootprint,.68*buildGridPixelRatio)*gridMajorFade;
        vec2 gridEdgeDistance=(${REGION_BUILD_GRID.halfExtent.toFixed(1)}-abs(vBuildGridXZ))/max(fwidth(vBuildGridXZ),vec2(.00001));
        float gridEdge=1.-smoothstep(.6*buildGridPixelRatio,1.8*buildGridPixelRatio,min(gridEdgeDistance.x,gridEdgeDistance.y));
        float gridUnder=max(buildGridStroke(gridP,gridFootprint,.95*buildGridPixelRatio)*gridFineFade,buildGridStroke(gridP/4.,gridMajorFootprint,1.15*buildGridPixelRatio)*gridMajorFade);
        gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.07,.13,.105),max(gridUnder*.48,gridEdge*.6)*gridInside);
        gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.64,.79,.69),gridFine*.62*gridInside);
        gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.88,.74,.46),max(gridMajor*.85,gridEdge*.96)*gridInside);`);
  };
  material.customProgramCacheKey = () => `${previousKey()}:orbit-build-grid-v1`;
  return { enabled, pixelRatio: ratio };
}
