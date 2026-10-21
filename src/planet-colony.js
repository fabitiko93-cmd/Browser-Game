// A site plan is presentation data, not free buildings or an economic state.
// Roads and prepared clearings express how a future colony fits its landscape.
export function createColonySite(module) {
  const sites = {
    coast: { name: 'Küstenband', description: 'Erschließung parallel zur Küste, Bauplätze auf der höheren Uferterrasse.', roads: [[[16, 62], [16, -56]], [[-35, 25], [16, 25], [52, 25]]], pads: [[36, 5, 19, 22], [36, -27, 19, 23]], tint: '#8c9271' },
    basin: { name: 'Flussterrasse', description: 'Zusammenhängende Bauquartiere auf dem trockenen Ostufer; die Flussaue bleibt frei.', roads: [[[-30, 61], [-30, -57]], [[-30, 28], [49, 28]], [[-30, -24], [49, -24]]], pads: [[-8, 4, 20, 23], [28, 4, 24, 23], [15, -44, 28, 19]], tint: '#7f897b' },
    upland: { name: 'Geschütztes Hangplateau', description: 'Gestaffelte Baugruppen auf einer sanften Terrasse, windgeschützt vor dem Gebirgszug.', roads: [[[-45, 48], [-18, 15], [16, -15], [43, -48]]], pads: [[-35, 4, 20, 22], [8, 28, 24, 20], [35, -5, 20, 23]], tint: '#7e8986' },
    caldera: { name: 'Basaltterrassen', description: 'Ein gebogener Erschließungsweg verbindet die trockenen Bauflächen zwischen Basaltrücken und Kratersee.', roads: [[[-48, 34], [-3, 43], [39, 14], [35, -30], [-5, -44]]], pads: [[-25, 17, 22, 18], [17, 2, 19, 22], [9, -28, 22, 17]], tint: '#687776' }
  };
  return sites[module] ? structuredClone(sites[module]) : null;
}
export function distanceToPath(x, z, points) {
  let d = Infinity;
  for (let i = 1; i < points.length; i++) {
    const [ax, az] = points[i - 1], [bx, bz] = points[i], dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    d = Math.min(d, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return d;
}
export function colonyClearance(region, x, z) {
  if (!region.colony) return Infinity;
  const roads = Math.min(...region.colony.roads.map(path => distanceToPath(x, z, path) - 2.2));
  const pads = Math.min(...region.colony.pads.map(([px, pz, w, d]) => Math.hypot(Math.max(0, Math.abs(x - px) - w / 2), Math.max(0, Math.abs(z - pz) - d / 2))));
  return Math.min(roads, pads);
}
