const base = (name, glyph, color, cost, days, workers, upkeep, input, requiredTech, extra, description) => ({ name, glyph, color, cost, days, workers, upkeep, input, requiredTech, group: 'Planetare Basen', ...extra, description });
export const MILITARY_BUILDINGS = {
  bunker: base('Planetare Festung','B','#a7b8de',{credits:160,alloy:45},5,8,3,{energy:2},'fortification',{fortification:35},'Verstärkt die Garnison um 35 Verteidigungspunkte. Muss versorgt sein.'),
  orbitalGun: base('Orbitale Lanzenbatterie','G','#f2ab9c',{credits:260,alloy:70,optics:20,weapons:25},7,14,5,{energy:5},'orbitalArtillery',{orbital:30},'30 zusätzliche Orbitalverteidigung. Angreifer müssen die Batterie ausschalten.'),
  interceptor: base('Abfangnetz','I','#97bfff',{credits:280,alloy:65,optics:25},7,12,5,{energy:4},'interception',{interception:.25},'Fängt 25 % des ankommenden Raketenangriffs ab; mehrere Netze wirken bis 75 %.'),
  shield: base('Planetarer Schildgenerator','D','#a6a8ff',{credits:350,alloy:80,crystal:40,optics:25},8,14,7,{energy:8},'shieldPhysics',{shield:180,regen:12},'180 Schildpunkte und 12 Regeneration pro Tag. Schützt gegen Flotten und strategische Angriffe.'),
  missileSilo: base('Subraum-Raketensilo','M','#e3a0cf',{credits:320,alloy:85,weapons:30,optics:20},8,14,6,{energy:5},'missileDoctrine',{launcher:true},'Bereitet planetare Fernangriffe vor. Munition wird pro Auftrag bezahlt.'),
  reactor: base('Kolosse-Reaktor','R','#ffcf98',{credits:900,alloy:180,crystal:90,optics:50},12,24,12,{crystal:2},'colossalReactors',{output:{energy:150}},'Große Energiequelle für Schildnetze und Megawaffen. Verbraucht täglich Kristalle.'),
  worldShield: base('Weltenschild','S','#bcb2ff',{credits:2200,alloy:500,crystal:260,optics:180},18,28,24,{energy:35},'worldShield',{shield:1600,regen:55},'1600 Schildpunkte. Kann sogar einen Weltenbrecher abfangen, wenn vollständig geladen.'),
  stellarAegis: base('Stellare Ägis','A','#8bbcff',{credits:5500,alloy:1100,crystal:650,optics:350},24,36,45,{energy:70},'phaseAnchors',{shield:2800,regen:85,starBarrier:3000},'Schützt den ganzen Stern mit 3000 zusätzlichen Barrierepunkten. Muss beim Einschlag versorgt sein.'),
  planetLance: base('Graviton-Weltenlanze','P','#ff98ba',{credits:7000,alloy:1400,crystal:800,weapons:600,optics:350},24,40,55,{energy:80},'annihilator',{launcher:true},'Lädt einen Weltenbrecher. Ungeschützte Zielplaneten werden dauerhaft zu Trümmerfeldern.'),
  stellarForge: base('Stellare Resonanzschmiede','X','#f5a8ff',{credits:18000,alloy:3000,crystal:1800,weapons:1000,optics:900},30,56,95,{energy:140},'starBreaker',{launcher:true},'Endspielanlage für Sternenbrecher. Ein ungeschützter Stern und alle seine Planeten gehen verloren.')
};
export const STRATEGIC_WEAPONS = {
  missile: {name:'Tachyon-Fernraketen',tech:'missileDoctrine',facility:'missileSilo',cost:{credits:70,alloy:12,weapons:8,energy:25},charge:3,power:45,range:.62,description:'Präzisionsangriff auf Verteidigung und eine Anlage. Abfangnetze wirken dagegen.'},
  fusionStrike: {name:'Fusionssprengkopf',tech:'fusionWarheads',facility:'missileSilo',cost:{credits:240,alloy:30,weapons:25,crystal:15,energy:80},charge:6,power:180,range:.75,description:'Großer Flächenangriff. Schädigt Garnison, Bevölkerung, Vorräte und bis zu drei Anlagen.'},
  antimatter: {name:'Antimaterie-Salve',tech:'antimatterDoctrine',facility:'missileSilo',cost:{credits:750,alloy:80,weapons:65,crystal:65,energy:240},charge:10,power:480,range:1.2,description:'Schwere planetare Belagerung. Schilde müssen vorher geschwächt werden.'},
  worldbreaker: {name:'Graviton-Weltenbrecher',tech:'annihilator',facility:'planetLance',cost:{credits:4500,alloy:700,weapons:350,crystal:400,energy:2200},charge:20,power:1500,range:2,planetKiller:true,description:'Zerstört einen Planeten dauerhaft, wenn Schild und Abfangnetz nicht die gesamte Wirkung abfangen.'},
  starbreaker: {name:'Stellarer Resonanzbruch',tech:'starBreaker',facility:'stellarForge',cost:{credits:12000,alloy:1600,weapons:900,crystal:1000,energy:6000},charge:35,power:5200,range:2,starKiller:true,description:'Zerstört den Stern und sämtliche Planeten seines Systems. Weltenschilde und stellare Ägis bilden gemeinsam die Gegenwehr.'}
};
export const CAMPAIGN_GOALS = [
  {id:'colonies3',name:'Interplanetare Macht',kind:'colonies',target:3,credits:500,science:120},
  {id:'colonies6',name:'Grenzraum erschließen',kind:'colonies',target:6,credits:1200,science:250},
  {id:'colonies12',name:'Sternenreich',kind:'colonies',target:12,credits:2500,science:500},
  {id:'knowledge25',name:'Industrielles Zeitalter',kind:'research',target:25,credits:600,science:180},
  {id:'knowledge50',name:'Interstellare Hochtechnologie',kind:'research',target:50,credits:2400,science:500},
  {id:'bases8',name:'Festungsgürtel',kind:'bases',target:8,credits:1000,science:250},
  {id:'shields3000',name:'Ungebrochene Schirmfront',kind:'shields',target:3000,credits:1800,science:400},
  {id:'mega',name:'Stellare Ingenieurskunst',kind:'mega',target:1,credits:4000,science:700}
];
