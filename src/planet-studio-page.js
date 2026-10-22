import { STUDIO_LOOKS, STUDIO_CONTROLS, STUDIO_CAMERAS, STUDIO_SCENES, normalizeStudioValues, readStudioSettings, studioURL, studioCameraPose, poseFromArray } from './planet-studio.js';

const $ = id => document.getElementById(id);
const cameraPose = view => [...view.camera.position.toArray(), ...view.controls.target.toArray(), view.camera.fov];

// A single live renderer and at most three compressed images keep this usable
// on a phone. Images and empty comparison construction never touch game saves.
export class PlanetStudio {
  constructor({ getState, visit, toggle }) {
    this.getState = getState; this.visit = visit; this.toggle = toggle;
    this.settings = readStudioSettings(new URLSearchParams(location.search));
    this.captures = []; this.nextCapture = 1; this.normalGrid = true; this.normalResources = false;
    for (const scene of STUDIO_SCENES) {
      const option = document.createElement('option'); option.value = scene.id; option.textContent = scene.name; $('studio-scene').append(option);
    }
    for (const [id, look] of Object.entries(STUDIO_LOOKS)) this.segment('studio-looks', id, look.name, () => this.setLook(id));
    for (const [id, name] of Object.entries(STUDIO_CAMERAS)) this.segment('studio-cameras', id, name, () => this.setCamera(id));
    for (const [id, config] of Object.entries(STUDIO_CONTROLS)) {
      const row = document.createElement('div'); row.className = 'studio-slider';
      const label = document.createElement('label'); label.htmlFor = `studio-${id}`; label.textContent = config.name;
      const output = document.createElement('output'); output.id = `studio-${id}-value`; output.htmlFor = `studio-${id}`;
      const input = document.createElement('input'); input.type = 'range'; input.id = `studio-${id}`; input.min = config.min; input.max = config.max; input.step = '.01';
      input.addEventListener('input', () => {
        if (this.getState().busy) return;
        this.settings.values = normalizeStudioValues({ ...this.settings.values, [id]: input.value }); this.settings.look = 'custom';
        this.applyValues(); this.writeURL(true); this.sync();
      });
      row.append(label, output, input); $('studio-sliders').append(row);
    }
    $('studio-open').addEventListener('click', () => { $('settings-dialog').close(); void this.open(); });
    $('studio-exit').addEventListener('click', () => void this.close());
    $('studio-scene').addEventListener('change', () => {
      const scene = STUDIO_SCENES.find(s => s.id === $('studio-scene').value); if (!scene || this.getState().busy) return;
      this.settings.pose = null; if (this.settings.shot === 'free') this.settings.shot = 'overview';
      void this.visit({ ...scene, reference: false, valley: null });
    });
    $('studio-adjust').addEventListener('click', () => { $('studio-link').hidden = true; $('studio-tuning-status').textContent = ''; $('studio-tuning').showModal(); });
    $('studio-reset').addEventListener('click', () => this.setLook('natural'));
    $('studio-capture').addEventListener('click', () => this.capture());
    $('studio-compare').addEventListener('click', () => { this.drawGallery(); $('studio-gallery').showModal(); });
    $('studio-share').addEventListener('click', () => void this.share());
    this.sync();
  }

