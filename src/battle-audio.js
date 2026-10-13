// Battle cues are synthesized locally and honor the existing effects preference.
export class BattleAudio {
  constructor(settings) { this.settings = settings; this.last = -10; this.voices = 0; }
  unlock() {
    if (!this.settings().effects) return;
    try {
      if (!this.context) {
        const Context = globalThis.AudioContext ?? globalThis.webkitAudioContext;
        if (!Context) return;
        this.context = new Context();
        this.noise = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
        const data = this.noise.getChannelData(0); let seed = 3077;
        for (let i = 0; i < data.length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; data[i] = seed / 2147483648 - 1; }
      }
      void this.context.resume().catch(() => {});
    } catch { this.context = null; }
  }
  play(events, battle, focus) {
    const context = this.context, settings = this.settings();
    if (!context || context.state !== 'running' || !settings.effects || settings.effectsVolume <= 0) return false;
    const own = battle.ships.find(s => s.id === focus);
    const event = events.find(e => e.kind === 'destroy' && e.ship === focus)
      ?? events.find(e => e.kind === 'impact' && e.target === focus)
      ?? events.find(e => e.kind === 'fire' && e.ship === focus);
    if (!event || context.currentTime - this.last < .12 || this.voices >= 6) return true;
    this.last = context.currentTime;
    const now = context.currentTime, explosion = event.kind === 'destroy', impact = event.kind === 'impact';
    const duration = explosion ? .85 : impact ? .23 : event.weapon === 'torpedo' ? .42 : .16;
    const gain = context.createGain(), filter = context.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = explosion ? 950 : impact ? 1700 : 3000;
    const source = context.createBufferSource(); source.buffer = this.noise;
    source.connect(filter); filter.connect(gain);
    const volume = settings.effectsVolume * (explosion ? .22 : impact ? .065 : .085);
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), now + .01); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    const pan = context.createStereoPanner?.();
    if (pan) { pan.pan.value = Math.max(-.7, Math.min(.7, (own?.position[0] ?? 0) / 150)); gain.connect(pan); pan.connect(context.destination); }
    else gain.connect(context.destination);
    const oscillator = context.createOscillator(), tone = context.createGain();
    oscillator.type = event.weapon === 'pulse' ? 'triangle' : 'sine';
    const frequency = explosion ? 75 : impact ? 155 : ({ torpedo: 90, rail: 430, laser: 820, pulse: 380 }[event.weapon] ?? 180);
    oscillator.frequency.setValueAtTime(frequency, now); oscillator.frequency.exponentialRampToValueAtTime(Math.max(25, frequency * .24), now + duration);
    tone.gain.setValueAtTime(volume * .7, now); tone.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(tone); tone.connect(pan ?? context.destination);
    this.voices++; source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); oscillator.disconnect(); tone.disconnect(); pan?.disconnect(); this.voices--; };
    source.start(now); source.stop(now + duration); oscillator.start(now); oscillator.stop(now + duration);
    return true;
  }
  hidden(value) { if (value) void this.context?.suspend().catch(() => {}); }
  dispose() { void this.context?.close().catch(() => {}); this.context = null; }
}
