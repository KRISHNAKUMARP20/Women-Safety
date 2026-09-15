/**
 * Web Audio API synthesizer for SOS Sirens and Notification Chimes.
 * Pure native browser audio, zero external file dependencies or latency.
 */
class AudioAlertSynthesizer {
  private ctx: AudioContext | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isSirenActive = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play an emergency wailing siren
  public startSiren() {
    if (this.isSirenActive) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const masterGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, this.ctx.currentTime);

      // Low frequency modulation (wailing back and forth 600Hz to 1100Hz)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(1.5, this.ctx.currentTime); // 1.5 cycles per sec
      lfoGain.gain.setValueAtTime(350, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      osc.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc.start();
      lfo.start();

      this.sirenOsc = osc;
      this.lfoOsc = lfo;
      this.gainNode = masterGain;
      this.isSirenActive = true;
    } catch (e) {
      console.warn('AudioContext failed to start siren:', e);
    }
  }

  public stopSiren() {
    if (!this.isSirenActive) return;
    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        try {
          this.sirenOsc?.stop();
          this.lfoOsc?.stop();
          this.sirenOsc?.disconnect();
          this.lfoOsc?.disconnect();
        } catch (_) {}
        this.sirenOsc = null;
        this.lfoOsc = null;
        this.gainNode = null;
        this.isSirenActive = false;
      }, 350);
    } catch (e) {
      this.isSirenActive = false;
    }
  }

  public isPlaying() {
    return this.isSirenActive;
  }

  // Play a short alert beep for new notifications
  public playAlertBeep() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch (_) {}
  }
}

export const audioAlert = new AudioAlertSynthesizer();
