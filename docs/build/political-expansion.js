const system = (name, description, affinity, leadership, citizenship, repression) => ({name,description,affinity,leadership,citizenship,repression,science:1,workers:1,tax:1,happiness:0});
export const NEW_IDEOLOGIES = {
  federation: system('Föderale Republik','Autonome Planeten teilen Außenpolitik und Forschung; lokale Parlamente verwalten Versorgung und Abgaben.','open','Planetarer Bundesrat','Föderale Bürgerrechte','Gering'),
  corporate: system('Konzernherrschaft','Unternehmensdirektorien führen Staat und Infrastruktur. Investitionen und Handelsverträge stehen im Zentrum.','commercial','Unternehmensdirektorien','Vertragsgebundener Bürgerstatus','Mittel'),
  oligarchy: system('Oligarchie','Ein kleiner Rat einflussreicher Häuser kontrolliert Verwaltung und strategische Ressourcen.','traditional','Rat der Handelshäuser','Ständische Beteiligung','Mittel'),
  theocracy: system('Theokratie','Religiöse Institutionen tragen Regierung und soziale Versorgung; Forschung folgt verbindlichen Lehrgrundsätzen.','spiritual','Synode','Religiöse Gemeinschaftsrechte','Hoch')
};
export const NEW_PROFILES = {
  federation:{workers:1.03,happiness:7,growth:1.08,envoy:1.12,science:1.09,tax:.9,reformCost:1.15,upkeep:1.04},
  corporate:{science:1.03,trade:1.24,tax:1.08,civilianProduction:1.1,shipTime:.95,happiness:-5,workers:.97,envoy:.92},
  oligarchy:{happiness:2,tax:1.12,upkeep:.92,trade:1.1,reformStability:.85,workers:.96,reformCost:1.22,science:.96},
  theocracy:{happiness:9,growth:1.12,foodDemand:.94,workers:1.04,science:.88,researchTime:1.12,envoy:.94}
};
export const NEW_REASONS = {
  federation:'Lokale Selbstverwaltung stärkt Zustimmung und Zuzug; gemeinsame Fachnetze fördern Forschung und Diplomatie. Geteilte Steuerhoheit senkt Abgaben, föderale Abstimmung verteuert Reformen und Verwaltung.',
  corporate:'Vertragsnetze und gebündeltes Kapital steigern Exporterlöse, Abgaben und zivile Produktion. Profitorientierte Versorgung senkt Zustimmung und Beschäftigung; wirtschaftliche Eigeninteressen erschweren Diplomatie.',
  oligarchy:'Eingespielte Handelshäuser erheben Abgaben effizient und betreiben schlanke Verwaltung. Geschlossene Machtzirkel beschränken Arbeitsmarktzugang und Fachdebatten; institutionelle Änderungen benötigen teure Zustimmung.',
  theocracy:'Gemeinschaftliche Versorgung, verbindliche Rituale und soziale Netzwerke stärken Zusammenhalt, Zuzug und Nahrungsverteilung. Lehrgebundene Forschung prüft neue Ansätze länger und begrenzt offenen Austausch.'
};
export const NEW_FACTIONS = {
  union:{name:'Republik Elara',species:'Elari',color:'#88bada',ideology:'democracy',goal:'Agrarhandel und offene Forschung',priority:'alloy',research:'colonies'},
  guild:{name:'Freie Gilden Taris',species:'Tari',color:'#c6c187',ideology:'corporate',goal:'Präzisionsbauteile und Verträge',priority:'crystal',research:'trade'},
  clans:{name:'Kronbund Rauk',species:'Rauki',color:'#d4ac94',ideology:'monarchy',goal:'Mineralische Rohstoffe und stabile Lieferungen',priority:'medicine',research:'industry'},
  archive:{name:'Archivstaat Omnis',species:'Omnari',color:'#aaa3de',ideology:'technocracy',goal:'Forschungselektronik und Akademien',priority:'food',research:'science'},
  mandate:{name:'Flottenmandat Kass',species:'Kassi',color:'#98b3bd',ideology:'military',goal:'Brennstoffversorgung und Grenzsicherung',priority:'optics',research:'defense'},
  commons:{name:'Verbund der Kommunen',species:'Synari',color:'#c693a7',ideology:'communism',goal:'Konsumgüter und gemeinschaftliche Versorgung',priority:'energy',research:'industry'},
  nomads:{name:'Freie Monde Sera',species:'Serari',color:'#99c7b0',ideology:'federation',goal:'Nahrungshandel und lokale Autonomie',priority:'electronics',research:'colonies'},
  forge:{name:'Stahlhäuser Doran',species:'Dorani',color:'#c0ad86',ideology:'oligarchy',goal:'Legierungsexport und industrielle Beteiligungen',priority:'goods',research:'industry'},
  nexus:{name:'Nexus-Handelsgesellschaft',species:'Menschen / Nexari',color:'#88c7b8',ideology:'corporate',goal:'Energieverträge und Elektronikfertigung',priority:'crystal',research:'trade'},
  concord:{name:'Föderation Concord',species:'Ilyri / Synari',color:'#96bde8',ideology:'federation',goal:'Nahrungssicherheit und autonome Kolonien',priority:'medicine',research:'colonies'},
  houses:{name:'Häuserbund Vey',species:'Veyari',color:'#ccac87',ideology:'oligarchy',goal:'Mineralienexport und metallurgische Investitionen',priority:'goods',research:'industry'},
  sanctum:{name:'Synode Sanctum',species:'Aelari',color:'#c2aae5',ideology:'theocracy',goal:'Gemeinschaftliche Versorgung und medizinische Entwicklung',priority:'electronics',research:'science'}
};
export const NEW_PLANETS = [
  ['union','Elara','helios','Ozeanisch',401,120,.7,1.05],
  ['guild','Taris','vesper','Kristallwelt',413,145,1.1,1],
  ['clans','Rauk','umbra','Vulkanisch',427,150,1.5,1.2],
  ['archive','Omnis','aurora','Kristallwelt',439,135,.9,.95],
  ['mandate','Kass','lyra','Eiswelt',451,160,1.2,.7],
  ['commons','Koinon','draco','Temperiert',463,155,.95,1],
  ['nomads','Sera','caelum','Ozeanisch',477,125,.8,1.1],
  ['forge','Doran','erebus','Industriewelt',489,170,1.35,.85],
  ['nexus','Nexus','aurora','Industriewelt',270,210,1.1,1.15],
  ['concord','Concordia','lyra','Ozeanisch',283,190,.75,1],
  ['houses','Vey Prime','draco','Vulkanisch',297,230,1.65,.9],
  ['sanctum','Sanctum','orion','Temperiert',305,200,.9,1.1]
].map(([id,name,system,kind,seed,population,oreFactor,solarFactor])=>({id,name,system,kind,seed,population,oreFactor,solarFactor,owner:id,color:NEW_FACTIONS[id].color,aliens:.8,orbit:({union:3,guild:2,clans:2,archive:4,mandate:4,commons:4,nomads:4,forge:4,sanctum:4})[id]??3,frontier:true,expansion:true}));
