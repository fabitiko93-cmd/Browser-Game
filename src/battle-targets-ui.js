import { activeShip } from './battle-demo.js';
import { enemyContacts, contactInfo, CONTACT_GROUPS } from './battle-targets.js';

const format = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const setText = (element, value) => { if (element.textContent !== value) element.textContent = value; };

export class TargetPanel {
  constructor(dialog, { getBattle, onSelect, onPriority, onInspect }) {
    this.dialog = dialog; this.getBattle = getBattle; this.onSelect = onSelect; this.onPriority = onPriority; this.onInspect = onInspect;
    this.query = { type: 'all', search: '', sort: 'class', page: 0 }; this.rows = new Map(); this.filters = new Map();
    for (const [type, name] of Object.entries(CONTACT_GROUPS)) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.contactFilter = type;
      const label = document.createElement('span'), count = document.createElement('b'); label.textContent = name; button.append(label, count);
      dialog.querySelector('#contact-filters').append(button); this.filters.set(type, { button, count });
    }
    dialog.addEventListener('click', event => {
      const filter = event.target.closest('[data-contact-filter]');
      const contact = event.target.closest('[data-contact-id]');
      if (filter) { this.query.type = filter.dataset.contactFilter; this.query.page = 0; this.refresh(); }
      else if (contact && !contact.disabled) { this.onSelect(contact.dataset.contactId); dialog.close(); }
      else {
        const id = event.target.closest('button')?.id;
        if (id === 'contacts-close') dialog.close();
        else if (id === 'contact-prev' || id === 'contact-next') { this.query.page += id === 'contact-prev' ? -1 : 1; this.refresh(); }
        else if (id === 'contact-priority' && this.onPriority(this.query.type)) dialog.close();
        else if (id === 'contact-inspect') { this.onInspect(); dialog.close(); }
      }
    });
    dialog.querySelector('#contact-search').addEventListener('input', event => { this.query.search = event.target.value; this.query.page = 0; this.refresh(); });
    dialog.querySelector('#contact-sort').addEventListener('change', event => { this.query.sort = event.target.value; this.query.page = 0; this.refresh(); });
    this.viewportChanged = () => {
      if (!dialog.open) return;
      const viewport = globalThis.visualViewport, height = viewport?.height ?? innerHeight;
      dialog.style.bottom = `${Math.max(0, innerHeight - height - (viewport?.offsetTop ?? 0))}px`;
      dialog.style.maxHeight = `${height * .85}px`;
    };
    globalThis.visualViewport?.addEventListener('resize', this.viewportChanged);
    window.addEventListener('resize', this.viewportChanged);
  }

  open() {
    if (this.dialog.open) return;
    this.refresh(); this.dialog.showModal(); this.viewportChanged(); this.dialog.querySelector('#contacts-close').focus({ preventScroll: true });
  }

  reset() {
    if (this.dialog.open) this.dialog.close();
    this.query = { type: 'all', search: '', sort: 'class', page: 0 };
    this.dialog.querySelector('#contact-search').value = '';
    this.dialog.querySelector('#contact-sort').value = 'class';
  }

  refresh() {
    const result = enemyContacts(this.getBattle(), this.query); this.query.page = result.page; this.result = result;
    this.rows.clear();
    const list = this.dialog.querySelector('#contact-list'); list.replaceChildren();
    for (const contact of result.contacts) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.contactId = contact.id; button.className = 'contact-row';
      const symbol = document.createElement('span'); symbol.className = `contact-symbol ${contact.type}`; symbol.setAttribute('aria-hidden', 'true');
      const body = document.createElement('span'); body.className = 'contact-body';
      const name = document.createElement('b'), info = document.createElement('small'); body.append(name, info);
      const health = document.createElement('span'); health.className = 'contact-health';
      const hull = document.createElement('b'), shield = document.createElement('small'); health.append(hull, shield);
      button.append(symbol, body, health); list.append(button); this.rows.set(contact.id, { button, name, info, hull, shield });
    }
    this.dialog.querySelector('#contact-empty').hidden = result.contacts.length > 0;
    setText(this.dialog.querySelector('#contact-page'), `${result.page + 1} / ${result.pages}`);
    for (const id of ['contact-prev', 'contact-page', 'contact-next']) this.dialog.querySelector('#' + id).hidden = result.pages === 1;
    this.dialog.classList.toggle('single-page', result.pages === 1);
    this.dialog.querySelector('#contact-prev').disabled = result.page === 0;
    this.dialog.querySelector('#contact-next').disabled = result.page === result.pages - 1;
    setText(this.dialog.querySelector('#contact-results'), `${result.total} Kontakte`);
    this.paint();
  }

  // Live changes update the same buttons. Sorting/rebuilding occurs only on a user action.
  paint() {
    const battle = this.getBattle(), byId = new Map(battle.ships.map(ship => [ship.id, ship])), observer = byId.get(battle.selected);
    const counts = Object.fromEntries(Object.keys(CONTACT_GROUPS).map(type => [type, 0]));
    for (const ship of battle.ships) if (ship.side === 'enemy' && activeShip(ship)) { counts.all++; counts[ship.type]++; }
    for (const [type, { button, count }] of this.filters) {
      setText(count, String(counts[type])); button.setAttribute('aria-pressed', String(type === this.query.type));
    }
    setText(this.dialog.querySelector('#contact-count'), String(counts.all));
    for (const [id, row] of this.rows) {
      const ship = byId.get(id), info = ship && contactInfo(ship, observer), available = Boolean(info?.active);
      row.button.disabled = !available; row.button.classList.toggle('selected', id === battle.target);
      row.button.setAttribute('aria-pressed', String(id === battle.target));
      setText(row.name, info?.name ?? 'Verlorener Kontakt');
      setText(row.info, available ? `${info.className} · ${format.format(info.distance)} km` : 'Zerstört / außer Gefecht');
      setText(row.hull, `Hülle ${info?.hull ?? 0} %`); setText(row.shield, `Schild ${info?.shield ?? 0} %`);
      row.hull.classList.toggle('damaged', (info?.hull ?? 0) < 30);
      row.button.classList.toggle('out-of-range', available && !info.inRange);
      row.button.title = available && !info.inRange ? 'Außerhalb der Waffenreichweite des ausgewählten eigenen Schiffs' : '';
    }
    const prioritizable = this.query.type !== 'all' && counts[this.query.type] > 0 && battle.phase === 'engaged';
    this.dialog.querySelector('#contact-priority').disabled = !prioritizable;
    setText(this.dialog.querySelector('#contact-priority'), this.query.type === 'all' ? 'Klasse für Schwerpunkt wählen' : `${CONTACT_GROUPS[this.query.type]} priorisieren`);
    this.dialog.querySelector('#contact-inspect').disabled = !byId.get(battle.target) || !activeShip(byId.get(battle.target));
  }
}
