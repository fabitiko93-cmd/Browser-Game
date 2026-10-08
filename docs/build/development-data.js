// Civilian development uses the same local stocks and workforce as the original chains.
export const NEW_RESOURCES = {
  electronics: { name: 'Elektronik', short: 'ELE', color: '#8bceff', unlock: 'electronics' },
  medicine: { name: 'Medikamente', short: 'MED', color: '#88dfbd', unlock: 'biomedicine' },
  goods: { name: 'Konsumwaren', short: 'KON', color: '#f4b7df', unlock: 'consumerCulture' },
  fuel: { name: 'Reaktorbrennstoff', short: 'BRE', color: '#ffbb85', unlock: 'deuterium' }
};
const building = (name, group, glyph, cost, workers, upkeep, input, output, requiredTech, description, extra = {}) => ({ name, group, glyph, color: '#91b9ef', cost, days: 5, workers, upkeep, input, output, requiredTech, description, ...extra });
export const DEVELOPMENT_BUILDINGS = {
  tower: building('Vertikales Wohnhabitat','Bevölkerung','H²',{credits:220,alloy:55,optics:12},0,2,{},{},'compactCities','180 Wohnplätze auf einer Baufläche. Erschließt dichte Industriekolonien.',{housing:180}),
  clinic: building('Planetare Klinik','Bevölkerung','+',{credits:160,alloy:30},6,3,{energy:2,medicine:.5},{},'biomedicine','Versorgte Kliniken erhöhen Zufriedenheit um 5 und Wachstum um 10 %. Bis zu zwei Kliniken wirken.',{service:'health',unique:2}),
  civicCenter: building('Versorgungszentrum','Bevölkerung','V',{credits:180,alloy:35},6,3,{energy:2,goods:.6},{},'consumerCulture','Örtliche Konsumversorgung: +5 Zufriedenheit und 5 % geringerer Nahrungsbedarf. Ein Zentrum je Planet.',{service:'civic',unique:1}),
  synthesis: building('Proteinsynthese','Versorgung','P',{credits:160,alloy:30,optics:10},8,3,{energy:8},{food:25},'hydroponics','Produziert auch auf Eis- und Vulkanwelten 25 Nahrung. Hoher Energiebedarf; unabhängig vom Agrarertrag.'),
  geothermal: building('Geothermiekraftwerk','Versorgung','G',{credits:180,alloy:45},10,3,{},{energy:38},'geothermal','38 Energie × Geothermiefaktor: Vulkanwelten eignen sich besonders gut.',{factor:'geothermal'}),
  fusionPlant: building('Deuterium-Fusionswerk','Versorgung','F',{credits:350,alloy:75,electronics:15},12,6,{fuel:1},{energy:95},'fusionPlants','Hoher Energieertrag mit einer Brennstoffkette statt Kristallverbrauch.'),
  deepMine: building('Tiefenförderanlage','Rohstoffe','T',{credits:180,alloy:45,optics:12},12,4,{energy:7},{ore:25},'precisionFab','25 Erz × örtlicher Erzgehalt. Höherer Energiebedarf bei geringerem Personalbedarf als zwei Erzförderer.'),
  fuelExtractor: building('Deuteriumförderer','Rohstoffe','D',{credits:200,alloy:40,optics:15},10,4,{energy:6},{fuel:5},'deuterium','Fördert Reaktorbrennstoff. Eis- und Ozeanwelten besitzen die höchsten Vorkommen.',{factor:'fuel'}),
  recycler: building('Materialrecycling','Industrie','↻',{credits:220,alloy:45},8,4,{goods:2,energy:4},{alloy:3,ore:2},'recyclingPlant','Verarbeitet Konsumwaren zu Legierungen und Erz. Eine alternative Kette für rohstoffarme Kolonien.'),
  electronicsFactory: building('Elektronikfabrik','Industrie','E',{credits:210,alloy:50,optics:15},14,4,{optics:2,crystal:1,energy:5},{electronics:3},'electronics','Präzisionsbauteile für moderne Werften, Forschung und Reaktoren.'),
  medicineFactory: building('Biopharmawerk','Industrie','B',{credits:190,alloy:40,crystal:10},12,4,{food:3,crystal:.5,energy:5},{medicine:4},'biomedicine','Versorgt Bevölkerung und Kliniken; medizinische Güter sind auch auf fremden Märkten gefragt.'),
  goodsFactory: building('Konsumgütermanufaktur','Industrie','K',{credits:170,alloy:35},12,3,{alloy:2,optics:.5,energy:4},{goods:6},'consumerCulture','Waren für den Lebensstandard. Wohlhabende Gesellschaften benötigen mehr davon.'),
  academy: building('Ingenieursakademie','Wissenschaft','A',{credits:250,alloy:50,electronics:15},8,5,{energy:5,electronics:.3},{},'academies','Erzeugt 2 Forschung pro Tag und qualifiziert Personal: +6 % verfügbare Arbeitskräfte. Eine Akademie je Planet.',{science:2,service:'education',unique:1}),
  depot: building('Orbitales Versorgungsdepot','Raumfahrt','V',{credits:170,alloy:40},6,3,{energy:2},{},'supplyPorts','Verdoppelt die Grundrate beim Auffüllen von Bordversorgung. Ein Depot je Planet.',{service:'supply',unique:1}),
  dryDock: building('Raumschiff-Reparaturdock','Raumfahrt','R',{credits:250,alloy:65,electronics:12},8,5,{energy:3},{},'dryDocks','Repariert 10 statt 4 Hüllenpunkte je Wartungstag; Legierungsverbrauch richtet sich nach der Reparatur.',{service:'repair',unique:1}),
  tradePort: building('Interstellarer Handelshafen','Raumfahrt','⇄',{credits:280,alloy:65,electronics:15},8,5,{energy:3},{},'tradePorts','Erweitert den Marktbestand um 25 % und verbessert Exportpreise deines Reichs um 4 %. Ein Hafen je Planet.',{service:'trade',unique:1}),
  embassy: building('Diplomatisches Forum','Wissenschaft','D',{credits:220,alloy:40,electronics:10},6,4,{energy:3},{},'advancedDiplomacy','Verbessert Gesandtschaften um 15 % und ermöglicht Forschungs-, Hafen- und Beistandsabkommen.',{service:'diplomacy',unique:1})
};
export const BULK_SHIPS = {
  bulkFreighter: { name:'Massengutfrachter',color:'#edbf8b',cost:{credits:600,alloy:160,electronics:25,fuel:25},days:10,strength:0,armor:.15,speed:.85,upkeep:4,troops:0,cargo:600,requiredTech:'bulkFreighters',description:'600 Fracht für kontinuierliche Versorgung und mehrere Handelsstopps.' },
  superFreighter: { name:'Interstellarer Megafrachter',color:'#b6d6ff',cost:{credits:1400,alloy:320,electronics:60,fuel:60},days:15,strength:0,armor:.2,speed:.75,upkeep:8,troops:0,cargo:1400,requiredTech:'superFreighters',description:'1400 Fracht. Große Lieferkreisläufe für entwickelte Kolonien; hoher Unterhalt.' }
};
export const BASE_PRICES = {food:1.8,ore:2.4,alloy:5.5,energy:1.4,crystal:7.5,optics:8.5,weapons:14,electronics:12,medicine:11,goods:6,fuel:9};
export const PLANET_FACTORS = {
  Temperiert:{food:1.15,crystal:.8,fuel:.65,geothermal:.7},
  Vulkanisch:{food:.45,crystal:1.1,fuel:.45,geothermal:1.8},
  Ozeanisch:{food:1.45,crystal:.65,fuel:1.5,geothermal:.7},
  Kristallwelt:{food:.55,crystal:1.9,fuel:.7,geothermal:.8},
  Industriewelt:{food:.7,crystal:.9,fuel:.8,geothermal:.9},
  Eiswelt:{food:.35,crystal:1.1,fuel:1.8,geothermal:.6}
};
