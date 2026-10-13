// Resolution changes need sustained evidence, not a single slow loading frame.
export class BattleQuality {
  constructor(deviceRatio = 1) {
    this.maximum = Math.min(1.75, Math.max(1, deviceRatio));
    this.ratio = Math.min(1.5, this.maximum); this.slow = 0; this.fast = 0;
  }
  observe(seconds, moving = true) {
    if (!moving || !Number.isFinite(seconds) || seconds <= 0 || seconds > .25) { this.slow = this.fast = 0; return false; }
    this.slow = seconds > .026 ? this.slow + seconds : Math.max(0, this.slow - seconds * 2);
    this.fast = seconds < .019 ? this.fast + seconds : 0;
    const previous = this.ratio;
    if (this.slow > 2) { this.ratio = Math.max(.85, this.ratio - .15); this.slow = this.fast = 0; }
    else if (this.fast > 8) { this.ratio = Math.min(this.maximum, this.ratio + .1); this.slow = this.fast = 0; }
    return this.ratio !== previous;
  }
}
