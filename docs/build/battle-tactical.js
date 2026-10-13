import { activeShip, fleetCenter, fleetDistanceKm } from './battle-demo.js';

export class BattleTactical {
  constructor(canvas, onSelect) {
    this.canvas = canvas; this.onSelect = onSelect; this.points = new Map();
    canvas.addEventListener('click', event => {
      const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
      let chosen, closest = 25;
      for (const [id, point] of this.points) if (point.active) {
        const distance = Math.hypot(x - point.x, y - point.y);
        if (distance < closest) { chosen = id; closest = distance; }
      }
      if (chosen) this.onSelect(chosen);
    });
  }
  render(battle) {
    const canvas = this.canvas, w = canvas.clientWidth, h = canvas.clientHeight;
    if (w < 1 || h < 1) return;
    if (canvas.width !== w * 2 || canvas.height !== h * 2) { canvas.width = w * 2; canvas.height = h * 2; }
    const c = canvas.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, w, h);
    c.lineWidth = 1; c.strokeStyle = '#7d96b518';
    for (let x = 20; x < w; x += 30) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 10; y < h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    this.points.clear();
    for (const side of ['enemy', 'friendly']) {
      const center = fleetCenter(battle, side), baseY = h * (side === 'enemy' ? .25 : .73);
      const ships = battle.ships.filter(ship => ship.side === side);
      const extent = Math.max(50, ...ships.map(ship => Math.abs(ship.position[0] - center[0])));
      c.font = '11px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'; c.textAlign = 'center'; c.fillStyle = side === 'enemy' ? '#ff9fb0' : '#8fceff';
      if (h > 230) c.fillText(side === 'enemy' ? 'GEGNERISCHE FLOTTE' : 'EIGENE FLOTTE', w / 2, side === 'enemy' ? 34 : h * .59);
      for (const ship of ships) {
        const x = w / 2 + (ship.position[0] - center[0]) / extent * (w / 2 - 31);
        const z = Math.max(-1, Math.min(1, (ship.position[2] - center[2]) / 90));
        this.points.set(ship.id, { x, y: baseY + z * Math.min(25, h * .07), active: activeShip(ship), ship });
      }
    }
    const own = battle.ships.find(ship => ship.id === battle.selected), from = this.points.get(own?.id);
    const targetId = own?.targeting === 'target' ? own.commandTarget : own?.target;
    const to = this.points.get(targetId);
    if (from && to && from.active && to.active) {
      c.strokeStyle = own.targeting === 'auto' ? '#80bcdf66' : '#96d7ffaa'; c.setLineDash(own.targeting === 'auto' ? [3, 5] : []);
      c.beginPath(); c.moveTo(from.x, from.y - 10); c.lineTo(to.x, to.y + 10); c.stroke(); c.setLineDash([]);
    }
    c.fillStyle = '#0b1425'; c.fillRect(w / 2 - 43, h / 2 - 12, 86, 24);
    c.fillStyle = '#b3c5dc'; c.font = '12px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'; c.textAlign = 'center';
    c.fillText(`${fleetDistanceKm(battle).toLocaleString('de-DE', { maximumFractionDigits: 1 })} km`, w / 2, h / 2 + 4);
    for (const [id, point] of this.points) {
      const { x, y, ship, active } = point, selected = id === battle.selected || id === battle.target;
      const size = { cruiser: 9, destroyer: 7, corvette: 6, interceptor: 5 }[ship.type];
      c.globalAlpha = active ? 1 : .25; c.fillStyle = ship.side === 'enemy' ? '#ff8f9f' : '#7bbfff';
      c.beginPath(); c.moveTo(x, y - size); c.lineTo(x + size * .7, y + size); c.lineTo(x, y + size * .55); c.lineTo(x - size * .7, y + size); c.closePath(); c.fill();
      if (selected) { c.strokeStyle = ship.side === 'enemy' ? '#ff9cae' : '#9bd9ff'; c.beginPath(); c.arc(x, y, size + 7, 0, Math.PI * 2); c.stroke(); }
      c.fillStyle = '#d0ddef'; c.font = '11px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'; c.textAlign = 'center';
      if (h > 170 || selected) c.fillText(ship.name, Math.max(28, Math.min(w - 28, x)), Math.min(h - 8, y + size + 18));
      c.globalAlpha = 1;
    }
  }
}
