import { policyEffects } from './governance.js';
import { technologyEffects } from './technology.js';
export function exportPrice(state, resource, faction) { return (resource === 'weapons' ? 6 : resource === 'alloy' ? 4 : 2) * policyEffects(state).trade * technologyEffects(state).trade * (state.relations[faction]?.cooperation && !state.relations[faction]?.embargo ? 1.12 : 1); }
