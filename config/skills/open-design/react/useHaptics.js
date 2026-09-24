'use client';
import { useSyncExternalStore, useCallback } from 'react';
import { isBrowser, clamp, useIsomorphicLayoutEffect } from './utils.js';

/**
 * Singleton WebAudioHaptics synthesizer core & store subscriber registry.
 * Zero external audio downloads (0 KB assets), 0ms synthesis latency.
 */
export class WebAudioHapticsCore {
  constructor(options = {}) {
    this.ctx = null;
    this.isMuted = Boolean(options.muted);
    this.masterVolume = typeof options.volume === 'number' ? clamp(options.volume, 0, 1) : 1.0;
    this.masterGainNode = null;
    this.unlocked = false;
    this.listeners = new Set();

    if (isBrowser()) {
      this.bindAutoUnlock();
    }
  }

  /**
   * Subscribe function for useSyncExternalStore
   * @param {() => void} listener
   * @returns {() => void} Unsubscribe function
   */
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Notify all component subscribers of mute or volume state changes
   */
  notify = () => {
    this.listeners.forEach((fn) => fn());
  };

  /**
   * Snapshot for useSyncExternalStore (combines isMuted and masterVolume)
   * @returns {string}
   */
  getSnapshot = () => {
    return `${this.isMuted}:${this.masterVolume}`;
  };

  /**
   * SSR safe fallback snapshot
   * @returns {string}
   */
  getServerSnapshot = () => {
    return 'false:1.0';
  };

  /**
   * Lazy initializes AudioContext and adheres to browser Autoplay policies
   * @returns {AudioContext | null}
   */
  getContext() {
    if (!isBrowser()) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.masterGainNode = this.ctx.createGain();
          this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
          this.masterGainNode.connect(this.ctx.destination);
        } catch {
          this.ctx = null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Auto-unlocks AudioContext on the first user interaction gesture
   */
  bindAutoUnlock() {
    if (this.unlocked) return;
    const unlock = () => {
      this.getContext();
      this.unlocked = true;
      ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
        window.removeEventListener(evt, unlock, true);
      });
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, unlock, { once: true, passive: true, capture: true });
    });
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    this.notify();
  }

  getIsMuted() {
    return this.isMuted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) this.playPop();
    this.notify();
    return this.isMuted;
  }

  setVolume(volume) {
    this.masterVolume = clamp(volume, 0, 1);
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  getVolume() {
    return this.masterVolume;
  }

  /**
   * 1. Mechanical Button Tap (K18 Signature Button Tap: 800Hz -> 200Hz sine)
   */
  playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * 2. Organic Pop (K18 Signature Drawer/Modal/Badge Pop: 320Hz -> 960Hz triangle)
   */
  playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  /**
   * 3. Success Triad Chime (C6, E6, G6: 1046.5Hz, 1318.5Hz, 1567.98Hz with 0.04s stagger)
   */
  playChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;
      const now = ctx.currentTime;
      [1046.5, 1318.5, 1567.98].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.04);
        gain.gain.setValueAtTime(0.04, now + index * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 0.28);
        osc.connect(gain);
        gain.connect(this.masterGainNode);
        osc.start(now + index * 0.04);
        osc.stop(now + index * 0.04 + 0.28);
      });
    } catch {}
  }

  /**
   * 4. Tab Switch Sound (540Hz -> 420Hz sine)
   */
  playTabSwitch() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * 5. Toggle State Sound (on: 440Hz -> 880Hz ascending, off: 660Hz -> 330Hz descending)
   * @param {boolean} [state=true]
   */
  playToggle(state = true) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = state ? 440 : 660;
      const endFreq = state ? 880 : 330;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }
}

/**
 * Global Singleton instance shared across all useHaptics consumers
 */
export const hapticsStore = new WebAudioHapticsCore();

/**
 * useHaptics — React Hook for pure Web Audio API haptic feedback.
 * Synchronizes mute and volume state globally across all components via useSyncExternalStore.
 *
 * @param {Object} [options]
 * @param {number} [options.volume] - Initial volume (0.0 to 1.0)
 * @param {boolean} [options.muted] - Initial muted state
 * @returns {Object}
 */
export function useHaptics(options) {
  useSyncExternalStore(
    hapticsStore.subscribe,
    hapticsStore.getSnapshot,
    hapticsStore.getServerSnapshot
  );

  // Apply options if provided
  useIsomorphicLayoutEffect(() => {
    if (options) {
      if (typeof options.volume === 'number') {
        hapticsStore.setVolume(options.volume);
      }
      if (typeof options.muted === 'boolean') {
        hapticsStore.setMuted(options.muted);
      }
    }
  }, [options?.volume, options?.muted]);

  const playClick = useCallback(() => hapticsStore.playClick(), []);
  const playPop = useCallback(() => hapticsStore.playPop(), []);
  const playChime = useCallback(() => hapticsStore.playChime(), []);
  const playTabSwitch = useCallback(() => hapticsStore.playTabSwitch(), []);
  const playToggle = useCallback((st) => hapticsStore.playToggle(st), []);
  const toggleMute = useCallback(() => hapticsStore.toggleMute(), []);
  const setMuted = useCallback((m) => hapticsStore.setMuted(m), []);
  const setVolume = useCallback((v) => hapticsStore.setVolume(v), []);

  const bindHaptic = useCallback((sound = 'click', userOnClick) => {
    return {
      onClick: (e) => {
        switch (sound) {
          case 'pop':
            hapticsStore.playPop();
            break;
          case 'chime':
            hapticsStore.playChime();
            break;
          case 'switch':
          case 'tab':
            hapticsStore.playTabSwitch();
            break;
          case 'toggle':
            hapticsStore.playToggle();
            break;
          case 'click':
          default:
            hapticsStore.playClick();
            break;
        }
        if (typeof userOnClick === 'function') {
          userOnClick(e);
        }
      },
    };
  }, []);

  return {
    playClick,
    playPop,
    playChime,
    playTabSwitch,
    playToggle,
    isMuted: hapticsStore.getIsMuted(),
    toggleMute,
    setMuted,
    volume: hapticsStore.getVolume(),
    setVolume,
    bindHaptic,
  };
}
