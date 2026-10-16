// One hierarchy is used in planning and in combat. Ship rows always stay with
// their group; searches expand matches without creating a second flat table.
export function createRoster(root, groups, ships, { groupAttribute, shipAttribute, expanded = new Set(), onToggle = () => {} }) {
  root.replaceChildren(); const shipButtons = new Map(), groupButtons = new Map(), sections = [];
  const entries = [...groups]; if (ships.some(s => !entries.some(g => g.id === (s.groupId ?? s.group)))) entries.push({ id: '', name: 'Einzelne Schiffe' });
  for (const group of entries) {
    const members = ships.filter(s => (s.groupId ?? s.group ?? '') === group.id);
    const section = document.createElement('section'); section.className = 'roster-group';
    const heading = document.createElement('div'); heading.className = 'roster-heading';
    const button = document.createElement('button'), name = document.createElement('span'), count = document.createElement('small');
    name.textContent = group.name; count.textContent = `${members.length} Schiffe`; button.append(name, count);
    if (group.id) { button.setAttribute(groupAttribute, group.id); groupButtons.set(group.id, button); }
    else button.disabled = true;
    heading.append(button); section.append(heading);
    const list = document.createElement('div'); list.className = 'roster-members';
    for (const ship of members) {
      const row = document.createElement('button'), label = document.createElement('span'), detail = document.createElement('small');
      row.setAttribute(shipAttribute, ship.id); label.textContent = ship.name; row.append(label, detail); list.append(row); shipButtons.set(ship.id, row);
    }
    section.append(list);
    const toggle = document.createElement('button'); toggle.className = 'roster-expand'; toggle.textContent = 'Weitere Schiffe';
    toggle.addEventListener('click', () => { if (expanded.has(group.id)) expanded.delete(group.id); else expanded.add(group.id); onToggle(); });
    section.append(toggle); root.append(section); sections.push({ group, members, section, toggle });
  }
  return { shipButtons, groupButtons, sections, expanded };
}

export function filterRoster(roster, query = '') {
  const term = query.trim().toLocaleLowerCase('de'); let total = 0;
  for (const { group, members, section, toggle } of roster.sections) {
    const groupMatch = term && group.name.toLocaleLowerCase('de').includes(term);
    let matches = 0;
    for (const ship of members) {
      const match = !term || groupMatch || `${ship.name} ${ship.className ?? ''}`.toLocaleLowerCase('de').includes(term);
      const row = roster.shipButtons.get(ship.id); row.hidden = !match || !term && !roster.expanded.has(group.id) && matches >= 4;
      if (match) { matches++; total++; }
    }
    section.hidden = Boolean(term && !matches && !groupMatch);
    toggle.hidden = Boolean(term) || members.length <= 4;
    toggle.textContent = roster.expanded.has(group.id) ? 'Weniger anzeigen' : `Alle ${members.length} Schiffe anzeigen`;
    toggle.setAttribute('aria-expanded', String(roster.expanded.has(group.id)));
  }
  return total;
}
