import test from 'node:test';
import assert from 'node:assert/strict';
import { effectValueMarkup, policyEffectMarkup, technologyEffectMarkup, eventEffectMarkup } from '../src/effect-ui.js';
import { createGame } from '../src/state.js';
import { renderSheet } from '../src/ui.js';

test('modifier colors describe benefit, including both directions of maintenance and duration changes', () => {
  for (const key of ['fleetUpkeep','buildingUpkeep','upkeep','foodDemand','researchTime','shipTime','travelTime','inputEnergy','inputOre','inputAlloy','reformCost','reformStability','fuel','travelSupply']) {
    assert.ok(effectValueMarkup(key,.85,'−15 %').includes('effect-benefit'), key);
    assert.ok(effectValueMarkup(key,1.15,'+15 %').includes('effect-penalty'), key);
    assert.ok(effectValueMarkup(key,1,'+0 %').includes('effect-neutral'), key);
  }
  for (const key of ['growth','science','workers','housing','production','trade','tax','combat','energy']) {
    assert.ok(effectValueMarkup(key,1.1,'+10 %').includes('effect-benefit'), key);
    assert.ok(effectValueMarkup(key,.9,'−10 %').includes('effect-penalty'), key);
  }
  assert.ok(effectValueMarkup('happiness',-8,'−8 Punkte').includes('effect-penalty'));
  assert.ok(effectValueMarkup('armor',.05,'+5 Prozentpunkte').includes('effect-benefit'));
});
test('effect labels stay neutral and only signed values carry semantic colors', () => {
  const policy = policyEffectMarkup({growth:1.1,fleetUpkeep:1.15,shipTime:.85,happiness:-8});
  assert.match(policy, /Bevölkerungswachstum <span class="effect-value effect-benefit"[^>]*>\+10 %<\/span>/);
  assert.match(policy, /Flottenunterhalt <span class="effect-value effect-penalty"[^>]*>\+15 %<\/span>/);
  assert.match(policy, /Schiffbauzeit <span class="effect-value effect-benefit"[^>]*>−15 %<\/span>/);
  assert.ok(technologyEffectMarkup({buildingUpkeep:.94}).includes('effect-benefit'));
  assert.ok(eventEffectMarkup('Durchstehen · −10 % Energie, −3 Zufriedenheit').includes('effect-penalty'));
  assert.ok(eventEffectMarkup('Stabilisieren · 30 Kristalle → +20 % Energie').includes('30 Kristalle → <span class="effect-value effect-benefit"'));
});
test('research, government, laws, decisions and event views all use the modifier color convention', () => {
  const s=createGame(),base={planetId:'nereid',fleetIds:[]};
  s.player.ideology='technocracy';s.tech=['habitats'];
  for (const ui of [{panel:'economy',economyMode:'research',researchBranch:'colonies'},{panel:'politics',politicsMode:'government'},{panel:'politics',politicsMode:'laws'},{panel:'politics',politicsMode:'decisions'}]) {
    const html=renderSheet(s,{...base,...ui});
    assert.ok(html.includes('effect-benefit'),JSON.stringify(ui));
    if (ui.panel==='politics') assert.ok(html.includes('effect-penalty'),JSON.stringify(ui));
  }
  const research=renderSheet(s,{...base,panel:'economy',economyMode:'research',researchBranch:'colonies'});
  assert.ok(research.includes('tech-completion">ERFORSCHT'));
  s.event={kind:'storm',planet:'nereid'};
  assert.ok(renderSheet(s,{...base,panel:'event'}).includes('effect-penalty'));
});
