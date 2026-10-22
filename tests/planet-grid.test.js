import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, MeshStandardMaterial, ShaderLib } from 'three';
import { blendBuildGrid } from '../src/planet-grid.js';
import { blendHabitatGround } from '../src/planet-ground-material.js';
import { createPlanetBlueprint, createRegionBlueprint } from '../src/planet-blueprint.js';
import { PlanetPreviewScene } from '../src/planet-preview-scene.js';
const shader = () => ({ vertexShader: ShaderLib.standard.vertexShader, fragmentShader: ShaderLib.standard.fragmentShader, uniforms: {} });

test('the build overlay composes with living terrain and preserves shared shader uniforms on recompilation', () => {
  const p = createPlanetBlueprint('NEREID-3077'), r = createRegionBlueprint(p, 'region-1'), material = new MeshStandardMaterial();
  const textures = { meadow: {}, meadowNormal: {}, forest: {}, forestNormal: {} };
  blendHabitatGround(material, textures, r);
  const state = blendBuildGrid(material, { pixelRatio: 1.4 });
  for (let n = 0; n < 2; n++) {
    const s = shader(); material.onBeforeCompile(s);
    assert.equal(s.uniforms.meadowMap.value, textures.meadow);
    assert.equal(s.uniforms.forestNormal.value, textures.forestNormal);
    assert.equal(s.uniforms.buildGridEnabled, state.enabled);
    assert.equal(s.uniforms.buildGridPixelRatio.value, 1.4);
    assert.ok(material.customProgramCacheKey().includes('orbit-climate-ground-v5'));
  }
  assert.equal(material.depthTest, true); assert.equal(material.depthWrite, true); assert.equal(material.transparent, false);
  material.dispose();
});

test('grid toggling updates compiled terrain uniforms without scene geometry or material recompilation', () => {
  for (const initial of [true, false]) {
    const material = new MeshStandardMaterial(), view = Object.create(PlanetPreviewScene.prototype);
    view.land = new Group(); view.buildGrid = blendBuildGrid(material, { visible: initial });
    const compiled = shader(); material.onBeforeCompile(compiled); const version = material.version;
    assert.equal(compiled.uniforms.buildGridEnabled.value, Number(initial));
    for (const visible of [false, true, false, true]) {
      view.dirty = false; view.setGrid(visible);
      assert.equal(view.gridVisible, visible); assert.equal(view.dirty, true);
      assert.equal(compiled.uniforms.buildGridEnabled.value, Number(visible));
      assert.equal(material.version, version); assert.equal(view.land.children.length, 0);
    }
    material.dispose();
  }
});
