const node=(name,branch,tier,cost,days,requires,effects,description)=>({name,branch,tier,cost,days,requires,effects,description});
export const MILITARY_BRANCHES = {
  fortresses:{name:'Festungen',color:'#9fbaff',description:'Bunker, Abfangnetze und planetare Schirme.'},
  ordnance:{name:'Fernwaffen',color:'#ff9ab7',description:'Fernraketen, Fusionsangriffe und Weltenbrecher.'},
  megastructures:{name:'Megabauten',color:'#d4a0ff',description:'Großreaktoren, Sternenschilde und stellare Waffen.'}
};
export const MILITARY_TECHNOLOGIES = {
  fortification:node('Planetare Befestigungen','fortresses',1,80,5,['targeting'],{},'Schaltet Planetare Festungen frei.'),
  orbitalArtillery:node('Orbitale Artillerie','fortresses',2,220,8,['fortification','precisionFab'],{},'Schaltet orbitale Lanzenbatterien frei.'),
  shieldPhysics:node('Makroskopische Schildfelder','fortresses',3,350,10,['orbitalArtillery','fusion'],{},'Schaltet planetare Schildgeneratoren frei.'),
  interception:node('Subraum-Abfangnetze','fortresses',3,330,10,['orbitalArtillery','computing'],{},'Schaltet Raketen-Abfangnetze frei.'),
  worldShield:node('Weltenschild-Theorie','fortresses',4,1500,20,['shieldPhysics','smartGrid'],{},'Schaltet den Weltenschild frei.'),
  shieldResonance:node('Resonante Schildverbünde','fortresses',5,2600,26,['worldShield','interception'],{shieldCapacity:1.15,shieldRegen:1.2},'Verbessert die Schildnetze deiner Kolonien.'),
  missileDoctrine:node('Planetare Fernschläge','ordnance',1,120,6,['targeting'],{},'Schaltet Subraum-Raketensilos und Tachyon-Fernraketen frei.'),
  fusionWarheads:node('Fusionsbelagerung','ordnance',2,450,10,['missileDoctrine','fusion'],{},'Schaltet Fusionssprengköpfe frei.'),
  siegeGuidance:node('Interstellare Feuerleitung','ordnance',3,600,12,['missileDoctrine','computing'],{strikePower:1.15},'Verbessert strategische Angriffe.'),
  deepRange:node('Tiefenraum-Zielnetze','ordnance',3,800,14,['siegeGuidance','propulsion'],{strikeRange:1.8},'Vergrößert die Reichweite der Fernwaffen.'),
  antimatterDoctrine:node('Antimaterie-Belagerung','ordnance',4,1600,20,['fusionWarheads','plasma'],{},'Schaltet Antimaterie-Salven frei.'),
  annihilator:node('Graviton-Kollapsfelder','ordnance',5,4500,28,['antimatterDoctrine','gates','quantumModels'],{},'Schaltet die Graviton-Weltenlanze und den Weltenbrecher frei.'),
  orbitalMegas:node('Orbitale Megabauweise','megastructures',1,180,8,['precisionFab','fusion'],{},'Grundlage großer Energie- und Sternenanlagen.'),
  colossalReactors:node('Kolosse-Reaktoren','megastructures',2,700,12,['orbitalMegas','plasma'],{},'Schaltet den Kolosse-Reaktor frei.'),
  phaseAnchors:node('Stellare Phasenanker','megastructures',3,1200,16,['colossalReactors','computing'],{},'Schaltet die Stellare Ägis frei: Gegenwehr gegen Sternenbrecher.'),
  stellarDynamics:node('Kontrollierte Sterndynamik','megastructures',3,2200,20,['colossalReactors','dataNetwork'],{},'Grundlage stellarer Resonanzanlagen.'),
  singularityControl:node('Singularitätskontrolle','megastructures',4,3500,24,['stellarDynamics','quantumModels'],{},'Voraussetzung für die größte Megawaffe.'),
  starBreaker:node('Stellare Resonanztechnik','megastructures',5,6500,30,['singularityControl','annihilator'],{},'Schaltet die Stellare Resonanzschmiede und den Sternenbrecher frei.')
};
