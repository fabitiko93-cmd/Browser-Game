import { activeShip, commandedShips, commandStatus, demoTarget } from './battle-demo.js';

export function commandDisplay(battle) {
  const selected=battle.ships.find(s=>s.id===battle.selected),chosen=battle.ships.find(s=>s.id===battle.target);
  const recipients=commandedShips(battle),available=recipients.filter(s=>s.order!=='retreat');
  const manual=available.filter(s=>s.targeting==='target'&&s.commandTarget===chosen?.id);
  const automatic=available.filter(s=>s.targeting==='auto'&&demoTarget(battle,s)?.id===chosen?.id);
  const actual=selected&&demoTarget(battle,selected);
  let label=selected?commandStatus(battle,selected).label:'Kein aktives Schiff';
  if(battle.scope==='ship'&&selected?.targeting==='auto'&&!selected.priority&&selected.order!=='retreat') label=actual?`Auto → ${actual.name}`:'Auto · sucht erreichbares Ziel';
  if(battle.scope==='fleet') {
    const modes=new Set(recipients.map(s=>`${s.order}:${s.targeting}:${s.commandTarget}:${s.priority}`));
    label=modes.size>1?'Flotte · unterschiedliche Aufträge':recipients.length?recipients[0].targeting==='auto'&&recipients[0].order!=='retreat'?'Flotte · individuelle Auto-Ziele':`Flotte · ${commandStatus(battle,recipients[0]).label}`:'Flotte außer Gefecht';
  }
  return {label,canAttack:battle.phase==='engaged'&&available.length>0&&Boolean(chosen&&activeShip(chosen)),canCommand:battle.phase==='engaged'&&available.length>0,
    auto:available.length>0&&available.every(s=>s.targeting==='auto'),
    chosenState:chosen&&!activeShip(chosen)?'Zerstört':manual.length?battle.scope==='fleet'?`${manual.length} Schiffe greifen an`:'Angriff befohlen':automatic.length?battle.scope==='fleet'?`Auto · ${automatic.length} ${automatic.length===1?'Schiff':'Schiffe'}`:'Auto greift an':'Kein manueller Auftrag'};
}
