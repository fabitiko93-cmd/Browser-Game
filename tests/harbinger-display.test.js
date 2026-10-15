import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoBattle,advanceDemoBattle,selectDemoShip,commandDemo,demoTarget} from '../src/battle-demo.js';
import {commandDisplay} from '../src/harbinger-display.js';
test('inspecting a different contact preserves real automatic target',()=>{
 const battle=createDemoBattle();advanceDemoBattle(battle,.3);const ship=battle.ships[0],actual=demoTarget(battle,ship);
 selectDemoShip(battle,'revenant');assert.equal(ship.targeting,'auto');assert.equal(commandDisplay(battle).chosenState,'Kein manueller Auftrag');assert.equal(commandDisplay(battle).label,`Auto → ${actual.name}`);
 selectDemoShip(battle,actual.id);assert.equal(commandDisplay(battle).chosenState,'Auto greift an');
});
test('fleet orders persist when inspecting another contact and auto clears them',()=>{
 const battle=createDemoBattle();commandDemo(battle,'scope','fleet');selectDemoShip(battle,'revenant');commandDemo(battle,'attack');
 assert.equal(commandDisplay(battle).chosenState,'4 Schiffe greifen an');selectDemoShip(battle,'viper');assert.equal(commandDisplay(battle).chosenState,'Kein manueller Auftrag');assert.match(commandDisplay(battle).label,/Revenant/);
 commandDemo(battle,'auto');assert.equal(commandDisplay(battle).label,'Flotte · individuelle Auto-Ziele');assert.ok(commandDisplay(battle).auto);
});
test('retreating recipients cannot receive an incompatible attack',()=>{
 const battle=createDemoBattle();commandDemo(battle,'scope','fleet');commandDemo(battle,'retreat');assert.equal(commandDisplay(battle).canAttack,false);assert.equal(commandDisplay(battle).canCommand,false);
});
test('destroyed chosen contact remains identified and cannot be attacked',()=>{
 const battle=createDemoBattle();battle.ships.find(s=>s.id===battle.target).hull=0;assert.equal(commandDisplay(battle).chosenState,'Zerstört');assert.equal(commandDisplay(battle).canAttack,false);
});
