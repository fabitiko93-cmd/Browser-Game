// Shared spherical geography. The globe and every regional recipe sample this
// field; marker coordinates are selected from actual land and climate.
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const rad = Math.PI / 180;
export function sphereNoise(seed, x, y, z, channel = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const u = smooth(0, 1, x - ix), v = smooth(0, 1, y - iy), w = smooth(0, 1, z - iz);
  const hash = (a, b, c) => { let h = seed ^ Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 2147483647) ^ Math.imul(channel, 1274126177); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967295; };
  const plane = c => { const a = hash(ix, iy, c), b = hash(ix + 1, iy, c), d = hash(ix, iy + 1, c), e = hash(ix + 1, iy + 1, c); return (a + (b - a) * u) * (1 - v) + (d + (e - d) * u) * v; };
  return plane(iz) * (1 - w) + plane(iz + 1) * w;
}
export function createPlanetGeography(seed) {
  const rotate = sphereNoise(seed, 4, 8, 2, 10) * Math.PI * 2;
  const continents = Array.from({ length: 5 }, (_, i) => {
    const lat = [-.1, .6, -.55, .2, -.25][i], lon = rotate + i * 2.4;
    return { x: Math.cos(lat) * Math.cos(lon), y: Math.sin(lat), z: Math.cos(lat) * Math.sin(lon), radius: .63 + sphereNoise(seed, i, 2, 9, 11) * .18 };
  });
  return { seed, continents };
}
export function samplePlanetSurface(surface, latitude, longitude) {
  const lat = latitude * rad, lon = longitude * rad;
  const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
  const n = (scale, c) => sphereNoise(surface.seed, x * scale + 7.3, y * scale - 2.1, z * scale + 5.7, c);
  let land = -1;
  for (const c of surface.continents) land = Math.max(land, c.radius - Math.acos(clamp(x * c.x + y * c.y + z * c.z, -1, 1)));
  land += (n(3.4, 1) - .5) * .44 + (n(8, 2) - .5) * .13 + (n(23, 7) - .5) * .035;
  const ridge = Math.pow(smooth(.36, .72, n(4.8, 3)), 1.8) * (.4 + n(17, 6) * .6);
  const elevationM = Math.max(0, land * 1500 + smooth(.07, .28, land) * ridge * 1900);
  const temperatureC = 32 - Math.abs(latitude) * .4 - elevationM * .0045;
  const moisture = clamp(.44 + n(3.2, 4) * .58 - Math.exp(-Math.pow((Math.abs(latitude) - 27) / 12, 2)) * .29 - elevationM / 14000);
  const volcanism = n(6.2, 5);
  return { land, ocean: land < 0, elevationM, temperatureC, moisture, ridge, volcanism };
}
export function choosePlanetLocations(surface, count = 4) {
  const candidates = [];
  for (let lat = -70; lat <= 70; lat += 3) for (let lon = -179; lon < 180; lon += 4) {
    const s = samplePlanetSurface(surface, lat, lon);
    if (!s.ocean) candidates.push({ latitude: lat, longitude: lon, ...s });
  }
  const targets = [
    { lat: 29, elevation: 45, temp: 20, moisture: .48, coast: true },
    { lat: 43, elevation: 260, temp: 14, moisture: .8 },
    { lat: 49, elevation: 1100, temp: 7, moisture: .64 },
    { lat: 61, elevation: 480, temp: 4, moisture: .7, volcanic: true },
    { lat: -17, elevation: 45, temp: 25, moisture: .76, coast: true }
  ];
  const selected = [];
  for (const t of targets.slice(0, count)) {
    let winner, best = Infinity;
    for (const c of candidates) {
      const separation = selected.some(p => Math.hypot((p.longitude - c.longitude + 540) % 360 - 180, p.latitude - c.latitude) < 24);
      if (separation) continue;
      let score = Math.abs(c.latitude - t.lat) / 12 + Math.abs(c.elevationM - t.elevation) / (t.coast ? 90 : 520) + Math.abs(c.temperatureC - t.temp) / 9 + Math.abs(c.moisture - t.moisture) * 4;
      if (t.coast) score += c.land * 15;
      if (t.volcanic) score += (1 - c.volcanism) * 8;
      if (score < best) { best = score; winner = c; }
    }
    if (!winner) throw new Error('Keine geeignete Landregion.');
    // Refine the warm coastal site toward the actual land/ocean boundary.
    if (t.coast) {
      let bestCoast = winner;
      for (let a = -2; a <= 2; a += .25) for (let b = -2; b <= 2; b += .25) {
        const latitude = winner.latitude + a, longitude = winner.longitude + b;
        const s = samplePlanetSurface(surface, latitude, longitude);
        if (s.land > .006 && Math.abs(s.elevationM - 18) < Math.abs(bestCoast.elevationM - 18)) bestCoast = { latitude, longitude, ...s };
      }
      winner = bestCoast;
    }
    selected.push(winner);
  }
  return selected;
}
export function surfaceColor(sample, latitude, biology = null) {
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * clamp(t));
  if (sample.ocean) return mix(mix(biology?.ocean?.[0] ?? [20, 59, 79], biology?.ocean?.[1] ?? [49, 126, 142], smooth(-.15, -.008, sample.land)), [220, 230, 230], smooth(79, 88, Math.abs(latitude)));
  if (biology?.globe) {
    const b = biology.globe;
    let color = mix(b.dry, b.wet, smooth(.25, .85, sample.moisture));
    color = mix(b.cold, color, smooth(-3, 12, sample.temperatureC));
    color = mix(color, b.rock, smooth(700, 2100, sample.elevationM) * .7);
    color = mix(color, [224, 231, 227], smooth(-3, -12, sample.temperatureC) * .92);
    return mix(b.sand, color, smooth(0, .018, sample.land));
  }
  const warm = mix([102, 128, 70], [53, 92, 57], smooth(.35, .8, sample.moisture));
  const cold = mix([116, 127, 106], [67, 96, 77], sample.moisture);
  let color = mix(cold, warm, smooth(-3, 12, sample.temperatureC));
  color = mix(color, [166, 155, 111], (1 - smooth(.24, .5, sample.moisture)) * .68);
  color = mix(color, [94, 99, 97], smooth(700, 2100, sample.elevationM) * .65);
  color = mix(color, [63, 75, 70], smooth(.62, .85, sample.volcanism) * smooth(48, 62, Math.abs(latitude)) * .55);
  color = mix(color, [224, 231, 227], smooth(-3, -12, sample.temperatureC) * .92);
  color = mix([177, 172, 126], color, smooth(0, .018, sample.land));
  return color;
}
export function planetSurfacePixels(surface, width = 1024, height = 512, biology = null) {
  const data = new Uint8Array(width * height * 4);
  for (let j = 0; j < height; j++) for (let i = 0; i < width; i++) {
    // DataTexture row zero is the south pole. SphereGeometry u=.5 is longitude 0.
    const latitude = -90 + (j + .5) / height * 180, longitude = -180 + (i + .5) / width * 360;
    const s = samplePlanetSurface(surface, latitude, longitude), color = surfaceColor(s, latitude, biology);
    const lat = latitude * rad, lon = longitude * rad, x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
    const grain = sphereNoise(surface.seed, x * 77, y * 77, z * 77, 13) * .6 + sphereNoise(surface.seed, x * 233, y * 233, z * 233, 14) * .4 - .5;
    const shade = s.ocean ? .99 + grain * .015 : .94 + s.ridge * .1 + grain * .4;
    const index = (j * width + i) * 4;
    for (let c = 0; c < 3; c++) data[index + c] = Math.round(clamp(color[c] * shade, 0, 255));
    data[index + 3] = 255;
  }
  return { data, width, height };
}
