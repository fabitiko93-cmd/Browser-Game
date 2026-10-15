import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createBattleTrial } from '../src/battle-trial.js';
import { commandDemo } from '../src/battle-demo.js';
import { battleSelection, recipientInfo } from '../src/battle-selection.js';
import { BattleSelectionOverlay } from '../src/battle-selection-scene.js';

test('no implicit selection or camera focus draws tactical links or changes orders',()=>{
 const b=createBattleTrial(),before=JSON.stringify(b);
 assert.deepEqual(battleSelection(b,null),{sources:[],targets:[],links:[]});
 const selected=battleSelection(b,{scope:'ship',selected:b.selected});assert.deepEqual(selected.sources,[b.selected]);assert.equal(selected.links.length,1);assert.equal(selected.targets.length,1);
 assert.equal(JSON.stringify(b),before);
});
test('a paused manual order immediately links its actual recipient and preserves an out-of-range target',()=>{
 const b=createBattleTrial(),target=b.ships.find(s=>s.side==='enemy'&&s.id!==b.target);b.target=target.id;
 assert.ok(commandDemo(b,'attack'));const before=JSON.stringify(b),selection={scope:'ship',selected:b.selected};
 assert.equal(battleSelection(b,selection).links[0].target,target.id);assert.equal(JSON.stringify(b),before);
 target.position[2]=-10000;const state=battleSelection(b,selection);assert.ok(state.links[0].waiting);assert.deepEqual(state.targets,[target.id]);assert.equal(b.tick,0);
});
test('fleet links have no eight-ship cutoff and drop dead, escaped, unarmed or retreating attackers',()=>{
 const b=createBattleTrial({scenario:'50v50'}),selection={scope:'fleet',selected:b.selected};
 const all=battleSelection(b,selection);assert.equal(all.sources.length,50);assert.equal(all.links.length,50);assert.equal(new Set(all.targets).size,all.targets.length);
 const own=b.ships.filter(s=>s.side==='friendly');own[0].hull=0;own[1].escaped=true;own[2].combat.power=0;own[3].order='retreat';
 const changed=battleSelection(b,selection);assert.equal(changed.sources.length,48);assert.equal(changed.links.length,46);assert.ok(changed.links.every(l=>!own.slice(0,4).some(s=>s.id===l.source)));
 const target=b.ships.find(s=>s.id===changed.targets[0]);target.hull=0;assert.ok(!battleSelection(b,selection).targets.includes(target.id));
});
test('class orders and supply blocks retain their real recipients in the menu summary',()=>{
 const b=createBattleTrial();commandDemo(b,'scope','fleet');assert.ok(commandDemo(b,'priority','destroyer'));
 const selection=battleSelection(b,{scope:'fleet',selected:b.selected});assert.ok(selection.links.length>0);assert.ok(selection.links.every(l=>b.ships.find(s=>s.id===l.target).strategicType==='destroyer'));
 const own=b.ships.filter(s=>s.side==='friendly');own[1].supply=0;own[2].combat.power=0;own[3].order='retreat';
 const info=recipientInfo(b);assert.equal(info.ships.length,20);assert.equal(info.available.length,19);assert.equal(info.armed.length,18);assert.deepEqual(info.blocked.map(s=>s.id),[own[1].id]);assert.deepEqual(info.costs,[8]);
});
test('selection geometry reuses fixed buffers, shows every selected target and clears completely',()=>{
 const b=createBattleTrial({scenario:'50v50'}),overlay=new BattleSelectionOverlay(new THREE.Scene()),selection={scope:'fleet',selected:b.selected};
 const lines=overlay.lines.geometry.attributes.position,distances=overlay.lines.geometry.attributes.lineDistance,points=overlay.points.geometry.attributes.position;
 overlay.update(b,selection,true,1);assert.equal(overlay.lines.geometry.drawRange.count,100);assert.equal(overlay.points.geometry.drawRange.count,overlay.state.sources.length+overlay.state.targets.length);assert.ok(overlay.lines.visible&&overlay.points.visible);
 const target=b.ships.find(s=>s.id===overlay.state.links[0].target);target.position[0]+=10;overlay.update(b,selection,true,2,false);
 assert.equal(overlay.lines.geometry.attributes.position,lines);assert.equal(overlay.lines.geometry.attributes.lineDistance,distances);assert.equal(overlay.points.geometry.attributes.position,points);assert.equal(overlay.lines.visible,false);assert.ok(overlay.points.visible);assert.equal(overlay.points.material.uniforms.pixelRatio.value,2);
 overlay.update(b,null,true,1);assert.equal(overlay.lines.geometry.drawRange.count,0);assert.equal(overlay.points.geometry.drawRange.count,0);assert.equal(overlay.lines.visible,false);assert.equal(overlay.points.visible,false);
 overlay.lines.geometry.dispose();overlay.lines.material.dispose();overlay.points.geometry.dispose();overlay.points.material.dispose();
});
