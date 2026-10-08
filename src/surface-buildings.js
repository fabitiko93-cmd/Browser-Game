import { BUILDINGS } from './data.js';
import { constructionPhase } from './surface.js';

const TAU = Math.PI * 2;
function polygon(c, points, fill, stroke = null) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
  c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.stroke(); }
}
function rect(c, x, y, w, h, color, radius = 3) { c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, radius); c.fill(); }
function ellipse(c, x, y, rx, ry, color, stroke = null) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = color; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.stroke(); }
}
function line(c, points, color, width = 2) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = color; c.lineWidth = width; c.stroke();
}
function block(c, x, y, w, h, color = '#a5b7cc', depth = 7) {
  rect(c, x, y + depth, w, h, '#26354c'); rect(c, x, y, w, h, color);
  line(c, [[x + 3, y + 2], [x + w - 3, y + 2]], '#e2eeff80', 1.8);
}
function dome(c, x, y, rx, ry, glow = '#8acff4') {
  ellipse(c, x, y + 7, rx, ry, '#1a2e47');
  const g = c.createRadialGradient(x - rx * .3, y - ry * .4, 0, x, y, rx);
  g.addColorStop(0, '#e0f4ff'); g.addColorStop(.35, glow); g.addColorStop(1, '#284967');
  ellipse(c, x, y, rx, ry, g, '#b6d5ec');
  line(c, [[x - rx * .6, y - ry * .55], [x - rx * .5, y + ry * .7]], '#d1e9ff65', 1.7);
  line(c, [[x + rx * .5, y - ry * .65], [x + rx * .6, y + ry * .5]], '#d1e9ff55', 1.7);
}
function dish(c, x, y, radius = 13) {
  line(c, [[x, y], [x + 4, y + 19]], '#718ca8', 4);
  ellipse(c, x, y, radius, radius * .58, '#bdd0e6', '#dbe8fc');
  line(c, [[x - radius * .65, y + 1], [x + 5, y - radius * .55]], '#526d8c', 2);
}
function tanks(c, color = '#89bdc7') {
  for (let i = 0; i < 3; i++) { rect(c, 21 + i * 21, 35, 16, 28, '#32475c'); ellipse(c, 29 + i * 21, 35, 8, 6, color, '#d0e0ef80'); }
  line(c, [[22, 70], [76, 70], [76, 45]], '#718899', 4);
}
function industry(c, type) {
  const accents = { foundry: '#f3ac76', optics: '#84d6e5', laser: '#f48ca8', electronicsFactory: '#94c9ff', medicineFactory: '#9cddcd', goodsFactory: '#caa4d7', recycler: '#8cc7b6' };
  const accent = accents[type];
  block(c, 16, 32, 67, 35, '#8196b0');
  for (let i = 0; i < 3; i++) block(c, 21 + i * 19, 30, 13, 24, '#526b8a', 3);
  line(c, [[22, 67], [77, 67]], accent, 3);
  if (type === 'foundry') {
    for (let i = 0; i < 2; i++) { block(c, 27 + i * 27, 15, 10, 29, '#bbc2cd'); ellipse(c, 32 + i * 27, 15, 5, 3, '#fbc494'); }
    polygon(c, [[24, 49], [65, 49], [60, 56], [26, 56]], '#ffb57e');
  } else if (type === 'electronicsFactory') {
    rect(c, 36, 35, 29, 21, '#15364f');
    for (let i = 0; i < 4; i++) line(c, [[30, 38 + i * 5], [69, 38 + i * 5]], accent, 1.6);
    rect(c, 42, 38, 17, 15, '#77b7dc');
  } else if (type === 'medicineFactory') tanks(c, accent);
  else if (type === 'recycler') {
    for (let i = 0; i < 3; i++) ellipse(c, 29 + i * 20, 43, 8, 8, '#243c4c', accent);
    line(c, [[20, 57], [80, 57]], '#84c3aa', 3);
  } else if (type === 'laser') {
    block(c, 35, 23, 20, 22, '#b6c4d7'); line(c, [[48, 35], [75, 22]], '#354b65', 8); line(c, [[49, 34], [75, 21]], accent, 2);
  } else if (type === 'goodsFactory') {
    for (let i = 0; i < 3; i++) block(c, 22 + i * 20, 51, 13, 15, '#aab4d2', 4);
  } else { dome(c, 50, 39, 21, 13, accent); }
}
function reactor(c, type) {
  const glow = type === 'geothermal' ? '#f0b17c' : type === 'fusionPlant' ? '#80dce3' : '#d0b2ff';
  ellipse(c, 50, 51, 32, 24, '#1b2c45', '#92a2b9');
  ellipse(c, 50, 46, 25, 19, '#5a728e', '#b4c9de');
  ellipse(c, 50, 45, 16, 12, '#26364e', glow);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; line(c, [[50 + Math.cos(a) * 17, 46 + Math.sin(a) * 13], [50 + Math.cos(a) * 30, 46 + Math.sin(a) * 23]], '#899fb6', 5); }
  if (type === 'geothermal') {
    block(c, 29, 20, 12, 26, '#b7b8be'); block(c, 59, 16, 12, 29, '#c3c6cc');
    ellipse(c, 35, 20, 6, 3, glow); ellipse(c, 65, 16, 6, 3, glow);
  } else { dome(c, 50, 40, 14, 13, glow); block(c, 73, 26, 7, 19, '#b0c7d6'); }
}
function spaceport(c, type) {
  polygon(c, [[14, 33], [31, 16], [73, 16], [87, 33], [87, 73], [14, 73]], '#34445e', '#8aa0bf');
  polygon(c, [[23, 35], [37, 26], [65, 26], [78, 35], [78, 62], [23, 62]], '#14243c', '#728bab');
  line(c, [[22, 68], [78, 68]], '#95bfdc', 2);
  if (type === 'shipyard' || type === 'dryDock') {
    polygon(c, [[50, 29], [62, 56], [51, 50], [39, 56]], '#c8d9e8', '#eff4ff');
    rect(c, 46, 40, 9, 13, '#526e91');
    line(c, [[18, 57], [18, 15], [72, 15], [72, 30]], type === 'dryDock' ? '#b3c9db' : '#d0b48c', 4);
    if (type === 'dryDock') { line(c, [[31, 35], [37, 35]], '#f6c790', 4); line(c, [[66, 35], [74, 35]], '#f6c790', 4); }
  } else {
    for (let i = 0; i < 3; i++) block(c, 27 + i * 18, 37, 12, 23, ['#b1b6cf', '#7cb3d0', '#c4b3a0'][i], 4);
    if (type === 'tradePort') line(c, [[28, 21], [75, 21]], '#92d9e8', 4);
    else dish(c, 68, 21, 9);
  }
}
function shield(c, type) {
  const huge = type !== 'shield';
  ellipse(c, 50, 53, 34, 25, '#29364f', '#a3b4d0');
  ellipse(c, 50, 49, 27, 19, '#48628a', '#96b8f2');
  for (let i = 0; i < (huge ? 6 : 4); i++) {
    const a = i * TAU / (huge ? 6 : 4); block(c, 45 + Math.cos(a) * 27, 44 + Math.sin(a) * 20, 9, 12, '#b2bfda', 5);
  }
  dome(c, 50, 42, 17, 17, type === 'stellarAegis' ? '#96d8ff' : '#b7b1ff');
  if (huge) { c.strokeStyle = '#b5ceffb0'; c.lineWidth = 2; c.beginPath(); c.ellipse(50, 37, 23, 27, .3, 0, TAU); c.stroke(); }
  if (type === 'stellarAegis') line(c, [[50, 43], [50, 11]], '#e2e7ff', 3);
}
function drawStructure(c, type) {
  if (type === 'habitat') { block(c, 23, 51, 56, 14, '#9fb4c9'); dome(c, 50, 40, 29, 21); rect(c, 44, 59, 12, 8, '#bce2ed'); }
  else if (type === 'tower') {
    block(c, 24, 40, 23, 26, '#849dbb', 12); block(c, 43, 17, 28, 39, '#b0c6de', 13);
    for (let i = 0; i < 4; i++) line(c, [[47, 24 + i * 8], [67, 24 + i * 8]], '#436588', 3);
  } else if (type === 'farm') {
    for (let i = 0; i < 3; i++) { rect(c, 16, 24 + i * 16, 68, 12, '#233e44', 6); rect(c, 16, 20 + i * 16, 68, 12, '#9abdbb', 6); line(c, [[24, 27 + i * 16], [76, 27 + i * 16]], '#487f69', 3); }
  } else if (type === 'synthesis') { block(c, 16, 35, 69, 31, '#a1bdc7'); for (let i = 0; i < 3; i++) dome(c, 29 + i * 21, 33, 8, 13, '#b7e6cc'); }
  else if (type === 'solar') {
    for (let i = 0; i < 2; i++) {
      polygon(c, [[16, 24 + i * 25], [77, 15 + i * 25], [85, 34 + i * 25], [23, 44 + i * 25]], '#254565', '#b1c7de');
      for (let j = 1; j < 4; j++) line(c, [[16 + j * 15, 24 + i * 25 - j * 2.2], [23 + j * 15, 44 + i * 25 - j * 2.4]], '#6087b0', 1.5);
      line(c, [[20, 34 + i * 25], [80, 25 + i * 25]], '#6087b0', 1.5);
    }
  } else if (['mine', 'deepMine'].includes(type)) {
    ellipse(c, 50, 50, 32, 21, '#738093', '#bdc0c6'); ellipse(c, 50, 49, 25, 16, '#334055'); ellipse(c, 50, 49, 17, 10, '#101c2d');
    line(c, [[30, 55], [47, 16], [65, 55]], '#d0bea1', 5); line(c, [[39, 34], [59, 34], [36, 47], [64, 47]], '#8699b0', 3);
    line(c, [[47, 17], [47, 54]], '#cbd2db', 3); block(c, 66, 46, 17, 16, '#91a1b6');
    if (type === 'deepMine') { block(c, 14, 30, 11, 29, '#b9b9cb'); line(c, [[15, 62], [77, 62]], '#f0b379', 3); }
  } else if (type === 'crystal') {
    block(c, 19, 51, 60, 17, '#8597b2');
    for (let i = 0; i < 3; i++) { const x = 28 + i * 20; polygon(c, [[x, 53], [x - 7, 34], [x + 2, 19 + i * 5], [x + 10, 35], [x + 7, 55]], '#a99add', '#d2c5fc'); line(c, [[x + 2, 22 + i * 5], [x + 2, 51]], '#695eaa', 2); }
  } else if (type === 'fuelExtractor') { block(c, 17, 50, 68, 18, '#8296ab'); tanks(c); dish(c, 73, 17, 8); }
  else if (['geothermal', 'fusionPlant', 'reactor'].includes(type)) reactor(c, type);
  else if (['foundry', 'optics', 'laser', 'electronicsFactory', 'medicineFactory', 'goodsFactory', 'recycler'].includes(type)) industry(c, type);
  else if (['shipyard', 'dryDock', 'tradePort', 'depot'].includes(type)) spaceport(c, type);
  else if (['shield', 'worldShield', 'stellarAegis'].includes(type)) shield(c, type);
  else if (type === 'bunker') {
    polygon(c, [[16, 39], [31, 23], [70, 23], [85, 39], [85, 66], [15, 66]], '#5b6d86', '#b5c0d0');
    polygon(c, [[26, 40], [36, 30], [65, 30], [75, 40], [75, 54], [25, 54]], '#95a4b9'); rect(c, 40, 57, 22, 10, '#202e43');
  } else if (type === 'orbitalGun') {
    ellipse(c, 48, 53, 29, 21, '#3c516f', '#acbcd2'); block(c, 30, 37, 35, 20, '#95a7bb');
    line(c, [[46, 40], [79, 15]], '#d1c7bd', 11); line(c, [[47, 36], [76, 14]], '#657d9c', 4); ellipse(c, 78, 15, 5, 4, '#f5b899');
  } else if (type === 'interceptor') { for (const [x, y] of [[29, 43], [53, 25], [75, 48]]) dish(c, x, y, 12); }
  else if (type === 'missileSilo') {
    block(c, 16, 30, 68, 39, '#8391b0');
    for (const [x, y] of [[33, 42], [64, 42], [49, 60]]) { ellipse(c, x, y, 11, 8, '#253149', '#c3c7d9'); line(c, [[x - 7, y], [x + 7, y]], '#7586a4', 2); }
    polygon(c, [[61, 41], [64, 24], [68, 41]], '#d9dfe9');
  } else if (['planetLance', 'stellarForge'].includes(type)) {
    ellipse(c, 50, 56, 34, 24, '#334761', '#c2b2dd');
    block(c, 42, 23, 16, 33, '#afb8d4');
    for (let i = 0; i < 3; i++) ellipse(c, 50, 29 + i * 11, 24 - i * 3, 8, '#46527d', type === 'stellarForge' ? '#e9adfa' : '#ffb5cf');
    polygon(c, [[46, 27], [50, 8], [55, 27]], '#e8d7ff');
    if (type === 'stellarForge') line(c, [[19, 52], [25, 20], [75, 20], [81, 52]], '#c899ef', 3);
  } else if (type === 'clinic') {
    block(c, 19, 34, 65, 29, '#afc8d2'); block(c, 36, 25, 30, 26, '#d7e6ec', 5);
    rect(c, 47, 30, 8, 17, '#4a9e98', 0); rect(c, 42, 35, 18, 7, '#4a9e98', 0);
  } else if (type === 'civicCenter') {
    block(c, 17, 40, 67, 24, '#9eb7ce'); dome(c, 50, 33, 22, 16, '#a9d4ef'); line(c, [[24, 59], [77, 59]], '#9fd4cd', 3);
  } else if (type === 'academy') {
    for (let i = 0; i < 3; i++) block(c, 18 + i * 24, 31 + (i === 1 ? -12 : 8), 19, 29, '#b1c3de');
    line(c, [[26, 61], [74, 61]], '#a5bdf6', 3);
  } else if (type === 'embassy') {
    ellipse(c, 50, 53, 33, 22, '#526582', '#a8bacf'); dome(c, 50, 34, 22, 20, '#cbbce6');
    line(c, [[76, 65], [76, 17]], '#ccdae6', 3); polygon(c, [[77, 18], [91, 22], [77, 29]], '#a4bfff');
  } else { block(c, 20, 29, 60, 37); dish(c, 64, 23, 15); dome(c, 33, 39, 14, 11, '#b3bef5'); }
}
function scaffold(c, phase) {
  const color = '#d2b98d';
  for (const x of [23, 77]) line(c, [[x, 68], [x, 24]], color, 3);
  for (const y of [26, 47, 67]) line(c, [[22, y], [78, y]], '#9db0c9', 2);
  line(c, [[23, 26], [77, 67], [23, 67], [77, 26]], '#8ea2bf', 2);
  if (phase !== 'foundation') { line(c, [[82, 68], [82, 12], [28, 12], [28, 23]], '#e3b987', 3); ellipse(c, 28, 25, 2, 3, '#e8d4b4'); }
}
export function paintBuilding(c, building, time = 0) {
  const def = BUILDINGS[building.type], phase = constructionPhase(building, def.days), active = building.enabled && building.status === 'aktiv';
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  polygon(c, [[10, 24], [83, 24], [94, 72], [80, 86], [13, 86], [6, 73]], '#02081765');
  polygon(c, [[12, 21], [83, 21], [89, 70], [78, 80], [14, 80], [9, 69]], '#263349', '#617895');
  if (phase === 'foundation') {
    rect(c, 23, 36, 52, 26, '#41536d'); line(c, [[23, 36], [75, 62]], '#6c82a0', 2); scaffold(c, phase);
  } else {
    c.save(); if (phase === 'frame') c.globalAlpha = .25; else if (phase === 'complete' && !active) c.globalAlpha = .58;
    drawStructure(c, building.type); c.restore();
    if (phase !== 'complete') scaffold(c, phase);
  }
  if (phase !== 'complete') {
    rect(c, 18, 75, 62, 4, '#172237', 1); rect(c, 18, 75, 62 * Math.max(.03, 1 - building.remaining / def.days), 4, '#f0c894', 1);
  } else {
    rect(c, 19, 74, 13, 3, active ? '#a9deef' : building.enabled ? '#ffbd83' : '#60788e', 1);
    if (active && time) { c.globalAlpha = .3 + .25 * Math.sin(time * .001 + building.x); rect(c, 69, 74, 8, 2, '#b6d8ff', 1); }
  }
  c.restore();
}
