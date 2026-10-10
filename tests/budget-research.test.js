import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { forecastDay } from '../src/budget.js';
import { stepDay } from '../src/simulation.js';
import { buildShip, orderFleet, cargoCapacity, fleetStrength, shipArmor } from '../src/fleets.js';
import { startResearch, researchDays } from '../src/research.js';
import { researchBlock, technologyEffects } from '../src/technology.js';
import { TECHNOLOGIES, RESEARCH_BRANCHES } from '../src/technology-data.js';
import { diplomaticAction } from '../src/politics.js';
import { quoteSale } from '../src/trade.js';
import { decide, policyEffects } from '../src/governance.js';
import { parseImport, exportGame } from '../src/save.js';
import { renderResources, renderSheet, signed } from '../src/ui.js';
const home = s => getPlanet(s, 'nereid');
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const ship = (s, type = 'cruiser') => { const f = { id: type, type, name: type, owner: 'player', planetId: 'nereid', hp: 100, supply: 100, mission: null, route: null }; s.fleets.push(f); return f; };
const progress = (s, n) => { for (let i = 0; i < n; i++) stepDay(s); };

test('regression: a positive planetary surplus cannot conceal a negative imperial budget', () => {
  const s = createGame(); s.player.tax=.15; ship(s); const before = s.credits;
  const snapshot = exportGame(s), forecast = forecastDay(s);
  assert.equal(exportGame(s), snapshot);
  const r = forecast.planets[0].lastReport;
  assert.ok(r.income - r.upkeep > 0); assert.ok(forecast.budget.net < 0);
  assert.equal(forecast.budget.fleets, 8);
  stepDay(s); close(s.credits - before, forecast.budget.net);
  assert.ok(renderResources(s, {planetId:'nereid'}).includes('resource-trend negative'));
});
test('all colonies share one budget; deficit and surplus do not depend on iteration order', () => {
  const s = createGame(), colony = getPlanet(s, 'cinder');
  colony.owner = 'player'; colony.population = 10; colony.stock = {...home(s).stock};
  colony.buildings = structuredClone(home(s).buildings);
  s.credits = 1;
  const reversed = structuredClone(s); reversed.planets.reverse();
  const f = forecastDay(s); assert.ok(f.budget.income > home(s).population * s.player.tax);
  stepDay(s); stepDay(reversed); close(s.credits, reversed.credits);
  close(s.lastDayReport.net, f.budget.net); assert.ok(s.credits < 0);
});
test('HUD and economy rates predict the same next-day consumption, including maintenance and completed construction', () => {
  const s = createGame(); s.fleets[0].hp = 65; s.fleets[0].supply = 30;
  home(s).buildings.push({id:'new',type:'solar',x:7,y:7,remaining:1,enabled:true,status:'Bau'});
  const forecast = forecastDay(s), before = {...home(s).stock}, credit = s.credits;
  const ui = {planetId:'nereid',projection:forecast,panel:'economy',economyMode:'production'};
  const hud = renderResources(s, ui), panel = renderSheet(s, ui);
  assert.ok(hud.includes(`${signed(forecast.budget.net)} ¢`)); assert.ok(panel.includes('Reichshaushalt / Tag'));
  stepDay(s); close(s.credits - credit, forecast.budget.net);
  for (const resource of Object.keys(before)) close(home(s).stock[resource] - before[resource], forecast.planets[0].net[resource]);
});
test('next-day forecasts stay accurate through program expiry, growth, shortages and bankruptcy', () => {
  const s = createGame(); ship(s); decide(s, 'industry'); s.credits = 30;
  for (let i = 0; i < 40; i++) {
    const forecast = forecastDay(s), before = s.credits, stocks = {...home(s).stock}; stepDay(s);
    close(s.credits - before, forecast.budget.actual);
    for (const k of Object.keys(stocks)) close(home(s).stock[k] - stocks[k], forecast.planets[0].net[k]);
  }
});
test('trade deliveries appear as single bookings instead of a misleading permanent credit rate', () => {
  const s = createGame(); diplomaticAction(s, 'ilyri', 'trade');
  assert.equal(orderFleet(s, ['starter-f'], 'thalassa', 'transport', {resource:'alloy',amount:20}), null);
  s.fleets[1].mission.remaining = 1; const f = forecastDay(s); const before = s.credits;
  stepDay(s); close(s.lastDayReport.oneOff, s.tradeLedger[0].revenue);
  close(s.credits - before, f.budget.actual + s.lastDayReport.oneOff);
  const panel = renderSheet(s, {panel:'economy',economyMode:'production',planetId:'nereid'});
  assert.ok(panel.includes('Einzelbuchungen')); assert.deepEqual(parseImport(exportGame(s)), s);
});
test('78 technology nodes form an acyclic dependency graph with seven exclusive specializations', () => {
  assert.equal(Object.keys(TECHNOLOGIES).length, 78); assert.equal(Object.keys(RESEARCH_BRANCHES).length, 10);
  const visited = new Set(), visiting = new Set();
  function visit(id) {
    assert.ok(TECHNOLOGIES[id], id); if (visited.has(id)) return; assert.ok(!visiting.has(id), `Cycle: ${id}`); visiting.add(id);
    for (const prerequisite of [...TECHNOLOGIES[id].requires,...(TECHNOLOGIES[id].requiresAny ?? [])]) visit(prerequisite);
    for (const other of TECHNOLOGIES[id].excludes ?? []) assert.ok(TECHNOLOGIES[other].excludes.includes(id));
    visiting.delete(id); visited.add(id);
  }
  for (const id of Object.keys(TECHNOLOGIES)) visit(id);
  assert.equal(visited.size, 78);
});
test('both directions in every specialization remain playable through advanced cross-branch research', () => {
  for (const reverse of [false, true]) {
    const s = createGame(); const entries = Object.keys(TECHNOLOGIES); if (reverse) entries.reverse();
    for (let pass = 0; pass < 20; pass++) {
      let advanced = false;
      for (const id of entries) if (!researchBlock(s, id)) { s.science = 10000; assert.equal(startResearch(s, id), null); progress(s, s.research.remaining); advanced = true; }
      if (!advanced) break;
    }
    assert.equal(s.tech.length, 71); assert.equal(Object.keys(TECHNOLOGIES).filter(id => !s.tech.includes(id)).length, 7);
    assert.deepEqual(parseImport(exportGame(s)), s);
  }
});
test('research prerequisites, exclusive choices and insufficient points reject without taking resources', () => {
  const s = createGame(); s.science = 500;
  let before = exportGame(s); assert.ok(startResearch(s, 'plasma')); assert.equal(exportGame(s), before);
  s.tech = ['grid','fusion','photovoltaics']; before = exportGame(s);
  assert.ok(startResearch(s, 'reactorLoops')); assert.equal(exportGame(s), before);
  s.tech = []; s.science = 0; before = exportGame(s); assert.ok(startResearch(s, 'grid')); assert.equal(exportGame(s), before);
  s.tech = ['grid','fusion','photovoltaics','reactorLoops']; assert.throws(() => parseImport(exportGame(s)));
});
test('technology effects change specific resource chains, cargo, damage and travel without instant maximal bonuses', () => {
  const s = createGame(), base = forecastDay(s); s.tech = ['grid','fusion','targeting','lasers','communications','logistics'];
  const f = forecastDay(s); assert.ok(f.planets[0].net.energy > base.planets[0].net.energy);
  assert.ok(technologyEffects(s).energy < 1.2); assert.ok(technologyEffects(s).combat < 1.2);
  assert.equal(cargoCapacity(s, 'freighter'), 88); assert.ok(fleetStrength(s, s.fleets[0]) > 18);
  s.tech.push('shielding'); assert.equal(shipArmor(s, s.fleets[0]), .05);
  s.tech.push('engineTuning','propulsion','ecoDrive'); const before = home(s).stock.energy;
  assert.equal(orderFleet(s,['starter-f'],'cinder'), null); close(before-home(s).stock.energy, 7.2);
});
test('technocracy has visible and actual science, development and energy-efficiency advantages', () => {
  const normal = createGame(), tech = structuredClone(normal); tech.player.ideology = 'technocracy';
  const baseline = forecastDay(normal), advanced = forecastDay(tech);
  close(advanced.budget.science, 5); assert.ok(advanced.budget.science > baseline.budget.science);
  assert.ok(researchDays(tech,'quantumModels') < researchDays(normal,'quantumModels'));
  assert.ok(advanced.planets[0].net.energy > baseline.planets[0].net.energy);
  const markup = renderSheet(tech,{panel:'politics',politicsMode:'government',planetId:'nereid',government:'technocracy'});
  assert.ok(markup.includes('× 1.25')); assert.ok(markup.replace(/<[^>]*>/g, '').includes('Fabrik-Energiebedarf −8 %'));
});
test('v2 saves retain completed technologies and pending research when adding the new prerequisite roots', () => {
  const old = createGame(); old.version = 2; old.tech = ['fusion','lasers','propulsion','habitats'];
  old.research = null; old.lastDayReport = null;
  const loaded = parseImport(exportGame(old)); assert.equal(loaded.version, 8);
  for (const id of [...old.tech,'grid','targeting','engineTuning']) assert.ok(loaded.tech.includes(id));
  assert.deepEqual(loaded.planets, old.planets); assert.deepEqual(loaded.fleets, old.fleets);
  old.tech = []; old.research = {id:'fusion',remaining:3,total:6};
  const pending = parseImport(exportGame(old)); assert.deepEqual(pending.research, old.research); assert.deepEqual(pending.tech,['grid']);
  progress(pending,3); assert.ok(pending.tech.includes('fusion')); assert.deepEqual(parseImport(exportGame(pending)),pending);
});
test('every research branch renders traceable prerequisites and a limited specialization', () => {
  const s = createGame();
  for (const branch of Object.keys(RESEARCH_BRANCHES)) {
    const html = renderSheet(s,{panel:'economy',economyMode:'research',planetId:'nereid',researchBranch:branch});
    assert.ok(!html.includes('undefined')); assert.ok(!html.includes('NaN'));
    assert.equal((html.match(/data-tech-id=/g) ?? []).length, Object.values(TECHNOLOGIES).filter(t=>t.branch===branch).length); assert.ok(html.includes('data-action="research-focus"'));
  }
});

