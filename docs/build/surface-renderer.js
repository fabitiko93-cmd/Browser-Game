import { GRID } from './data.js';
import { planetSurface, surfaceConnections, placementIssue } from './surface.js';
import { paintBuilding } from './surface-buildings.js';

const UNIT = 64;
const COLORS = { ground: '#26344c', rough: '#31415b', rock: '#414660', cliff: '#10182d', water: '#142d54' };
const canvasFactory = () => typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(1, 1) : document.createElement('canvas');
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function paintTerrain(ctx, planet, displaySize) {
  const unit = UNIT / displaySize, warm = planet.kind === 'Vulkanisch' || planet.kind === 'Industriewelt';
  ctx.lineWidth = unit;
  for (const { x, y, terrain, ore, vent } of planetSurface(planet).tiles) {
    const px = x * UNIT, py = y * UNIT;
    ctx.fillStyle = ore ? ore === .35 ? '#3a6672' : '#304c55' : vent ? '#695039' : warm && terrain === 'ground' ? '#51463e' : warm && terrain === 'rough' ? '#625245' : COLORS[terrain];
    roundRect(ctx, px + .7 * unit, py + .7 * unit, UNIT - 1.4 * unit, UNIT - 1.4 * unit, 2 * unit); ctx.fill();
    ctx.fillStyle = '#ffffff05'; ctx.fillRect(px + 2 * unit, py + 2 * unit, UNIT - 4 * unit, unit);
    if (terrain === 'rough' && !ore && !vent) { ctx.strokeStyle = '#adc0a71b'; ctx.beginPath(); ctx.moveTo(px + UNIT * .3, py + UNIT * .7); ctx.lineTo(px + UNIT * .7, py + UNIT * .35); ctx.stroke(); }
    // Reuse the existing stone silhouette; rich cores have a brighter tint.
    if (ore || terrain === 'rock' && !vent) { ctx.fillStyle = ore ? ore === .35 ? '#b0d5d8' : '#74a0a8' : warm ? '#978270' : '#6b7e72'; ctx.beginPath(); ctx.moveTo(px + UNIT * .25, py + UNIT * .65); ctx.lineTo(px + UNIT * .42, py + UNIT * .3); ctx.lineTo(px + UNIT * .7, py + UNIT * .55); ctx.lineTo(px + UNIT * .65, py + UNIT * .72); ctx.closePath(); ctx.fill(); }
    // The original short terrain stroke, repeated to distinguish thermal sites.
    if (vent) {
      ctx.strokeStyle = '#e3b073'; ctx.lineWidth = 1.5 * unit;
      for (const offset of [-.17, 0, .17]) { ctx.beginPath(); ctx.moveTo(px + UNIT * (.35 + offset), py + UNIT * .7); ctx.lineTo(px + UNIT * (.65 + offset), py + UNIT * .35); ctx.stroke(); }
      ctx.lineWidth = unit;
    }
    if (terrain === 'cliff') { ctx.strokeStyle = '#5e797c45'; ctx.beginPath(); ctx.moveTo(px, py + UNIT * .65); ctx.lineTo(px + UNIT * .6, py + UNIT * .25); ctx.lineTo(px + UNIT, py + UNIT * .4); ctx.stroke(); }
  }
}
export class SurfaceRenderer {
  constructor(createCanvas = canvasFactory) { this.createCanvas = createCanvas; this.terrainCache = new Map(); this.buildingCache = new Map(); this.networkKey = ''; this.links = []; }
  terrain(planet, size) {
    const key = `${planet.seed}:${planet.kind}:${size.toFixed(1)}`;
    if (!this.terrainCache.has(key)) {
      const canvas = this.createCanvas(); canvas.width = GRID.width * UNIT; canvas.height = GRID.height * UNIT;
      paintTerrain(canvas.getContext('2d'), planet, size);
      if (this.terrainCache.size >= 3) this.terrainCache.delete(this.terrainCache.keys().next().value);
      this.terrainCache.set(key, canvas);
    }
    return this.terrainCache.get(key);
  }
  buildingImage(building, size) {
    const key = `${building.type}:${building.remaining > 0}:${building.enabled}:${building.status === 'aktiv'}:${size.toFixed(1)}`;
    if (!this.buildingCache.has(key)) {
      // Padding preserves the original shadow outside the building's tile.
      const canvas = this.createCanvas(); canvas.width = 192; canvas.height = 192;
      const ctx = canvas.getContext('2d'); ctx.translate(32, 32); ctx.scale(1.28, 1.28); paintBuilding(ctx, building, 100, size);
      if (this.buildingCache.size >= 80) this.buildingCache.delete(this.buildingCache.keys().next().value);
      this.buildingCache.set(key, canvas);
    }
    return this.buildingCache.get(key);
  }
  render(ctx, planet, ui, { x, y, size }) {
    const width = GRID.width * size, height = GRID.height * size;
    ctx.fillStyle = '#00000025'; roundRect(ctx, x - 6, y - 6, width + 12, height + 12, 14); ctx.fill();
    ctx.drawImage(this.terrain(planet, size), x, y, width, height);
    ctx.save(); ctx.translate(x, y);
    const key = `${planet.id}:` + planet.buildings.filter(b => b.remaining <= 0).map(b => `${b.x},${b.y}`).sort().join(';');
    if (this.networkKey !== key) { this.networkKey = key; this.links = surfaceConnections(planet.buildings); }
    // Keep the automatic network, drawn with the previous connector style.
    ctx.strokeStyle = '#9dab925a'; ctx.lineWidth = Math.max(2, size * .11);
    for (const { from, to } of this.links) {
      ctx.beginPath(); ctx.moveTo((from.x + .5) * size, (from.y + .5) * size); ctx.lineTo((to.x + .5) * size, (to.y + .5) * size); ctx.stroke();
    }
    for (const b of planet.buildings) {
      ctx.drawImage(this.buildingImage(b, size), (b.x - .25) * size, (b.y - .25) * size, size * 1.5, size * 1.5);
      if (ui.panel === 'building' && b.id === ui.selectedBuilding) this.selection(ctx, b.x * size, b.y * size, size);
    }
    if (ui.buildType && ui.buildTile) {
      const tile = ui.buildTile, valid = !placementIssue(planet, tile.x, tile.y), px = tile.x * size, py = tile.y * size;
      ctx.fillStyle = valid ? '#89aaff1c' : '#e58c8b40'; ctx.fillRect(px, py, size, size);
      ctx.strokeStyle = valid ? '#c0cfff' : '#e58c8b'; ctx.lineWidth = 2; ctx.strokeRect(px + 1, py + 1, size - 2, size - 2);
    } else if (ui.panel === 'terrain' && ui.surfaceTile) this.selection(ctx, ui.surfaceTile.x * size, ui.surfaceTile.y * size, size);
    if (ui.buildType) {
      ctx.strokeStyle = '#aabaff1c'; ctx.lineWidth = 1;
      for (let tx = 0; tx <= GRID.width; tx++) { ctx.beginPath(); ctx.moveTo(tx * size, 0); ctx.lineTo(tx * size, height); ctx.stroke(); }
    }
    ctx.restore();
  }
  selection(ctx, x, y, size) {
    ctx.strokeStyle = '#c3d1ff'; ctx.lineWidth = 2; roundRect(ctx, x + 1, y + 1, size - 2, size - 2, 3); ctx.stroke();
  }
}