  get active() { return this.settings.active; }
  segment(parent, id, name, handler) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.choice = id; button.textContent = name;
    button.addEventListener('click', handler); $(parent).append(button);
  }
  sync() {
    const { busy, region, planet, selected, seed } = this.getState();
    document.querySelector('.planet-app').dataset.studio = String(this.active); $('studio-panel').hidden = !this.active;
    $('studio-open').disabled = !!busy;
    for (const button of $('studio-panel').querySelectorAll('button, select')) button.disabled = !!busy;
    for (const [key, config] of Object.entries(STUDIO_CONTROLS)) {
      const input = $(`studio-${key}`); input.value = this.settings.values[key]; input.disabled = !!busy || key === 'haze' && !this.getState().view?.scene.fog;
      $(`studio-${key}-value`).value = `${Math.round(this.settings.values[key] * 100)} %`;
      input.setAttribute('aria-valuetext', `${config.name}: ${Math.round(this.settings.values[key] * 100)} Prozent`);
    }
    for (const button of $('studio-looks').children) button.setAttribute('aria-pressed', String(button.dataset.choice === this.settings.look));
    for (const button of $('studio-cameras').children) button.setAttribute('aria-pressed', String(button.dataset.choice === this.settings.shot));
    $('studio-look-name').textContent = STUDIO_LOOKS[this.settings.look]?.name ?? 'Eigene Abstimmung';
    const match = STUDIO_SCENES.find(s => String(s.seed) === String(seed) && s.preset === planet?.preset && s.region === selected?.id && s.climate === planet?.climateMode && planet?.regions.length === s.regions && (planet?.biosphere ?? 'terran') === s.biosphere && !region?.valley);
    $('studio-scene').value = match?.id ?? 'current';
    $('studio-compare').textContent = `Vergleich · ${this.captures.length}/3`;
    $('studio-capture').disabled = !!busy || this.captures.length >= 3;
  }
  async open() {
    const { view, busy } = this.getState(); if (busy || this.active) return;
    this.normalGrid = view.gridVisible; this.normalResources = !!view.resourceMapVisible;
    this.settings.active = true; this.settings.pose = null; view.studioActive = true; this.sync();
    await this.toggle(true); this.notify('Wähle eine Stimmung oder stimme das Bild direkt ab.');
  }
  async close() {
    const { view, busy } = this.getState(); if (busy) return;
    const pose = { eye: view.camera.position.clone(), target: view.controls.target.clone(), fov: view.camera.fov };
    this.settings.active = false; view.studioActive = false; this.sync(); this.writeURL();
    await this.toggle(false, pose);
    view.setGrid(this.normalGrid); view.setResourceMap(this.normalResources);
  }
  regionReady(pose = null) {
    const { view, region } = this.getState(); view.studioActive = this.active;
    if (!this.active || !region) return;
    view.setGrid(false); view.setResourceMap(false); this.applyValues();
    view.setStudioCamera(pose ?? (this.settings.pose ? poseFromArray(this.settings.pose) : studioCameraPose(region, this.settings.shot)));
    if (!this.controlsBound) {
      view.controls.addEventListener('end', () => this.rememberCamera()); this.controlsBound = true;
    }
    this.writeURL(true); this.sync();
  }
  applyValues() { if (this.active) this.getState().view?.setStudioAppearance(this.settings.values); }
  setLook(id) {
    if (this.getState().busy || !STUDIO_LOOKS[id]) return;
    this.settings.look = id; this.settings.values = normalizeStudioValues({}, id); this.applyValues(); this.writeURL(true); this.sync();
  }
  setCamera(id) {
    const { view, region, busy } = this.getState(); if (busy || !this.active || !region) return;
    this.settings.shot = id; this.settings.pose = null; view.setStudioCamera(studioCameraPose(region, id)); this.writeURL(true); this.sync();
  }
  rememberCamera() {
    if (!this.active || this.getState().busy) return;
    const pose = cameraPose(this.getState().view);
    if (this.settings.pose?.every((n, i) => Math.abs(n - pose[i]) < .00001)) return;
    this.settings.shot = 'free'; this.writeURL(true); this.sync();
  }
  writeURL(withPose = false) {
    const { view, region } = this.getState();
    if (withPose && this.active && region) this.settings.pose = cameraPose(view);
    const url = studioURL(location.href, this.settings); history.replaceState(null, '', url); return url.href;
  }
  notify(message) { $('studio-status').textContent = message; }
  capture() {
    const { view, region, busy } = this.getState(); if (busy || !region || this.captures.length >= 3) return;
    try {
      const url = this.writeURL(true), image = view.captureStudioImage();
      this.captures.push({ id: this.nextCapture++, url, image, name: $('studio-scene').selectedOptions[0].textContent === 'Aktueller Ort' ? $('region-kind').textContent : $('studio-scene').selectedOptions[0].textContent, look: $('studio-look-name').textContent, camera: STUDIO_CAMERAS[this.settings.shot] ?? 'Freie Kamera', seed: String(this.getState().seed) });
      this.sync(); this.notify(`Aufnahme ${this.captures.length} gemerkt · Ort und Einstellungen sind wiederherstellbar.`);
    } catch { this.notify('Die Aufnahme war nicht möglich. Bitte erneut versuchen.'); }
  }
  drawGallery() {
    const grid = $('studio-gallery-grid'); grid.replaceChildren();
    if (!this.captures.length) {
      const empty = document.createElement('p'); empty.className = 'studio-empty'; empty.textContent = 'Merke zuerst eine Ansicht mit „Bild merken“. Ändere danach Stimmung oder Ort für den Vergleich.'; grid.append(empty); return;
    }
    for (const [index, shot] of this.captures.entries()) {
      const card = document.createElement('figure'); card.className = 'studio-capture';
      const img = document.createElement('img'); img.src = shot.image; img.alt = `${shot.name} · ${shot.look} · ${shot.camera}`;
      const caption = document.createElement('figcaption'), title = document.createElement('strong'); title.textContent = `${index + 1} · ${shot.name}`;
      caption.append(title, document.createTextNode(`${shot.look} · ${shot.camera} · Seed ${shot.seed}`));
      const actions = document.createElement('div'); actions.className = 'studio-actions';
      const restore = document.createElement('button'); restore.textContent = 'Wiederherstellen'; restore.addEventListener('click', async () => {
        $('studio-gallery').close(); this.settings = readStudioSettings(new URL(shot.url).searchParams);
        const p = new URL(shot.url).searchParams;
        await this.visit({ seed: p.get('seed'), preset: p.get('preset'), regions: Number(p.get('regions')), region: p.get('region'), climate: p.get('climate'), biosphere: p.get('biosphere') ?? 'terran', reference: p.get('reference') === '1', valley: p.get('valley') });
        this.notify('Aufnahme wiederhergestellt.');
      });
      const download = document.createElement('a'); download.href = shot.image; download.download = `orbit-vergleich-${shot.id}.jpg`; download.textContent = 'Bild speichern';
      const link = document.createElement('button'); link.textContent = 'Link kopieren'; link.addEventListener('click', () => void this.share(shot.url));
      const remove = document.createElement('button'); remove.textContent = 'Verwerfen'; remove.addEventListener('click', () => { this.captures = this.captures.filter(s => s.id !== shot.id); this.sync(); this.drawGallery(); });
      actions.append(restore, download, link, remove); card.append(img, caption, actions); grid.append(card);
    }
  }
  async share(savedURL = null) {
    const url = savedURL ?? this.writeURL(true);
    try {
      await navigator.clipboard.writeText(url);
      $('studio-tuning-status').textContent = 'Link kopiert · Ort, Kamera und Abstimmung sind enthalten.'; this.notify('Vergleichslink kopiert.');
    } catch {
      if ($('studio-gallery').open) $('studio-gallery').close();
      if (!$('studio-tuning').open) $('studio-tuning').showModal();
      $('studio-link').hidden = false; $('studio-link').value = url; $('studio-link').focus(); $('studio-link').select();
      $('studio-tuning-status').textContent = 'Link zum Kopieren markieren.';
    }
  }
}
