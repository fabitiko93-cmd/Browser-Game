// Temperate art direction is separate from geology: a rock palette must never
// turn a living valley into a desert. Values are shared by ground and plants.
export const TEMPERATE_BIOMES = Object.freeze({
  coast: { name: 'Küstenwiesen', meadow: '#71964a', moss: '#416c3d', dry: '#91a25a', forest: .45, trees: ['oak', 'pine', 'oak', 'aspen'], grassHeight: .62, sky: '#8db9d5', fog: '#c3d6dc', description: 'Grüne Küstenwiesen mit schmalem Sandstrand, lichten Eichenhainen und Kiefern auf den höheren Uferterrassen.' },
  basin: { name: 'Wald- und Wiesental', meadow: '#548941', moss: '#355f36', dry: '#84934d', forest: .72, trees: ['oak', 'oak', 'aspen', 'aspen', 'pine'], grassHeight: .8, sky: '#a3c3d6', fog: '#c7d7d9', description: 'Ein weicher Talboden mit saftigen Wiesen, dichten Laubwaldgruppen und einem geschwungenen Bach in der Umgebung.' },
  upland: { name: 'Bewaldetes Hochland', meadow: '#759456', moss: '#446849', dry: '#9b9f65', forest: .64, trees: ['pine', 'pine', 'pine', 'aspen'], grassHeight: .46, sky: '#92b3cd', fog: '#c5d4dc', description: 'Offene Bergwiesen zwischen dicht stehenden Nadelbäumen, kühlen Felsaufschlüssen und sanft ansteigenden Hängen.' },
  caldera: { name: 'Grünes Vulkanbecken', meadow: '#56854c', moss: '#315a3c', dry: '#7e9252', forest: .86, trees: ['oak', 'oak', 'pine', 'aspen'], grassHeight: .65, sky: '#9bb9c5', fog: '#c3d4d6', description: 'Ein längst begrünter Vulkanboden mit dunklem Gestein, dichtem Mischwald, Moospolstern und Farnen in den Lichtungen.' }
});
export function regionBiome(region) { return region.preset === 'temperate' ? TEMPERATE_BIOMES[region.module] ?? null : null; }
