import { GRID, SYSTEMS, BUILDINGS, FACTIONS } from './data.js';
import { terrainAt } from './state.js';

const COLORS = { ground: '#294341', rough: '#354f48', rock: '#3d504b', cliff: '#172c30', water: '#1b3c50' };
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export class MapRenderer {
  constructor(canvas, state, ui, tap) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.state = state; this.ui = ui; this.tap = tap;
    this.width = 1; this.height = 1; this.hits = []; this.pointers = new Map(); this.dragged = false; this.camera = { x: 0, y: 0, zoom: 1 }; this.lastView = '';
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas);
    canvas.addEventListener('pointerdown', e => this.pointerDown(e));
    canvas.addEventListener('pointermove', e => this.pointerMove(e));
    canvas.addEventListener('pointerup', e => this.pointerUp(e));
    canvas.addEventListener('pointercancel', e => this.pointerUp(e, true));
    canvas.addEventListener('wheel', e => { e.preventDefault(); this.zoomAt(Math.exp(-e.deltaY * .001), e.offsetX, e.offsetY); }, { passive: false });
  }
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width; this.height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(rect.width * dpr); this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.dpr = dpr;
  }
  resetCamera() { this.camera = { x: 0, y: 0, zoom: 1 }; }
  point(e) { const r = this.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  pointerDown(e) {
    this.canvas.setPointerCapture(e.pointerId);
    const p = this.point(e); this.pointers.set(e.pointerId, p); this.start = p; this.dragged = false;
    if (this.pointers.size === 2) { const [a, b] = [...this.pointers.values()]; this.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y); this.dragged = true; }
  }
  zoomAt(factor, x, y) {
    const old = this.camera.zoom, next = Math.max(.7, Math.min(2.8, old * factor));
    const cx = this.width / 2 + this.camera.x, cy = this.height / 2 + this.camera.y;
    this.camera.x += (x - cx) * (1 - next / old); this.camera.y += (y - cy) * (1 - next / old); this.camera.zoom = next;
    this.clampCamera();
  }
  clampCamera() { const maxX = this.width * this.camera.zoom * .55, maxY = this.height * this.camera.zoom * .6; this.camera.x = Math.max(-maxX, Math.min(maxX, this.camera.x)); this.camera.y = Math.max(-maxY, Math.min(maxY, this.camera.y)); }
  pointerMove(e) {
    if (!this.pointers.has(e.pointerId)) return;
    const p = this.point(e), previous = this.pointers.get(e.pointerId); this.pointers.set(e.pointerId, p);
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()], distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (this.pinchDistance) this.zoomAt(distance / this.pinchDistance, (a.x + b.x) / 2, (a.y + b.y) / 2);
      this.pinchDistance = distance; this.dragged = true;
    } else {
      if (Math.hypot(p.x - this.start.x, p.y - this.start.y) > 7) this.dragged = true;
      if (this.dragged) { this.camera.x += p.x - previous.x; this.camera.y += p.y - previous.y; this.clampCamera(); }
    }
  }
  pointerUp(e, cancelled = false) {
    const p = this.point(e), multi = this.pointers.size > 1;
    this.pointers.delete(e.pointerId);
    if (!cancelled && !this.dragged && !multi) {
      const hit = [...this.hits].reverse().find(h => h.kind === 'tile' ? p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h : Math.hypot(p.x - h.x, p.y - h.y) <= h.r);
      if (hit) this.tap(hit);
    }
    if (multi) this.dragged = true;
    this.pinchDistance = null;
  }
  render(time) {
    const key = `${this.ui.view}-${this.ui.view === 'planet' ? this.ui.planetId : this.ui.systemId}`;
    if (key !== this.lastView) { this.lastView = key; this.resetCamera(); }
    const ctx = this.ctx, w = this.width, h = this.height;
    if (w < 2 || h < 2) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h); this.hits = [];
    this.stars(ctx, w, h, time);
    if (this.ui.view === 'planet') this.surface(ctx, w, h, time);
    else if (this.ui.view === 'system') this.system(ctx, w, h, time);
    else this.galaxy(ctx, w, h, time);
  }
  stars(ctx, w, h, time) {
    const gradient = ctx.createLinearGradient(0, 0, w, h); gradient.addColorStop(0, '#101f29'); gradient.addColorStop(.55, '#0c1821'); gradient.addColorStop(1, '#102630'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
    const nebula = ctx.createRadialGradient(w * .8, h * .25, 0, w * .8, h * .25, w * .8); nebula.addColorStop(0, '#28525435'); nebula.addColorStop(1, '#28525400'); ctx.fillStyle = nebula; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 85; i++) {
      const x = ((i * 7919 + 43) % 1000) / 1000 * w, y = ((i * 3571 + 71) % 1000) / 1000 * h;
      ctx.globalAlpha = .2 + .3 * (Math.sin(time * .0003 + i) + 1) / 2; ctx.fillStyle = '#dbe9ee'; ctx.fillRect(x, y, i % 15 === 0 ? 2 : 1, i % 15 === 0 ? 2 : 1);
    }
    ctx.globalAlpha = 1;
  }
  surface(ctx, w, h, time) {
    const p = this.state.planets.find(p => p.id === this.ui.planetId);
    const size = Math.min((w - 28) / GRID.width, (h - 40) / GRID.height) * this.camera.zoom;
    const ox = w / 2 - GRID.width * size / 2 + this.camera.x, oy = h / 2 - GRID.height * size / 2 + this.camera.y;
    this.tileSize = size; this.origin = { x: ox, y: oy };
    const warm = p.kind === 'Vulkanisch' || p.kind === 'Industriewelt';
    ctx.fillStyle = '#00000025'; roundRect(ctx, ox - 6, oy - 6, GRID.width * size + 12, GRID.height * size + 12, 14); ctx.fill();
    for (let y = 0; y < GRID.height; y++) for (let x = 0; x < GRID.width; x++) {
      const terrain = terrainAt(p, x, y), px = ox + x * size, py = oy + y * size;
      ctx.fillStyle = warm && terrain === 'ground' ? '#51463e' : warm && terrain === 'rough' ? '#625245' : COLORS[terrain];
      roundRect(ctx, px + .7, py + .7, size - 1.4, size - 1.4, 2); ctx.fill();
      ctx.fillStyle = '#ffffff05'; ctx.fillRect(px + 2, py + 2, size - 4, 1);
      if (terrain === 'rough') { ctx.strokeStyle = '#adc0a71b'; ctx.beginPath(); ctx.moveTo(px + size * .3, py + size * .7); ctx.lineTo(px + size * .7, py + size * .35); ctx.stroke(); }
      if (terrain === 'rock') { ctx.fillStyle = warm ? '#978270' : '#6b7e72'; ctx.beginPath(); ctx.moveTo(px + size * .25, py + size * .65); ctx.lineTo(px + size * .42, py + size * .3); ctx.lineTo(px + size * .7, py + size * .55); ctx.lineTo(px + size * .65, py + size * .72); ctx.closePath(); ctx.fill(); }
      if (terrain === 'cliff') { ctx.strokeStyle = '#5e797c45'; ctx.beginPath(); ctx.moveTo(px, py + size * .65); ctx.lineTo(px + size * .6, py + size * .25); ctx.lineTo(px + size, py + size * .4); ctx.stroke(); }
      this.hits.push({ kind: 'tile', x: px, y: py, w: size, h: size, tx: x, ty: y });
    }
    const built = p.buildings.filter(b => b.remaining <= 0);
    ctx.strokeStyle = '#9dab925a'; ctx.lineWidth = Math.max(2, size * .11);
    for (const a of built) for (const b of built) if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1) {
      ctx.beginPath(); ctx.moveTo(ox + (a.x + .5) * size, oy + (a.y + .5) * size); ctx.lineTo(ox + (b.x + .5) * size, oy + (b.y + .5) * size); ctx.stroke();
    }
    for (const b of p.buildings) {
      const def = BUILDINGS[b.type], px = ox + b.x * size, py = oy + b.y * size;
      ctx.save(); ctx.shadowColor = '#00000070'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#111f25'; roundRect(ctx, px + size * .12, py + size * .15, size * .76, size * .7, 3); ctx.fill(); ctx.restore();
      ctx.fillStyle = b.remaining > 0 ? '#526266' : def.color; roundRect(ctx, px + size * .16, py + size * .1, size * .68, size * .56, 2); ctx.fill();
      if (b.type === 'solar') {
        ctx.fillStyle = '#254862'; ctx.fillRect(px + size * .23, py + size * .17, size * .54, size * .4);
        ctx.strokeStyle = '#789cc0'; ctx.lineWidth = .7;
        for (let j = 1; j < 3; j++) { ctx.beginPath(); ctx.moveTo(px + size * (.23 + .18 * j), py + size * .17); ctx.lineTo(px + size * (.23 + .18 * j), py + size * .57); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(px + size * .23, py + size * .37); ctx.lineTo(px + size * .77, py + size * .37); ctx.stroke();
      } else if (b.type === 'farm') {
        ctx.fillStyle = '#38553a'; for (let j = 0; j < 3; j++) { roundRect(ctx, px + size * .23, py + size * (.18 + j * .13), size * .54, size * .09, 2); ctx.fill(); }
      } else if (b.type === 'habitat') {
        ctx.fillStyle = '#3a5360'; ctx.fillRect(px + size * .28, py + size * .16, size * .44, size * .42);
        ctx.fillStyle = '#dfd9ae'; for (let i = 0; i < 4; i++) ctx.fillRect(px + size * (.33 + (i % 2) * .22), py + size * (.21 + Math.floor(i / 2) * .2), size * .09, size * .1);
      } else {
        ctx.fillStyle = '#22333b'; ctx.font = `600 ${Math.max(10, size * .37)}px system-ui`; ctx.textAlign = 'center'; ctx.fillText(def.glyph, px + size * .5, py + size * .51);
      }
      ctx.fillStyle = b.remaining > 0 ? '#d4b481' : b.enabled && b.status === 'aktiv' ? '#88d0bb' : '#e3a071';
      ctx.beginPath(); ctx.arc(px + size * .8, py + size * .79, Math.max(2, size * .06), 0, Math.PI * 2); ctx.fill();
      if (b.id === this.ui.selectedBuilding) { ctx.strokeStyle = '#b2e6db'; ctx.lineWidth = 2; roundRect(ctx, px + 1, py + 1, size - 2, size - 2, 3); ctx.stroke(); }
    }
    const tile = this.ui.buildTile;
    if (this.ui.buildType && tile) {
      const valid = !['water', 'cliff', 'void'].includes(terrainAt(p, tile.x, tile.y)) && !p.buildings.some(b => b.x === tile.x && b.y === tile.y);
      const px = ox + tile.x * size, py = oy + tile.y * size;
      ctx.fillStyle = valid ? '#80d4c650' : '#e58c8b60'; ctx.fillRect(px, py, size, size); ctx.strokeStyle = valid ? '#a7e5d8' : '#e58c8b'; ctx.lineWidth = 2; ctx.strokeRect(px + 1, py + 1, size - 2, size - 2);
    }
    if (this.ui.buildType) {
      ctx.strokeStyle = '#ccebdd15'; ctx.lineWidth = 1;
      for (let x = 0; x <= GRID.width; x++) { ctx.beginPath(); ctx.moveTo(ox + x * size, oy); ctx.lineTo(ox + x * size, oy + GRID.height * size); ctx.stroke(); }
    }
    if (p.owner) {
      ctx.fillStyle = '#c7d7d0'; ctx.font = '10px system-ui'; ctx.textAlign = 'left'; ctx.fillText('NORDSEKTOR', ox + 5, oy - 12);
      const pulse = .3 + .3 * Math.sin(time * .001); ctx.globalAlpha = pulse; ctx.fillStyle = '#83d7c6'; ctx.fillRect(ox + GRID.width * size - 26, oy - 17, 4, 4); ctx.globalAlpha = 1;
    }
  }
  planetBody(ctx, x, y, r, p, time) {
    const owner = p.owner ? FACTIONS[p.owner].color : '#879ca4';
    ctx.save();
    ctx.shadowColor = `${p.color}88`; ctx.shadowBlur = r * .5;
    const gradient = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .05, x + r * .25, y + r * .1, r * 1.2);
    gradient.addColorStop(0, '#d4e7dd'); gradient.addColorStop(.2, p.color); gradient.addColorStop(1, '#0a151d'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = '#153f4240'; ctx.lineWidth = r * .18;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x + r * .08, y - r * .45 + i * r * .4, r * .94, r * .23, -.3, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#ffffff25'; ctx.beginPath(); ctx.ellipse(x - r * .2, y - r * .28, r * .45, r * .12, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = p.id === this.ui.planetId ? '#b7e5dc' : `${owner}80`; ctx.lineWidth = p.id === this.ui.planetId ? 1.8 : 1; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = owner; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.name, x, y + r + 24);
    if (p.owner === 'player') { ctx.fillStyle = '#89d5c4'; ctx.beginPath(); ctx.arc(x, y - r - 12, 2, 0, Math.PI * 2); ctx.fill(); }
    this.hits.push({ kind: 'planet', x, y, r: Math.max(25, r + 7), id: p.id });
  }
  system(ctx, w, h, time) {
    const system = SYSTEMS.find(s => s.id === this.ui.systemId), planets = this.state.planets.filter(p => p.system === system.id);
    const cx = w / 2 + this.camera.x, cy = h * .43 + this.camera.y, zoom = this.camera.zoom;
    const orbitRadius = Math.min(w * .38, h * .28) * zoom;
    for (let i = 0; i < planets.length; i++) {
      ctx.strokeStyle = '#94b6c415'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, orbitRadius * (.6 + i * .4), orbitRadius * (.85 + i * .42), -.2, 0, Math.PI * 2); ctx.stroke();
    }
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 78 * zoom); glow.addColorStop(0, `${system.color}65`); glow.addColorStop(1, `${system.color}00`); ctx.fillStyle = glow; ctx.fillRect(cx - 78 * zoom, cy - 78 * zoom, 156 * zoom, 156 * zoom);
    ctx.shadowColor = system.color; ctx.shadowBlur = 20; ctx.fillStyle = system.color; ctx.beginPath(); ctx.arc(cx, cy, 14 * zoom, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ddc99e'; ctx.font = '10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(system.name.toUpperCase(), cx, cy + 33 * zoom);
    const positions = [ [-.9, -.65], [.82, .35], [-.37, 1.6] ];
    for (let i = 0; i < planets.length; i++) {
      const [dx, dy] = positions[i], x = cx + dx * orbitRadius, y = cy + dy * orbitRadius;
      this.planetBody(ctx, x, y, 20 * zoom, planets[i], time);
    }
    this.drawMissions(ctx, planets, cx, cy, orbitRadius, positions, zoom);
  }
  drawMissions(ctx, planets, cx, cy, r, positions, zoom) {
    for (const f of this.state.fleets) {
      const index = planets.findIndex(p => p.id === f.planetId);
      if (index < 0) continue;
      const [dx, dy] = positions[index], x = cx + dx * r + 33 * zoom, y = cy + dy * r - 24 * zoom;
      ctx.strokeStyle = '#8ad4ca'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x - 4, y + 5); ctx.lineTo(x + 4, y + 5); ctx.closePath(); ctx.stroke();
      if (f.mission) {
        const to = planets.findIndex(p => p.id === f.mission.target);
        if (to < 0) continue;
        const a = positions[index], b = positions[to];
        ctx.strokeStyle = '#8ad4ca50'; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(cx + a[0] * r, cy + a[1] * r); ctx.lineTo(cx + b[0] * r, cy + b[1] * r); ctx.stroke(); ctx.setLineDash([]);
        const progress = 1 - f.mission.remaining / f.mission.total;
        ctx.fillStyle = '#a4e0d0'; ctx.beginPath(); ctx.arc(cx + (a[0] + (b[0] - a[0]) * progress) * r, cy + (a[1] + (b[1] - a[1]) * progress) * r, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  galaxy(ctx, w, h, time) {
    const points = SYSTEMS.map(s => ({ ...s, px: w / 2 + w * (s.x - .5) * this.camera.zoom + this.camera.x, py: h / 2 + h * (s.y - .5) * this.camera.zoom + this.camera.y }));
    ctx.strokeStyle = '#85b3c329'; ctx.setLineDash([2, 7]);
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) { ctx.beginPath(); ctx.moveTo(points[i].px, points[i].py); ctx.lineTo(points[j].px, points[j].py); ctx.stroke(); }
    ctx.setLineDash([]);
    for (const s of points) {
      const glow = ctx.createRadialGradient(s.px, s.py, 0, s.px, s.py, 60); glow.addColorStop(0, `${s.color}45`); glow.addColorStop(1, `${s.color}00`); ctx.fillStyle = glow; ctx.fillRect(s.px - 60, s.py - 60, 120, 120);
      ctx.strokeStyle = '#75969e45'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(s.px, s.py, 27, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.px, s.py, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d4dfdc'; ctx.font = '600 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText(s.name, s.px, s.py + 48);
      const planets = this.state.planets.filter(p => p.system === s.id); const count = planets.filter(p => p.owner === 'player').length;
      ctx.font = '10px system-ui'; ctx.fillStyle = '#809b9e'; ctx.fillText(`${planets.length} Planeten${count ? ` · ${count} eigene` : ''}`, s.px, s.py + 65);
      this.hits.push({ kind: 'system', x: s.px, y: s.py, r: 32, id: s.id });
    }
  }
}
