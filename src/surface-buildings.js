import { BUILDINGS } from './data.js';

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// Preserve the original roof, glyph and status-dot design for every building.
export function paintBuilding(ctx, b, size = 100, displaySize = 32) {
  const def = BUILDINGS[b.type], px = 0, py = 0, unit = size / displaySize;
  ctx.save(); ctx.shadowColor = '#00000070'; ctx.shadowBlur = 6 * unit; ctx.shadowOffsetY = 3 * unit;
  ctx.fillStyle = '#111f25'; roundRect(ctx, px + size * .12, py + size * .15, size * .76, size * .7, 3 * unit); ctx.fill(); ctx.restore();
  ctx.fillStyle = b.remaining > 0 ? '#526266' : def.color; roundRect(ctx, px + size * .16, py + size * .1, size * .68, size * .56, 2 * unit); ctx.fill();
  if (b.type === 'solar') {
    ctx.fillStyle = '#254862'; ctx.fillRect(px + size * .23, py + size * .17, size * .54, size * .4);
    ctx.strokeStyle = '#789cc0'; ctx.lineWidth = .7 * unit;
    for (let j = 1; j < 3; j++) { ctx.beginPath(); ctx.moveTo(px + size * (.23 + .18 * j), py + size * .17); ctx.lineTo(px + size * (.23 + .18 * j), py + size * .57); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(px + size * .23, py + size * .37); ctx.lineTo(px + size * .77, py + size * .37); ctx.stroke();
  } else if (b.type === 'farm') {
    ctx.fillStyle = '#38553a'; for (let j = 0; j < 3; j++) { roundRect(ctx, px + size * .23, py + size * (.18 + j * .13), size * .54, size * .09, 2 * unit); ctx.fill(); }
  } else if (b.type === 'habitat') {
    ctx.fillStyle = '#3a5360'; ctx.fillRect(px + size * .28, py + size * .16, size * .44, size * .42);
    ctx.fillStyle = '#dfd9ae'; for (let i = 0; i < 4; i++) ctx.fillRect(px + size * (.33 + (i % 2) * .22), py + size * (.21 + Math.floor(i / 2) * .2), size * .09, size * .1);
  } else {
    ctx.fillStyle = '#22333b'; ctx.font = `600 ${Math.max(10 * unit, size * .37)}px system-ui`; ctx.textAlign = 'center'; ctx.fillText(def.glyph, px + size * .5, py + size * .51);
  }
  ctx.fillStyle = b.remaining > 0 ? '#d4b481' : b.enabled && b.status === 'aktiv' ? '#99b7ff' : '#e3a071';
  ctx.beginPath(); ctx.arc(px + size * .8, py + size * .79, Math.max(2 * unit, size * .06), 0, Math.PI * 2); ctx.fill();
}
