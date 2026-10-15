import { activeShip, commandedShips, commandStatus, demoTarget, armedShip } from './battle-demo.js';

export function commandDisplay(battle) {
  const selected=battle.ships.find(s=>s.id===battle.selected),chosen=battle.ships.find(s=>s.id===battle.target);
  const recipients=commandedShips(battle),available=recipients.filter(s=>s.order!=='retreat');
  const armed=available.filter(armedShip);
  const manual=armed.filter(s=>s.targeting==='target'&&s.commandTarget===chosen?.id);
  const automatic=armed.filter(s=>s.targeting==='auto'&&demoTarget(battle,s)?.id===chosen?.id);
  const actual=selected&&demoTarget(battle,selected);
  let label=selected?commandStatus(battle,selected).label:'Kein aktives Schiff';
  if(battle.scope==='ship'&&selected&&armedShip(selected)&&selected?.targeting==='auto'&&!selected.priority&&selected.order!=='retreat') label=actual?`Auto → ${actual.name}`:'Auto · sucht erreichbares Ziel';
  if(battle.scope==='fleet'||battle.scope==='group') {
    const unit=battle.scope==='group'?'Verband':'Flotte';
    const modes=new Set(recipients.map(s=>`${s.order}:${s.targeting}:${s.commandTarget}:${s.priority}`));
    label=modes.size>1?`${unit} · unterschiedliche Aufträge`:recipients.length?recipients[0].targeting==='auto'&&recipients[0].order!=='retreat'?`${unit} · individuelle Auto-Ziele`:`${unit} · ${commandStatus(battle,recipients[0]).label}`:`${unit} außer Gefecht`;
  }
  return {label,canAttack:battle.phase==='engaged'&&armed.length>0&&Boolean(chosen&&activeShip(chosen)),canCommand:battle.phase==='engaged'&&available.length>0,
    canAuto:battle.phase==='engaged'&&armed.length>0,canRetreat:battle.phase==='engaged'&&available.length>0&&available.every(s=>!s.combat||s.supply>=s.combat.retreatFuel),
    auto:armed.length>0&&armed.every(s=>s.targeting==='auto'),
    chosenState:chosen&&!activeShip(chosen)?'Zerstört':manual.length?battle.scope!=='ship'?`${manual.length} Schiffe greifen an`:'Angriff befohlen':automatic.length?battle.scope!=='ship'?`Auto · ${automatic.length} ${automatic.length===1?'Schiff':'Schiffe'}`:'Auto greift an':'Kein manueller Auftrag'};
}