test('research layout shows every real technology once, orders foundations first and joins exclusive choices', async () => {
  const { researchLayout, researchPanel } = await import('../src/research-ui.js');
  const s = createGame();
  for (const branch of Object.keys(RESEARCH_BRANCHES)) {
    const found = [];
    const visit = unit => {
      found.push(...unit.ids);
      if (unit.parent) for (const id of unit.ids) {
        const t = TECHNOLOGIES[id];
        assert.ok([...t.requires, ...(t.requiresAny ?? [])].some(required => unit.parent.ids.includes(required)));
      }
      if (unit.ids.length === 2) assert.ok(TECHNOLOGIES[unit.ids[0]].excludes.includes(unit.ids[1]));
      unit.children.forEach(visit);
    };
    researchLayout(branch).forEach(visit);
    assert.deepEqual(found.toSorted(), Object.keys(TECHNOLOGIES).filter(id => TECHNOLOGIES[id].branch === branch).sort());
    const html = researchPanel(s, { researchBranch: branch });
    const rendered = [...html.matchAll(/data-tech-id="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(rendered.toSorted(), found.toSorted());
    for (const id of rendered) for (const required of TECHNOLOGIES[id].requires) {
      if (TECHNOLOGIES[required].branch === branch) assert.ok(rendered.indexOf(required) < rendered.indexOf(id));
    }
    assert.ok(!html.includes('tech-tier'));
  }
  const colonyHtml = researchPanel(s, { researchBranch: 'colonies' });
  assert.ok(colonyHtml.indexOf('data-tech-id="habitats"') < colonyHtml.indexOf('data-tech-id="consumerCulture"'));
  assert.ok(colonyHtml.includes('class="tech-merge"'));
  assert.ok(colonyHtml.includes('Benötigt: Mineralische Tiefenscans'));
});

test('research cost colors use actual points independently of prerequisite locks and preserve action guards', async () => {
  const { researchPanel } = await import('../src/research-ui.js');
  const s = createGame(); s.science = 65;
  const card = id => researchPanel(s, { researchBranch: 'colonies' }).match(new RegExp(`<details data-tech-id="${id}"[\\s\\S]*?</details>`))[0];
  assert.ok(card('hydroponics').includes('class="tech-cost-amount enough"'));
  assert.ok(card('hydroponics').includes('data-tech="hydroponics" disabled'));
  assert.ok(card('compactCities').includes('class="tech-cost-amount short"'));
  assert.ok(card('hydroponics').includes('>65</span> Forschung'));
  s.tech = ['habitats'];
  assert.ok(!card('hydroponics').includes('data-tech="hydroponics" disabled'));
  assert.ok(card('habitats').includes('aria-label="Erforscht">✓'));
  assert.ok(!card('habitats').includes('tech-cost-amount'));
  s.research = { id: 'hydroponics', remaining: 3, total: 5 };
  assert.ok(card('hydroponics').includes('Noch 3 Tage'));
  assert.ok(!card('hydroponics').includes('research-start'));
  s.tech.push('compactCities');
  assert.ok(card('biospheres').includes('Andere Richtung gewählt'));
});
