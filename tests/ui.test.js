import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../src/state.js';
import { renderSheet, renderHeader, renderNavigation, renderMapHead, renderMapFoot, renderResources } from '../src/ui.js';

const makeUI = () => ({ view: 'planet', planetId: 'nereid', systemId: 'helios', panel: 'economy', economyMode: 'production', politicsMode: 'government', fleetMode: 'orders', fleetIds: [], government: 'democracy', detailType: 'farm', routeFleet: 'starter-f', routeTarget: 'thalassa', fleetTarget: 'cinder', cargo: 'ore', amount: 40, repeat: true, speed: 0, lastSpeed: 1, hints: true });
test('every implemented management view renders complete controls from a real game state', () => {
  const state = createGame(); const ui = makeUI();
  for (const [panel, mode, value] of [
    ['build'], ['build-detail'], ['economy', 'economyMode', 'production'], ['economy', 'economyMode', 'research'], ['economy', 'economyMode', 'routes'],
    ['politics', 'politicsMode', 'government'], ['politics', 'politicsMode', 'diplomacy'], ['fleet', 'fleetMode', 'orders'], ['fleet', 'fleetMode', 'shipyard'], ['planet-info'], ['settings']
  ]) {
    ui.panel = panel; if (mode) ui[mode] = value;
    const html = renderSheet(state, ui);
    assert.ok(html.includes('sheet-content'));
    assert.ok(!html.includes('undefined')); assert.ok(!html.includes('NaN'));
    assert.ok(html.includes('data-action="close"'));
  }
  for (const render of [renderHeader, renderResources, renderMapHead, renderMapFoot]) assert.equal(typeof render(state, ui), 'string');
  assert.equal(typeof renderNavigation(ui), 'string');
});
test('user-controlled names and log text are escaped in rendered markup', () => {
  const state = createGame(); const ui = makeUI(); ui.panel = 'settings';
  state.player.name = '<img src=x onerror=alert(1)>';
  state.logs[0].text = '<script>bad()</script>';
  const html = renderSheet(state, ui);
  assert.ok(!html.includes('<img src=x')); assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;img')); assert.ok(html.includes('&lt;script&gt;'));
});
