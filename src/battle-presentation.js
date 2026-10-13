import * as THREE from 'three';
import { OutputShader } from 'three/addons/shaders/OutputShader.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const vertex = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';

// One bounded, low-resolution glow buffer, with two separable blur passes.
// Lighting is kept linear until the final ACES/sRGB output conversion.
export class BattlePresentation {
  constructor(renderer) {
    this.renderer = renderer;
    const floating = renderer.extensions.has('EXT_color_buffer_float');
    this.sceneTarget = new THREE.WebGLRenderTarget(1, 1, { type: floating ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 2 });
    this.glowA = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.glowB = this.glowA.clone();
    this.extract = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { image: { value: null }, texel: { value: new THREE.Vector2() }, threshold: { value: floating ? 1.25 : .75 } }, vertexShader: vertex,
      fragmentShader: `varying vec2 vUv;uniform sampler2D image;uniform vec2 texel;uniform float threshold;
      vec3 bright(vec2 uv){vec3 c=texture2D(image,uv).rgb;float l=max(c.r,max(c.g,c.b));return c*max(0.,l-threshold)/max(l,.001);}
      void main(){vec3 c=bright(vUv)*.4;c+=bright(vUv+texel)*.15;c+=bright(vUv-texel)*.15;c+=bright(vUv+vec2(texel.x,-texel.y))*.15;c+=bright(vUv+vec2(-texel.x,texel.y))*.15;gl_FragColor=vec4(c,1.);}` });
    this.blur = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { image: { value: null }, direction: { value: new THREE.Vector2() } }, vertexShader: vertex,
      fragmentShader: `varying vec2 vUv;uniform sampler2D image;uniform vec2 direction;
      void main(){vec3 c=texture2D(image,vUv).rgb*.227027;c+=(texture2D(image,vUv+direction*1.384615).rgb+texture2D(image,vUv-direction*1.384615).rgb)*.316216;c+=(texture2D(image,vUv+direction*3.230769).rgb+texture2D(image,vUv-direction*3.230769).rgb)*.070270;gl_FragColor=vec4(c,1.);}` });
    this.output = new THREE.RawShaderMaterial({ depthTest: false, depthWrite: false,
      defines: { ACES_FILMIC_TONE_MAPPING: '', SRGB_TRANSFER: '' },
      uniforms: { tDiffuse: { value: null }, glow: { value: null }, toneMappingExposure: { value: 1 } },
      vertexShader: OutputShader.vertexShader,
      fragmentShader: OutputShader.fragmentShader.replace('uniform sampler2D tDiffuse;', 'uniform sampler2D tDiffuse;uniform sampler2D glow;')
        .replace('gl_FragColor = texture2D( tDiffuse, vUv );', `gl_FragColor=texture2D(tDiffuse,vUv);gl_FragColor.rgb+=texture2D(glow,vUv).rgb*.65;
          vec2 edge=vUv-.5;gl_FragColor.rgb*=1.-smoothstep(.18,.68,length(edge))*.16;`) });
    this.quad = new FullScreenQuad(this.extract);
  }
  resize(width, height, ratio) {
    const w = Math.max(1, Math.round(width * ratio)), h = Math.max(1, Math.round(height * ratio));
    this.sceneTarget.setSize(w, h);
    this.glowWidth = Math.max(1, Math.min(512, Math.round(w / 3)));
    this.glowHeight = Math.max(1, Math.min(768, Math.round(h / 3)));
    this.glowA.setSize(this.glowWidth, this.glowHeight); this.glowB.setSize(this.glowWidth, this.glowHeight);
    this.extract.uniforms.texel.value.set(1 / w, 1 / h);
  }
  pass(material, target) { this.quad.material = material; this.renderer.setRenderTarget(target); this.quad.render(this.renderer); }
  render(scene, camera) {
    const r = this.renderer; r.info.reset(); r.info.autoReset = false;
    r.setRenderTarget(this.sceneTarget); r.render(scene, camera);
    this.extract.uniforms.image.value = this.sceneTarget.texture; this.pass(this.extract, this.glowA);
    this.blur.uniforms.image.value = this.glowA.texture; this.blur.uniforms.direction.value.set(1 / this.glowWidth, 0); this.pass(this.blur, this.glowB);
    this.blur.uniforms.image.value = this.glowB.texture; this.blur.uniforms.direction.value.set(0, 1 / this.glowHeight); this.pass(this.blur, this.glowA);
    this.output.uniforms.tDiffuse.value = this.sceneTarget.texture; this.output.uniforms.glow.value = this.glowA.texture;
    this.output.uniforms.toneMappingExposure.value = r.toneMappingExposure; this.pass(this.output, null);
  }
  dispose() {
    for (const target of [this.sceneTarget, this.glowA, this.glowB]) target.dispose();
    for (const material of [this.extract, this.blur, this.output]) material.dispose();
    this.quad.dispose();
  }
}

export function environment(renderer) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d'), gradient = context.createLinearGradient(0, 0, 0, 256);
  for (const [at, color] of [[0, '#b2c6e8'], [.25, '#455a81'], [.52, '#0b1326'], [.73, '#172c4c'], [1, '#0b1427']]) gradient.addColorStop(at, color);
  context.fillStyle = gradient; context.fillRect(0, 0, 512, 256);
  const sun = context.createRadialGradient(120, 72, 0, 120, 72, 48);
  sun.addColorStop(0, '#fff0d1'); sun.addColorStop(.25, '#e6d0a188'); sun.addColorStop(1, '#aabce600');
  context.fillStyle = sun; context.fillRect(0, 0, 512, 256);
  const texture = new THREE.CanvasTexture(canvas); texture.mapping = THREE.EquirectangularReflectionMapping; texture.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer), target = generator.fromEquirectangular(texture);
  generator.dispose(); texture.dispose(); return target;
}

export function panelNormalMap() {
  const width = 128, bytes = new Uint8Array(width * width * 4);
  for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
    const seamX = x % 32, seamY = y % 64, p = (y * width + x) * 4;
    bytes[p] = seamX === 0 ? 78 : seamX === 1 ? 176 : 128;
    bytes[p + 1] = seamY === 0 ? 76 : seamY === 1 ? 178 : 128;
    bytes[p + 2] = 250; bytes[p + 3] = 255;
  }
  const map = new THREE.DataTexture(bytes, width, width); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(2, 2);
  map.magFilter = THREE.LinearFilter; map.minFilter = THREE.LinearMipmapLinearFilter; map.generateMipmaps = true; map.needsUpdate = true; return map;
}
