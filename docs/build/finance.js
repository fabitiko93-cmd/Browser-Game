import { BUILDINGS, RESOURCE_KEYS, RESOURCES } from './data.js';
import { BASE_PRICES } from './development-data.js';
import { serviceCount } from './infrastructure.js';
import { log } from './state.js';

export const treasury = (state, owner = 'player') => owner === 'player' ? state.credits : state.factions[owner]?.credits ?? 0;
export function financialCondition(state, owner = 'player') {
  const cash = treasury(state, owner);
  const population = state.planets.filter(p => p.owner === owner && !p.destroyed).reduce((n,p) => n + p.population, 0);
  const severe = cash < -Math.max(150, population * 1.5);
  return { debt: Math.max(0,-cash), crisis: cash < 0, severe, production: cash < 0 ? severe ? .5 : .8 : 1, science: cash < 0 ? severe ? 0 : .5 : 1, interest: Math.max(0,-cash) * .001 };
}
export const essentialBuilding = type => Boolean(BUILDINGS[type].housing || BUILDINGS[type].output?.food || BUILDINGS[type].output?.energy || ['health','civic','communication'].includes(BUILDINGS[type].service));
export function commerceIncome(planet, fed = true) {
  return planet.population * .018 * Math.max(.2, planet.happiness / 100) * (fed ? 1 : .35) * (1 + .12 * Math.min(2, serviceCount(planet,'trade')));
}
export function advanceLocalMarket(planet, day) {
  if (!planet.owner || planet.destroyed) return;
  planet.localMarket ??= { cash: Math.min(150, planet.population * .6), day: -1, sold: 0 };
  planet.localMarket.cash = Math.min(200, planet.population * .8, planet.localMarket.cash + planet.population * .012);
  if (planet.localMarket.day !== day) planet.localMarket.sold = 0;
}
export function localSaleQuote(state, p, resource, quantity = 25) {
  if (!p || p.owner !== 'player' || p.destroyed || !RESOURCE_KEYS.includes(resource) || !Number.isFinite(quantity) || quantity <= 0) return { amount:0,price:0,total:0 };
  const market=p.localMarket ?? { cash:Math.min(150,p.population*.6), day:-1, sold:0 };
  const used=market.day===state.day?market.sold:0;
  // Local buyers have a small, replenishing civilian budget; dumping goods is deliberately discounted.
  const price=BASE_PRICES[resource]*.38;
  const amount=Math.max(0,Math.min(quantity,50-used,p.stock[resource],market.cash/price));
  return {amount,price,total:amount*price};
}
export function localSale(state,p,resource,quantity=25) {
  const q=localSaleQuote(state,p,resource,quantity);
  if(!q.amount)return 'Keine örtlichen Käufer, Ware oder freie Tagesmenge verfügbar.';
  p.localMarket??={cash:Math.min(150,p.population*.6),day:-1,sold:0};
  if(p.localMarket.day!==state.day){p.localMarket.day=state.day;p.localMarket.sold=0;}
  p.localMarket.sold+=q.amount;p.localMarket.cash=Math.max(0,p.localMarket.cash-q.total);p.stock[resource]-=q.amount;state.credits+=q.total;
  log(state,`${p.name}: ${q.amount.toFixed(1)} ${RESOURCES[resource].name} an örtliche Privatkäufer verkauft, +${q.total.toFixed(1)} Credits.`,'success');
  return null;
}
export function austerity(state) {
  let count=0;
  for(const p of state.planets.filter(p=>p.owner==='player'))for(const b of p.buildings)if(b.enabled&&!essentialBuilding(b.type)){b.enabled=false;b.status='pausiert';count++;}
  if(!count)return 'Alle nicht notwendigen Anlagen sind bereits pausiert.';
  log(state,`Sparbetrieb: ${count} nicht notwendige Anlagen pausiert. Du kannst sie einzeln wieder einschalten.`,'warning');return null;
}
