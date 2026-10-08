import { GRID, SYSTEMS, FACTIONS } from './data.js';
import { SurfaceRenderer } from './surface-renderer.js';

export class MapRenderer {
  constructor(canvas, state, ui, tap) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.state = state; this.ui = ui; this.tap = tap;
    this.width = 1; this.height = 1; this.hits = []; this.pointers = new Map(); this.dragged = false; this.camera = { x: 0, y: 0, zoom: 1 }; this.lastView = ''; this.surfaceRenderer = new SurfaceRenderer();
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
  resetCamera() { this.camera = { x: 0, y: 0, zoom: 1 }; this.surfaceFocusKey = ''; }
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
    const gradient = ctx.createLinearGradient(0, 0, w, h); gradient.addColorStop(0, '#090d20'); gradient.addColorStop(.55, '#08091a'); gradient.addColorStop(1, '#13132c'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
    const nebula = ctx.createRadialGradient(w * .8, h * .25, 0, w * .8, h * .25, w * .8); nebula.addColorStop(0, '#57328835'); nebula.addColorStop(1, '#57328800'); ctx.fillStyle = nebula; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 85; i++) {
      const x = ((i * 7919 + 43) % 1000) / 1000 * w, y = ((i * 3571 + 71) % 1000) / 1000 * h;
      ctx.globalAlpha = .2 + .3 * (Math.sin(time * .0003 + i) + 1) / 2; ctx.fillStyle = '#dfe7ff'; ctx.fillRect(x, y, i % 15 === 0 ? 2 : 1, i % 15 === 0 ? 2 : 1);
    }
    ctx.globalAlpha = 1;
  }
  surface(ctx, w, h, time) {
    const p = this.state.planets.find(p => p.id === this.ui.planetId);
    if (p.destroyed) { ctx.fillStyle = '#c8a7c7'; ctx.font = '18px system-ui'; ctx.textAlign = 'center'; ctx.fillText('TRÜMMERFELD', w / 2, h / 2); return; }
    const footer = this.ui.buildType ? 146 : this.ui.hints && p.owner === 'player' && !this.ui.panel ? 78 : 34;
    const available = Math.max(100, h - 84 - footer);
    const size = Math.min((w - 24) / GRID.width, Math.max(24, available / GRID.height)) * this.camera.zoom;
    let ox = w / 2 - GRID.width * size / 2 + this.camera.x;
    let oy = 84 + available / 2 - GRID.height * size / 2 + this.camera.y;
    const tile = this.ui.buildType && this.ui.buildTile, focusKey = tile ? `${p.id}:${this.ui.buildType}:${tile.x},${tile.y}` : '';
    if (focusKey && focusKey !== this.surfaceFocusKey) {
      const px = ox + (tile.x + .5) * size, py = oy + (tile.y + .5) * size;
      const dx = Math.max(12 + size / 2, Math.min(w - 12 - size / 2, px)) - px;
      const dy = Math.max(84 + size / 2, Math.min(84 + available - size / 2, py)) - py;
      this.camera.x += dx; this.camera.y += dy; ox += dx; oy += dy;
    }
    this.surfaceFocusKey = focusKey;
    this.tileSize = size; this.origin = { x: ox, y: oy };
    ctx.save(); ctx.beginPath(); ctx.rect(0, 84, w, available); ctx.clip();
    this.surfaceRenderer.render(ctx, p, this.ui, { x: ox, y: oy, size }, time); ctx.restore();
    for (let y = 0; y < GRID.height; y++) for (let x = 0; x < GRID.width; x++) {
      const px = Math.max(0, ox + x * size), py = Math.max(84, oy + y * size);
      const right = Math.min(w, ox + (x + 1) * size), bottom = Math.min(84 + available, oy + (y + 1) * size);
      if (right > px && bottom > py) this.hits.push({ kind: 'tile', x: px, y: py, w: right - px, h: bottom - py, tx: x, ty: y });
    }
    if (p.owner && oy >= 100) {
      ctx.fillStyle = '#c7d3f2'; ctx.font = '10px system-ui'; ctx.textAlign = 'left'; ctx.fillText('NORDSEKTOR', ox + 5, oy - 12);
      ctx.globalAlpha = .3 + .3 * Math.sin(time * .001); ctx.fillStyle = '#aeacff'; ctx.fillRect(ox + GRID.width * size - 26, oy - 17, 4, 4); ctx.globalAlpha = 1;
    }
  }
  planetBody(ctx, x, y, r, p, time) {
    if (p.destroyed) { ctx.fillStyle = '#806d89'; for(let i=0;i<9;i++) ctx.fillRect(x+Math.cos(i*2.4)*r,y+Math.sin(i*2.4)*r,4,4); ctx.font='11px system-ui'; ctx.textAlign='center'; ctx.fillText(`${p.name} · zerstört`,x,y+r+24); this.hits.push({kind:'planet',x,y,r:25,id:p.id}); return; }
    if (p.shield > 0) { ctx.strokeStyle='#7abbff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,r+10,0,Math.PI*2); ctx.stroke(); }
    const owner = p.owner ? FACTIONS[p.owner].color : '#879ca4';
    ctx.save();
    ctx.shadowColor = `${p.color}88`; ctx.shadowBlur = r * .5;
    const gradient = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .05, x + r * .25, y + r * .1, r * 1.2);
    gradient.addColorStop(0, '#e0e6ff'); gradient.addColorStop(.2, p.color); gradient.addColorStop(1, '#07091d'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = '#26245150'; ctx.lineWidth = r * .18;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x + r * .08, y - r * .45 + i * r * .4, r * .94, r * .23, -.3, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#ffffff25'; ctx.beginPath(); ctx.ellipse(x - r * .2, y - r * .28, r * .45, r * .12, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = p.id === this.ui.planetId ? '#c7caff' : `${owner}80`; ctx.lineWidth = p.id === this.ui.planetId ? 1.8 : 1; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = owner; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.name, x, y + r + 24);
    if (p.owner === 'player') { ctx.fillStyle = '#aab4ff'; ctx.beginPath(); ctx.arc(x, y - r - 12, 2, 0, Math.PI * 2); ctx.fill(); }
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
    ctx.shadowColor = system.color; ctx.shadowBlur = 20; ctx.fillStyle = this.state.destroyedSystems.includes(system.id) ? '#473954' : system.color; ctx.beginPath(); ctx.arc(cx, cy, 14 * zoom, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ddc99e'; ctx.font = '10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(system.name.toUpperCase(), cx, cy + 33 * zoom);
    const positions = [ [-.9, -.65], [.82, .35], [-.37, 1.6], [.9, -1.05] ];
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
      ctx.strokeStyle = '#a3b9ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x - 4, y + 5); ctx.lineTo(x + 4, y + 5); ctx.closePath(); ctx.stroke();
      if (f.mission) {
        const to = planets.findIndex(p => p.id === f.mission.target);
        if (to < 0) continue;
        const a = positions[index], b = positions[to];
        ctx.strokeStyle = '#a3b9ff50'; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(cx + a[0] * r, cy + a[1] * r); ctx.lineTo(cx + b[0] * r, cy + b[1] * r); ctx.stroke(); ctx.setLineDash([]);
        const progress = 1 - f.mission.remaining / f.mission.total;
        ctx.fillStyle = '#ced4ff'; ctx.beginPath(); ctx.arc(cx + (a[0] + (b[0] - a[0]) * progress) * r, cy + (a[1] + (b[1] - a[1]) * progress) * r, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  galaxy(ctx, w, h, time) {
    const points = SYSTEMS.map(s => ({ ...s, px: w / 2 + w * (s.x - .5) * this.camera.zoom + this.camera.x, py: h / 2 + h * (s.y - .5) * this.camera.zoom + this.camera.y }));
    ctx.strokeStyle = '#85b3c329'; ctx.setLineDash([2, 7]);
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) { if (Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)>.46) continue; ctx.beginPath(); ctx.moveTo(points[i].px, points[i].py); ctx.lineTo(points[j].px, points[j].py); ctx.stroke(); }
    ctx.setLineDash([]);
    for (const s of points) {
      const glow = ctx.createRadialGradient(s.px, s.py, 0, s.px, s.py, 60); glow.addColorStop(0, `${s.color}45`); glow.addColorStop(1, `${s.color}00`); ctx.fillStyle = glow; ctx.fillRect(s.px - 60, s.py - 60, 120, 120);
      ctx.strokeStyle = '#878dcc45'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(s.px, s.py, 27, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = this.state.destroyedSystems.includes(s.id) ? '#473954' : s.color; ctx.beginPath(); ctx.arc(s.px, s.py, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e3e6ff'; ctx.font = '600 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText(s.name, s.px, s.py + 48);
      const planets = this.state.planets.filter(p => p.system === s.id); const count = planets.filter(p => p.owner === 'player').length;
      ctx.font = '10px system-ui'; ctx.fillStyle = '#8e9cc7'; ctx.fillText(`${planets.filter(p=>!p.destroyed).length} Planeten${count ? ` · ${count} eigene` : ''}`, s.px, s.py + 65);
      this.hits.push({ kind: 'system', x: s.px, y: s.py, r: 32, id: s.id });
    }
  }
}
