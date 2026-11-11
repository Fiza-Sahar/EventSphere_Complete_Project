// Web Audio API Synthesizer for high-tech interface & ambient spatial audio
class SoundFXManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playBeep(freq = 600, duration = 0.08, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  playTeleport() {
    this.playBeep(440, 0.18, 'triangle');
    setTimeout(() => this.playBeep(880, 0.22, 'sine'), 60);
  }

  playClick() {
    this.playBeep(800, 0.04, 'sine');
  }

  playThemeSwitch() {
    this.playBeep(520, 0.1, 'sine');
    setTimeout(() => this.playBeep(1040, 0.15, 'triangle'), 80);
  }
}

export const soundFX = new SoundFXManager();
