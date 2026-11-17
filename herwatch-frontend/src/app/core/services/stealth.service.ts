import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StealthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isStealthActive = signal(false);
  isSirenActive = signal(false);

  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private sirenInterval: any = null;

  activateStealth(): void {
    this.isStealthActive.set(true);
  }

  deactivateStealth(): void {
    this.isStealthActive.set(false);
  }

  toggleSiren(): void {
    if (this.isSirenActive()) {
      this.stopSiren();
    } else {
      this.startSiren();
    }
  }

  startSiren(): void {
    if (!this.isBrowser) return;

    this.isSirenActive.set(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      this.oscillator = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

      this.oscillator.connect(gain);
      gain.connect(this.audioCtx.destination);

      let high = false;
      this.oscillator.frequency.setValueAtTime(700, this.audioCtx.currentTime);
      this.oscillator.start();

      this.sirenInterval = setInterval(() => {
        if (!this.oscillator || !this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const targetFreq = high ? 700 : 1200;
        this.oscillator.frequency.linearRampToValueAtTime(targetFreq, now + 0.25);
        high = !high;
      }, 300);
    } catch (e) {
      console.warn('AudioContext playback error', e);
    }
  }

  stopSiren(): void {
    this.isSirenActive.set(false);

    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
