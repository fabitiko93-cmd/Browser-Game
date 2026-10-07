import { getPlanet, log } from './state.js';
import { housing } from './economy.js';
export const EVENTS = {
 signal: {title:'Signal aus der Tiefe',text:'Ein unbekanntes Signal erreicht die Empfangsstationen.',choices:[['study','Analysieren · +40 Forschung'],['contact','Antwort senden · +5 Beziehungen']]},
 storm: {title:'Stellare Plasmafront',text:'Eine seltene Plasmafront bedroht Energiespeicher und Bevölkerung.',choices:[['protect','Schutzmaßnahmen · 70 ¢'],['shield','Schirmnetz nutzen · 35 Schildpunkte'],['endure','Durchstehen · −10 % Energie, −3 Zufriedenheit']]},
 migration: {title:'Siedlerkonvoi',text:'Zwölf fremde Siedler bitten um Wohnraum. Aufnahme benötigt zwölf freie Wohnplätze und 30 Nahrung.',choices:[['welcome','Aufnehmen · 30 Nahrung, +12 Einwohner'],['decline','Weiterreise ermöglichen · keine Kosten']]},
 salvage: {title:'Verlassener Orbitalfrachter',text:'Ein aufgegebener Frachter treibt im Orbit. Seine Materialien und Daten könnten nützlich sein.',choices:[['recover','Bergen · 20 Energie → 50 Legierungen'],['study','Datenspeicher lesen · +40 Forschung'],['skip','Weiterziehen lassen']]},
 tradeOffer: {title:'Unabhängiger Versorgungskonvoi',text:'Ein Händler bietet einen einmaligen Tausch an. Dieses Angebot benötigt keine feste Frachtroute.',choices:[['buy','60 Nahrung kaufen · 80 ¢'],['sell','20 Legierungen verkaufen · +110 ¢'],['skip','Angebot ablehnen']]},
 anomaly: {title:'Subraum-Anomalie',text:'Eine kurzlebige Anomalie lässt sich mit einem energieintensiven Scan untersuchen.',choices:[['scan','Tiefenscan · 45 Energie → 90 Forschung'],['skip','Abstand halten']]},
 gridPeak: {title:'Resonanz im Energienetz',text:'Eine ungewöhnliche Resonanz bietet die Chance, die Energieausbeute vorübergehend zu erhöhen.',choices:[['harness','Stabilisieren · 30 Kristalle → +20 % Energie für 40 Tage'],['store','Spitze abschöpfen · +80 Energie']]},
 festival: {title:'Planetarer Feiertag',text:'Die Bevölkerung möchte gemeinsam feiern. Die Regierung kann Versorgung oder Steuern erleichtern.',choices:[['feast','Versorgung bereitstellen · 25 Nahrung → +8 Zufriedenheit, +3 Stabilität'],['relief','Steuerentlastung · 60 ¢ → +6 Stabilität'],['skip','Private Feiern ermöglichen']]},
 exercise: {title:'Ingenieurs- und Garnisonsprojekt',text:'Die lokalen Fachkräfte schlagen ein begrenztes Verbesserungsprojekt vor.',choices:[['defense','Verteidigung trainieren · 10 Waffen → +12 Orbitalverteidigung'],['industry','Fertigung optimieren · 15 Legierungen → +15 % Legierungsproduktion für 45 Tage'],['skip','Regulären Betrieb fortsetzen']]}
};
export const initialEventSchedule = day => ({nextDay:day+96+(day%37),history:[],counter:0});
export function tickEvents(state) {
 state.effects = state.effects.filter(e=>e.until>state.day && getPlanet(state,e.planet)?.owner==='player');
 if (state.event || state.day < state.eventSchedule.nextDay) return;
 const owned = state.planets.filter(p=>p.owner==='player'); if(!owned.length)return;
 const choices = Object.keys(EVENTS).filter(id=>!state.eventSchedule.history.includes(id));
 const seed = (state.day*37+state.eventSchedule.counter*71)%997;
 const kind=choices[seed%choices.length],planet=owned[seed%owned.length];
 state.event={kind,planet:planet.id};state.eventSchedule.counter++;state.eventSchedule.history=[...state.eventSchedule.history,kind].slice(-4);
 log(state,`${planet.name}: ${EVENTS[kind].title}. Eine Entscheidung wartet.`);
}
export function resolveEvent(state, choice) {
 const e=state.event;if(!e)return 'Es gibt keine offene Meldung.';
 const p=getPlanet(state,e.planet),def=EVENTS[e.kind];
 if(!p||p.owner!=='player'){state.event=null;state.eventSchedule.nextDay=state.day+96;return null;}
 if(!def?.choices.some(([id])=>id===choice))return 'Wähle eine gültige Antwort.';
 const spend=(key,n)=>key==='credits'?state.credits>=n:p.stock[key]>=n;
 const require=(key,n)=>spend(key,n)?null:`Es fehlen ${n} ${key==='credits'?'Credits':key==='energy'?'Energie':key==='food'?'Nahrung':key==='crystal'?'Kristalle':key==='weapons'?'Waffen':'Legierungen'}.`;
 const pay=(key,n)=>{if(key==='credits')state.credits-=n;else p.stock[key]-=n;};
 let result='Entscheidung umgesetzt.';
 const cost = e.kind==='storm'&&choice==='protect'?['credits',70]:e.kind==='migration'&&choice==='welcome'?['food',30]:e.kind==='salvage'&&choice==='recover'?['energy',20]:e.kind==='tradeOffer'&&choice==='buy'?['credits',80]:e.kind==='tradeOffer'&&choice==='sell'?['alloy',20]:e.kind==='anomaly'&&choice==='scan'?['energy',45]:e.kind==='gridPeak'&&choice==='harness'?['crystal',30]:e.kind==='festival'&&choice==='feast'?['food',25]:e.kind==='festival'&&choice==='relief'?['credits',60]:e.kind==='exercise'&&choice==='defense'?['weapons',10]:e.kind==='exercise'&&choice==='industry'?['alloy',15]:null;
 if(cost){const error=require(...cost);if(error)return error;}
 if(e.kind==='migration'&&choice==='welcome'&&housing(state,p)-p.population<12)return 'Für zwölf Siedler fehlen freie Wohnplätze.';
 if(e.kind==='storm'&&choice==='shield'&&p.shield<35)return 'Es fehlen 35 geladene Schildpunkte.';
 if(cost)pay(...cost);
 if(e.kind==='signal'){if(choice==='study')state.science+=40;else for(const r of Object.values(state.relations))if(!r.war)r.score=Math.min(100,r.score+5);}
 if(e.kind==='storm'){if(choice==='shield')p.shield-=35;if(choice==='endure'){p.stock.energy*=.9;p.happiness=Math.max(5,p.happiness-3);}}
 if(e.kind==='migration'&&choice==='welcome'){p.aliens=(p.aliens*p.population+12)/(p.population+12);p.population+=12;}
 if(e.kind==='salvage'){if(choice==='recover')p.stock.alloy+=50;if(choice==='study')state.science+=40;}
 if(e.kind==='tradeOffer'){if(choice==='buy')p.stock.food+=60;if(choice==='sell')state.credits+=110;}
 if(e.kind==='anomaly'&&choice==='scan')state.science+=90;
 const effect = e.kind==='gridPeak'&&choice==='harness'?{id:'energyHarvest',planet:p.id,until:state.day+40}:e.kind==='exercise'&&choice==='industry'?{id:'factoryUpgrade',planet:p.id,until:state.day+45}:null;
 if(effect){state.effects=state.effects.filter(q=>q.id!==effect.id||q.planet!==p.id);state.effects.push(effect);}
 if(e.kind==='gridPeak'&&choice==='store')p.stock.energy+=80;
 if(e.kind==='festival'){if(choice==='feast'){p.happiness=Math.min(100,p.happiness+8);state.player.stability=Math.min(100,state.player.stability+3);}if(choice==='relief')state.player.stability=Math.min(100,state.player.stability+6);}
 if(e.kind==='exercise'&&choice==='defense')p.defense+=12;
 result=def.choices.find(([id])=>id===choice)[1];log(state,`${p.name}: ${result}.`,'info');
 state.event=null;state.eventSchedule.nextDay=state.day+84+(state.eventSchedule.counter*29+state.day*7)%61;return null;
}
