import { GRID } from './data.js';
import { planetSurface, surfaceRandom, surfaceNoise, surfaceConnections, placementIssue, siteBonus } from './surface.js';
import { paintBuilding } from './surface-buildings.js';

const UNIT = 64, TAU = Math.PI * 2;
const PALETTES = {
  rock: { low: [23, 33, 51], high: [82, 99, 119], ridge: '#a3b6cc', shadow: '#0b172b', crack: '#112238' },
  ice: { low: [24, 58, 83], high: [151, 202, 215], ridge: '#c8e8ef', shadow: '#173451', crack: '#173f5c' },
  volcanic: { low: [21, 20, 33], high: [77, 66, 87], ridge: '#a09aaf', shadow: '#100c1c', crack: '#271621' }
};
const canvasFactory = () => typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(1, 1) : document.createElement('canvas');
function path(c, points, color, width) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke();
}
function oval(c, x, y, rx, ry, color, stroke = null) {
  c.beginPath(); c.ellipse(x, y, rx, ry, -.23, 0, TAU); c.fillStyle = color; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.stroke(); }
}
function fault(seed, index) {
  const points = [], base = 1.2 + surfaceRandom(seed, index, 0, 33) * 9.6;
  for (let y = -.2; y <= GRID.height + .3; y += .7) points.push([base + Math.sin(y * .73 + index) * .55 + (surfaceNoise(seed, index, y, 199) - .5) * .8, y]);
  return points;
}
function paintLand(c, planet, surface) {
  const w = GRID.width * UNIT, h = GRID.height * UNIT, palette = PALETTES[surface.kind];
  const stride = 8, nx = Math.ceil(w / stride) + 1, ny = Math.ceil(h / stride) + 1, field = new Float32Array(nx * ny);
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) field[y * nx + x] = .7 * surfaceNoise(planet.seed, x / 22, y / 22, 19) + .3 * surfaceNoise(planet.seed, x / 5, y / 5, 55);
  const image = c.createImageData(w, h), pixels = image.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ix = Math.floor(x / stride), iy = Math.floor(y / stride), fx = x % stride / stride, fy = y % stride / stride;
    const a = field[iy * nx + ix], b = field[iy * nx + ix + 1], d = field[(iy + 1) * nx + ix], e = field[(iy + 1) * nx + ix + 1];
    const height = (a + (b - a) * fx) * (1 - fy) + (d + (e - d) * fx) * fy;
    const grain = surfaceRandom(planet.seed, x, y, 49) * 8 - 4, light = ((a - b) + (a - d)) * 80;
    const i = (y * w + x) * 4;
    for (let k = 0; k < 3; k++) pixels[i + k] = palette.low[k] + (palette.high[k] - palette.low[k]) * height + grain + light;
    pixels[i + 3] = 255;
  }
  c.putImageData(image, 0, 0);
  c.save(); c.scale(UNIT, UNIT);
  // Long fractures and broad relief make a continuous landscape, independent of the grid.
  for (let i = 0; i < 3; i++) {
    const points = fault(planet.seed, i);
    path(c, points.map(([x, y]) => [x + .07, y]), `${palette.ridge}40`, surface.kind === 'ice' ? .1 : .04);
    path(c, points, `${palette.crack}90`, surface.kind === 'ice' ? .07 : .04);
    if (surface.kind === 'ice') for (let j = 3; j < points.length; j += 5) {
      const [x, y] = points[j], side = j % 2 ? 1 : -1;
      path(c, [[x, y], [x + side * .35, y - .3], [x + side * .8, y - .55]], '#ceeaf040', .035);
      path(c, [[x, y], [x + side * .35, y - .28], [x + side * .8, y - .52]], '#1a456470', .018);
    }
  }
  if (surface.kind !== 'ice') for (let i = 0; i < 4; i++) {
    const x = 1.8 + surfaceRandom(planet.seed, i, 1, 60) * 8.4, y = .8 + surfaceRandom(planet.seed, i, 2, 61) * 12.2;
    const r = .5 + surfaceRandom(planet.seed, i, 3, 62) * .9;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, '#0d17296c'); g.addColorStop(.67, '#0d172930'); g.addColorStop(.84, `${palette.ridge}40`); g.addColorStop(1, `${palette.ridge}00`);
    oval(c, x, y, r, r * .68, g); c.lineWidth = .035; c.strokeStyle = `${palette.ridge}30`;
    c.beginPath(); c.ellipse(x - .03, y - .02, r * .83, r * .56, -.23, Math.PI * .92, Math.PI * 1.85); c.stroke();
  }
  for (const tile of surface.tiles) {
    const { x, y, terrain } = tile;
    if (terrain === 'water') {
      c.fillStyle = '#122b46'; c.fillRect(x, y, 1, 1);
      for (let i = 0; i < 3; i++) path(c, [[x + .05, y + .2 + i * .25], [x + .4, y + .18 + i * .25], [x + .8, y + .23 + i * .25]], '#74b6d82a', .025);
    } else if (terrain === 'cliff') {
      c.fillStyle = `${palette.shadow}45`; c.fillRect(x, y, 1, 1);
    } else if (terrain === 'rock' || terrain === 'rough') {
      for (let i = 0; i < (terrain === 'rock' ? 3 : 1); i++) {
        const px = x + .12 + surfaceRandom(planet.seed, x * 3 + i, y, 18) * .7, py = y + .12 + surfaceRandom(planet.seed, x, y * 3 + i, 42) * .7;
        const radius = .035 + surfaceRandom(planet.seed, x + i, y, 82) * .08;
        oval(c, px + .035, py + .045, radius * 1.2, radius * .65, '#080e1e55');
        c.beginPath(); c.moveTo(px - radius, py); c.lineTo(px - radius * .25, py - radius * .8); c.lineTo(px + radius * .8, py - radius * .2); c.lineTo(px + radius, py + radius * .45); c.lineTo(px, py + radius * .7); c.closePath(); c.fillStyle = `${palette.ridge}65`; c.fill();
      }
    }
  }
  if (planet.kind !== 'Ozeanisch') for (const [rx, ry, rh] of [[0, 8, 6], [10, 0, 4]]) {
    c.save(); c.beginPath(); c.rect(rx, ry, 2, rh); c.clip();
    for (let j = 0; j < 3; j++) {
      const points = [];
      for (let sy = ry - .3; sy <= ry + rh + .3; sy += .28) points.push([rx + .28 + j * .58 + (surfaceNoise(planet.seed, sy * 3, j, 170) - .5) * .7, sy]);
      path(c, points.map(([x, y]) => [x + .1, y + .02]), `${palette.shadow}a0`, .24);
      path(c, points, `${palette.ridge}68`, .07);
      path(c, points.map(([x, y]) => [x + .025, y]), `${palette.ridge}24`, .18);
    }
    c.restore();
  }
  for (const tile of surface.tiles) {
    if (tile.ore) {
      const x = tile.x, y = tile.y;
      c.save(); c.translate(x + .5, y + .5); c.rotate(surfaceRandom(planet.seed, x, y, 240) * TAU);
      const points = [[-.38, .2], [-.16, -.06], [.09, .02], [.28, -.29]];
      path(c, points, '#21233490', .09); path(c, points, '#cfb798b0', .032);
      for (let i = 0; i < 4; i++) oval(c, -.25 + i * .16, Math.sin(i * 2) * .14, .025 + i * .01, .035, '#d3bc97', '#746c6e');
      c.restore();
    }
    if (tile.vent) {
      const x = tile.x + .5, y = tile.y + .5;
      const g = c.createRadialGradient(x, y, .04, x, y, .48);
      g.addColorStop(0, '#ffb57380'); g.addColorStop(.45, '#f69f6220'); g.addColorStop(1, '#f69f6200');
      oval(c, x, y, .48, .4, g); oval(c, x, y, .24, .16, '#221c27', '#b48e72'); oval(c, x, y, .13, .09, '#f6b783');
      if (surface.kind === 'volcanic') {
        const points = [[x, y], [x + .2, y + .6], [x - .07, y + 1], [x + .3, y + 1.55], [x + .2, y + 2.1]];
        path(c, points, '#f47c5325', .3); path(c, points, '#862f36', .12); path(c, points, '#f6a778', .035);
      }
    }
  }
  c.restore();
}
function marker(c, tile, unit, relevant = false) {
  const x = (tile.x + .5) * unit, y = (tile.y + .5) * unit;
  c.save(); c.translate(x, y); c.scale(unit / 100, unit / 100);
  if (relevant) { c.strokeStyle = '#d6c1a3b0'; c.lineWidth = 3; c.beginPath(); c.roundRect(-43, -43, 86, 86, 9); c.stroke(); }
  c.fillStyle = '#0e172cdd'; c.strokeStyle = tile.vent ? '#ffc192' : '#dec7a3'; c.lineWidth = 3;
  c.beginPath(); c.arc(25, -25, 12, 0, TAU); c.fill();
  if (tile.vent) {
    for (let i = 0; i < 3; i++) path(c, [[18 + i * 7, -19], [16 + i * 7, -25], [18 + i * 7, -32]], '#ffc192', 2);
  } else { c.beginPath(); c.moveTo(25, -33); c.lineTo(32, -25); c.lineTo(25, -17); c.lineTo(18, -25); c.closePath(); c.stroke(); }
  c.restore();
}
export class SurfaceRenderer {
  constructor(createCanvas = canvasFactory) { this.createCanvas = createCanvas; this.terrainCache = new Map(); this.buildingCache = new Map(); this.networkKey = ''; this.links = []; }
  buildingImage(building) {
    const key = `${building.type}:${building.remaining}:${building.enabled}:${building.status === 'aktiv'}`;
    if (!this.buildingCache.has(key)) {
      const canvas = this.createCanvas(); canvas.width = 128; canvas.height = 128;
      const c = canvas.getContext('2d'); c.scale(1.28, 1.28); paintBuilding(c, building);
      if (this.buildingCache.size >= 80) this.buildingCache.delete(this.buildingCache.keys().next().value);
      this.buildingCache.set(key, canvas);
    }
    return this.buildingCache.get(key);
  }
  terrain(planet) {
    const key = `${planet.seed}:${planet.kind}`;
    if (!this.terrainCache.has(key)) {
      const canvas = this.createCanvas(); canvas.width = GRID.width * UNIT; canvas.height = GRID.height * UNIT;
      paintLand(canvas.getContext('2d'), planet, planetSurface(planet));
      if (this.terrainCache.size >= 3) this.terrainCache.delete(this.terrainCache.keys().next().value);
      this.terrainCache.set(key, canvas);
    }
    return this.terrainCache.get(key);
  }
  render(c, planet, ui, { x, y, size }, time) {
    const surface = planetSurface(planet), width = GRID.width * size, height = GRID.height * size;
    c.save(); c.beginPath(); c.roundRect(x, y, width, height, 9); c.clip();
    c.drawImage(this.terrain(planet), x, y, width, height);
    c.translate(x, y);
    const key = `${planet.id}:` + planet.buildings.filter(b => b.remaining <= 0).map(b => `${b.x},${b.y}`).sort().join(';');
    if (this.networkKey !== key) { this.networkKey = key; this.links = surfaceConnections(planet.buildings); }
    for (let i = 0; i < this.links.length; i++) {
      const { from, to } = this.links[i], a = [(from.x + .5) * size, (from.y + .5) * size], b = [(to.x + .5) * size, (to.y + .5) * size];
      path(c, [a, b], '#0c152960', Math.max(2, size * .1)); path(c, [a, b], '#b6c8e34a', Math.max(.7, size * .035));
      if (i % 4 === 0 && time && ui.speed) {
        const phase = ((time * .00009 + i * .31) % 1);
        c.fillStyle = '#bee7f3'; c.beginPath(); c.arc(a[0] + (b[0] - a[0]) * phase, a[1] + (b[1] - a[1]) * phase, Math.max(1, size * .04), 0, TAU); c.fill();
      }
    }
    const occupied = new Set(planet.buildings.map(b => `${b.x},${b.y}`));
    for (const tile of surface.tiles) if ((tile.ore >= .35 || tile.vent || ui.buildType && siteBonus(planet, ui.buildType, tile.x, tile.y)) && !occupied.has(`${tile.x},${tile.y}`)) marker(c, tile, size, Boolean(ui.buildType && siteBonus(planet, ui.buildType, tile.x, tile.y)));
    if (ui.buildType) {
      c.lineWidth = .7; c.strokeStyle = '#c3d8ff23'; c.beginPath();
      for (let tx = 0; tx <= GRID.width; tx++) { c.moveTo(tx * size, 0); c.lineTo(tx * size, height); }
      for (let ty = 0; ty <= GRID.height; ty++) { c.moveTo(0, ty * size); c.lineTo(width, ty * size); }
      c.stroke();
    }
    for (const building of planet.buildings) {
      c.drawImage(this.buildingImage(building), building.x * size, building.y * size, size, size);
      if (ui.panel === 'building' && building.id === ui.selectedBuilding) this.selection(c, building.x * size, building.y * size, size, '#d8e7ff');
    }
    if (ui.buildType && ui.buildTile) {
      const tile = ui.buildTile, valid = !placementIssue(planet, tile.x, tile.y);
      c.fillStyle = valid ? '#abc9ff28' : '#ff879f45'; c.fillRect(tile.x * size, tile.y * size, size, size);
      if (valid) { c.save(); c.globalAlpha = .6; c.drawImage(this.buildingImage({ type: ui.buildType, remaining: 0, enabled: true, status: 'aktiv' }), tile.x * size, tile.y * size, size, size); c.restore(); }
      this.selection(c, tile.x * size, tile.y * size, size, valid ? '#d8e7ff' : '#ff99a9');
    } else if (ui.panel === 'terrain' && ui.surfaceTile) this.selection(c, ui.surfaceTile.x * size, ui.surfaceTile.y * size, size, '#d8e7ff');
    c.restore();
    c.strokeStyle = '#a8bddc35'; c.lineWidth = 1; c.beginPath(); c.roundRect(x, y, width, height, 9); c.stroke();
  }
  selection(c, x, y, size, color) {
    c.strokeStyle = color; c.lineWidth = 1.7;
    const inset = 1.5, length = Math.max(4, size * .22); c.beginPath();
    for (const [a, b, sx, sy] of [[x + inset, y + inset, 1, 1], [x + size - inset, y + inset, -1, 1], [x + inset, y + size - inset, 1, -1], [x + size - inset, y + size - inset, -1, -1]]) {
      c.moveTo(a + sx * length, b); c.lineTo(a, b); c.lineTo(a, b + sy * length);
    }
    c.stroke();
  }
}
