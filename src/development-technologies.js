const node = (name, branch, tier, cost, days, requires, effects = {}, unlock = '') => ({name,branch,tier,cost,days,requires,effects,unlock});
export const DEVELOPMENT_TECHNOLOGIES = {
  geothermal:node('Geothermische Erschließung','energy',2,65,5,['grid'],{},'Geothermiekraftwerke'),
  deuterium:node('Deuteriumseparation','energy',3,100,6,['fusion'],{},'Brennstoffförderer und neuer Rohstoff'),
  fusionPlants:node('Industrielle Deuteriumfusion','energy',4,180,8,['deuterium','electronics'],{},'Deuterium-Fusionswerke'),
  electronics:node('Integrierte Schaltkreise','industry',3,110,6,['precisionFab'],{},'Elektronikfertigung'),
  recyclingPlant:node('Stoffliche Kreislaufwirtschaft','industry',4,160,7,['precisionFab','consumerCulture'],{},'Materialrecycling'),
  biomedicine:node('Xenobiomedizin','colonies',3,90,6,['hydroponics'],{},'Medikamente, Kliniken und Gesundheitsversorgung'),
  consumerCulture:node('Planetarer Lebensstandard','colonies',2,75,5,['habitats'],{},'Konsumwaren und Versorgungszentren'),
  academies:node('Ingenieursausbildung','science',3,120,7,['computing','electronics'],{},'Ingenieursakademien'),
  supplyPorts:node('Orbitale Hafenlogistik','propulsion',2,60,4,['engineTuning'],{},'Versorgungsdepots'),
  dryDocks:node('Modulare Trockendocks','propulsion',3,110,6,['supplyPorts','precisionFab'],{},'Reparaturdocks'),
  tradePorts:node('Planetare Warenbörsen','trade',3,110,6,['logistics','electronics'],{},'Handelshäfen'),
  tradeCircuits:node('Mehrstufige Handelskreisläufe','trade',3,100,6,['logistics'],{},'Handelsrouten mit bis zu sechs Stopps'),
  smartLogistics:node('Bedarfsgesteuerte Logistik','trade',4,180,8,['tradeCircuits','supplyPorts'],{supply:1.1},'Automatische Versorgungsreserve und acht Handelsstopps'),
  bulkFreighters:node('Massengut-Raumrahmen','trade',4,190,8,['tradeCircuits','electronics'],{},'Massengutfrachter mit 600 Fracht'),
  superFreighters:node('Interstellare Frachtarchitektur','trade',5,320,11,['bulkFreighters','deuterium'],{},'Megafrachter mit 1400 Fracht'),
  advancedDiplomacy:node('Interstellare Vertragsdiplomatie','trade',4,170,8,['communications','computing'],{},'Diplomatische Foren und weitere Abkommen'),
  politicalReforms:node('Institutionelle Reformverfahren','science',3,130,7,['computing'],{reformCost:.94},'Weitergehende Gesetze und politische Reformprogramme')
};
