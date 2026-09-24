/**
 * ============================================================================
 * ANTIGRAVITY 2.0 // WOW ENGINE (Cỗ máy Trải nghiệm Xúc giác & Chuyển động)
 * ============================================================================
 * Module: wow_engine.js
 * Architecture:
 *   1. Dual-Mode Motion Engine (60 FPS GSAP vs ?test-mode=1 instantaneous 0ms)
 *   2. WebAudioHaptics (Tự tổng hợp sóng âm xúc giác bằng Web Audio API thuần)
 *   3. Dynamic Spotlight Tracker (Spotlight rọi theo chuột & viền phản quang)
 *   4. 3D Parallax Tilt Engine (Nghiêng phối cảnh 3D trên thẻ Acrylic)
 *   5. Magnetic Button Controller (Hút nam châm & lún cơ học :active scale(0.965))
 *   6. Lenis Smooth Scroll Integration (Cuộn mượt quán tính với Fallback an toàn)
 * ============================================================================
 */

(function (window, document) {
  'use strict';

  // ==========================================================================
  // 1. DUAL-MODE MOTION ENGINE CONFIGURATION (Cấu hình Chuyển động Kép)
  // ==========================================================================
  const urlParams = new URLSearchParams(window.location.search);
  let isTestMode = urlParams.get('test-mode') === '1' || window.__TEST_MODE__ === true;

  function applyMotionMode(active) {
    isTestMode = !!active;

    if (isTestMode) {
      document.documentElement.classList.add('test-mode');
      document.documentElement.classList.remove('kinetic-mode');
      document.documentElement.setAttribute('data-test-mode', 'true');
      console.info('[WowEngine] Dual-Mode Motion: TEST-MODE ACTIVE (0ms instant execution, transitions bypassed)');
    } else {
      document.documentElement.classList.remove('test-mode');
      document.documentElement.classList.add('kinetic-mode');
      document.documentElement.setAttribute('data-test-mode', 'false');
      console.info('[WowEngine] Dual-Mode Motion: 60 FPS KINETIC GSAP ACTIVE');
    }

    // Notify listeners of mode transition without requiring full page reload
    window.dispatchEvent(new CustomEvent('wow:modechange', { detail: { isTestMode } }));
  }

  applyMotionMode(isTestMode);

  // ==========================================================================
  // 2. WEBAUDIO HAPTICS ENGINE (Cỗ máy Tổng hợp Âm thanh Xúc giác)
  // ==========================================================================

  /**
   * Standard tactile vibration patterns in milliseconds (Bảng mã nhịp rung xúc giác chuẩn)
   */
  const HAPTIC_PATTERNS = Object.freeze({
    click: [12],
    pop: [18],
    switch: [10, 16, 12],
    'mech-switch': [10, 16, 12],
    'mechanical-switch': [10, 16, 12],
    tab: [10, 16, 12],
    toggle: [10, 16, 12],
    success: [15, 35, 20, 35, 30],
    chord: [15, 35, 20, 35, 30],
    'success-chord': [15, 35, 20, 35, 30],
    chime: [15, 35, 20, 35, 30],
    thud: [35],
    'dull-thud': [35],
    impact: [35],
    drop: [35],
    rotary: [8],
    'rotary-step': [8],
    dial: [8],
    knob: [8],
    detent: [10],
  });

  const canVibrate = () =>
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function' &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');

  class WebAudioHapticsEngine {
    constructor(options = {}) {
      this.ctx = null;
      this.isMuted = options.muted || false;
      this.hapticMode = options.hapticMode || options.mode || 'dual'; // 'dual' | 'audio-only' | 'vibrate-only' | 'mute'
      this._previousHapticMode = this.hapticMode;
      this.masterVolume = typeof options.volume === 'number' ? Math.min(Math.max(options.volume, 0), 1) : 1.0;
      this.masterGainNode = null;
      this.listeners = new Set();
      this.hasUserInteracted = false;
      this.onAudioTrigger = null; // Callback for visualizers
      this._lastRotaryTime = 0;
      this._activeTimers = new Set();
      this.version = '2.1';
      this.isV2 = true;
      this.vibrationPatterns = { ...HAPTIC_PATTERNS };

      if (this.isMuted && this.hapticMode !== 'mute' && this.hapticMode !== 'muted') {
        this._previousHapticMode = this.hapticMode;
        this.hapticMode = 'mute';
      }

      this._initAutoplayUnlock();
    }

    /**
     * Hardware vibration support detection on mobile platforms
     */
    get canVibrate() {
      return typeof navigator !== 'undefined' &&
        typeof navigator.vibrate === 'function' &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');
    }

    get hasVibrationSupport() {
      return this.canVibrate;
    }

    checkVibrationSupport() {
      return this.canVibrate;
    }

    /**
     * Configure haptic operational mode: 'dual' | 'audio-only' | 'vibrate-only' | 'mute'
     * @param {string} mode
     */
    setHapticMode(mode) {
      const valid = ['dual', 'audio-only', 'vibrate-only', 'haptic-only', 'mute', 'muted'];
      const m = String(mode || '').trim().toLowerCase();
      if (valid.includes(m)) {
        this.hapticMode = (m === 'haptic-only') ? 'vibrate-only' : (m === 'muted') ? 'mute' : m;
        if (this.hapticMode === 'mute') {
          this.isMuted = true;
        } else if (this.isMuted && this.hapticMode !== 'mute') {
          this.isMuted = false;
        }
      }
      return this.hapticMode;
    }

    getHapticMode() {
      return this.hapticMode;
    }

    shouldPlayAudio(mode = this.hapticMode) {
      if (this.isMuted) return false;
      const m = String(mode || this.hapticMode || 'dual').toLowerCase();
      if (m === 'mute' || m === 'muted' || m === 'vibrate-only' || m === 'haptic-only') return false;
      return true;
    }

    shouldVibrate(mode = this.hapticMode) {
      if (this.isMuted) return false;
      const m = String(mode || this.hapticMode || 'dual').toLowerCase();
      if (m === 'mute' || m === 'muted' || m === 'audio-only') return false;
      return this.canVibrate;
    }

    /**
     * Dispatches vibration pulse to hardware haptic motor on mobile devices
     * @param {string|number|number[]} pattern
     * @param {boolean} [force=false]
     */
    vibrate(pattern = 'click', force = false) {
      if (!force && !this.shouldVibrate()) return false;
      if (this.isMuted && !force) return false;
      try {
        let pat = pattern;
        if (typeof pattern === 'string') {
          pat = this.vibrationPatterns[pattern.toLowerCase()] || HAPTIC_PATTERNS[pattern.toLowerCase()] || [12];
        } else if (typeof pattern === 'number') {
          pat = [pattern];
        }
        if (Array.isArray(pat) && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          return navigator.vibrate(pat);
        }
      } catch (_) {}
      return false;
    }

    /**
     * Coordinates dual execution: dispatches haptic vibration and checks audio readiness
     */
    _resolveHapticTrigger(spatialOptions, defaultPatternKey) {
      const opts = (spatialOptions && typeof spatialOptions === 'object') ? spatialOptions : null;
      const effMode = (opts && opts.hapticMode) ? opts.hapticMode : this.hapticMode;
      const allowVibrate = opts && (opts.vibrate === false || opts.vibrate === 'false') ? false : true;

      if (allowVibrate && this.shouldVibrate(effMode)) {
        const pat = (opts && opts.customPattern)
          ? opts.customPattern
          : (this.vibrationPatterns[defaultPatternKey] || HAPTIC_PATTERNS[defaultPatternKey] || [12]);
        this.vibrate(pat, true);
      }

      return this.shouldPlayAudio(effMode);
    }

    _initAutoplayUnlock() {
      const unlock = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          const ctx = this._getContext();
          if (ctx) {
            this._flushSilentBuffer(ctx);
          }
        }
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
    }

    _getContext() {
      if (!this.shouldPlayAudio()) return null;
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.ctx = new AudioCtx();
            this.masterGainNode = this.ctx.createGain();
            this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
            this.masterGainNode.connect(this.ctx.destination);
          } catch (e) {
            console.warn('[WebAudioHaptics] Failed to create AudioContext:', e);
          }
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    getContext() {
      return this._getContext();
    }

    flushSilentBuffer() {
      return this._flushSilentBuffer(this._getContext());
    }

    _flushSilentBuffer(ctx) {
      if (!ctx || typeof ctx.createBuffer !== 'function' || typeof ctx.createBufferSource !== 'function') {
        return;
      }
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        const timer = setTimeout(() => {
          try {
            source.disconnect();
          } catch {}
          if (this._activeTimers) this._activeTimers.delete(timer);
        }, 50);
        if (typeof timer.unref === 'function') timer.unref();
        if (this._activeTimers) this._activeTimers.add(timer);
      } catch {}
    }

    notify(type) {
      if (typeof this.onAudioTrigger === 'function') {
        try {
          this.onAudioTrigger(type);
        } catch (_) {}
      }
    }

    getMuted() {
      return this.isMuted;
    }

    setMuted(muted) {
      this.isMuted = !!muted;
      if (this.isMuted) {
        if (this.hapticMode !== 'mute' && this.hapticMode !== 'muted') {
          this._previousHapticMode = this.hapticMode;
          this.hapticMode = 'mute';
        }
      } else {
        if (this.hapticMode === 'mute' || this.hapticMode === 'muted') {
          this.hapticMode = this._previousHapticMode || 'dual';
        }
      }
      this.listeners.forEach((cb) => cb(this.isMuted));
      return this.isMuted;
    }

    toggleMute(playFeedback = false) {
      this.setMuted(!this.isMuted);
      if (!this.isMuted) {
        this._getContext();
        if (playFeedback) {
          this.playPop();
        }
      }
      return this.isMuted;
    }

    setVolume(volume) {
      this.masterVolume = Math.min(Math.max(volume, 0), 1);
      if (this.masterGainNode && this.ctx) {
        this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      }
    }

    getVolume() {
      return this.masterVolume;
    }

    destroy() {
      if (this._activeTimers) {
        this._activeTimers.forEach((t) => clearTimeout(t));
        this._activeTimers.clear();
      }
      if (this.ctx && typeof this.ctx.close === 'function') {
        this.ctx.close().catch(() => {});
        this.ctx = null;
      }
      this.masterGainNode = null;
      this.hasUserInteracted = false;
    }

    subscribe(cb) {
      this.listeners.add(cb);
      return () => this.listeners.delete(cb);
    }

    _resolvePan(options) {
      if (options === undefined || options === null) return 0;
      let rawPan = 0;

      if (typeof options === 'number') {
        rawPan = (isFinite(options) && !isNaN(options)) ? options : 0;
      } else if (typeof options === 'object') {
        if (typeof options.pan === 'number') {
          rawPan = (isFinite(options.pan) && !isNaN(options.pan)) ? options.pan : 0;
        } else if (typeof options.clientX === 'number') {
          const winW = (typeof window !== 'undefined' && window.innerWidth > 0) ? window.innerWidth : 1;
          const w = (typeof options.innerWidth === 'number' && options.innerWidth > 0) ? options.innerWidth : winW;
          rawPan = isFinite(options.clientX) ? ((options.clientX / w) - 0.5) * 2 : 0;
        } else if (typeof options.x === 'number') {
          const w = (typeof options.width === 'number' && options.width > 0) ? options.width : 1;
          rawPan = isFinite(options.x) ? ((options.x / w) - 0.5) * 2 : 0;
        } else {
          const isEl = (typeof Element !== 'undefined' && options instanceof Element) || (options && typeof options.getBoundingClientRect === 'function');
          if (options.target || options.element || isEl) {
            const el = options.element || options.target || options;
            if (el && typeof el.getBoundingClientRect === 'function') {
              const rect = el.getBoundingClientRect();
              if (rect && typeof rect.left === 'number' && typeof rect.width === 'number') {
                const cx = rect.left + rect.width / 2;
                const winW = (typeof window !== 'undefined' && window.innerWidth > 0) ? window.innerWidth : 1;
                rawPan = isFinite(cx) ? ((cx / winW) - 0.5) * 2 : 0;
              }
            }
          }
        }
      }

      if (isNaN(rawPan) || !isFinite(rawPan)) rawPan = 0;

      const k = 0.75;
      return Math.min(Math.max(rawPan, -1), 1) * k;
    }

    _createSpatialRoute(ctx, panVal = 0, durationMs = 100) {
      const fallbackTarget = this.masterGainNode || (ctx ? ctx.destination : null);
      if (!ctx || !fallbackTarget) {
        return { input: null, panner: null, connect: () => {}, disconnect: () => {} };
      }

      const safePanVal = (isFinite(panVal) && !isNaN(panVal)) ? panVal : 0;
      const pan = Math.min(Math.max(safePanVal, -1), 1);
      let panner = null;
      let input = fallbackTarget;

      if (typeof ctx.createStereoPanner === 'function') {
        try {
          panner = ctx.createStereoPanner();
          if (panner.pan && typeof panner.pan.setValueAtTime === 'function') {
            panner.pan.setValueAtTime(pan, ctx.currentTime);
          } else if (panner.pan) {
            panner.pan.value = pan;
          }
          panner.connect(fallbackTarget);
          input = panner;
        } catch {
          panner = null;
          input = fallbackTarget;
        }
      }

      let safetyTimer = null;
      if (panner) {
        const safetyTimeout = Math.max(durationMs || 100, 10) + 100;
        safetyTimer = setTimeout(() => {
          try {
            panner.disconnect();
          } catch {}
          if (this._activeTimers) this._activeTimers.delete(safetyTimer);
        }, safetyTimeout);
        if (typeof safetyTimer.unref === 'function') safetyTimer.unref();
        if (this._activeTimers) this._activeTimers.add(safetyTimer);
      }

      return {
        input,
        panner,
        connect: (...args) => input.connect(...args),
        disconnect: () => {
          if (safetyTimer) {
            clearTimeout(safetyTimer);
            if (this._activeTimers) this._activeTimers.delete(safetyTimer);
          }
          if (panner) {
            try { panner.disconnect(); } catch {}
          }
        },
      };
    }

    // 1. Mechanical Click: Crisp high-frequency transient (Nút bấm cơ học)
    playClick(spatialOptions = null) {
      this.notify('click');
      if (!this._resolveHapticTrigger(spatialOptions, 'click')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.018);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        const pan = this._resolvePan(spatialOptions);
        const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
          ? this._createSpatialRoute(ctx, pan, 25)
          : null;

        osc.connect(gain);
        gain.connect(route ? route.input : (this.masterGainNode || ctx.destination));

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.022);
      } catch (_) {}
    }

    // 2. Soft Tactile Pop: Bubble actuation (Mở hộp thoại, thẻ chip)
    playPop(spatialOptions = null) {
      this.notify('pop');
      if (!this._resolveHapticTrigger(spatialOptions, 'pop')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.035);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        const pan = this._resolvePan(spatialOptions);
        const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
          ? this._createSpatialRoute(ctx, pan, 40)
          : null;

        osc.connect(gain);
        gain.connect(route ? route.input : (this.masterGainNode || ctx.destination));

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    }

    // 3. Switch Clack: Double pulse mechanical bottom-out (Công tắc cơ)
    playSwitch(state = true, spatialOptions = null) {
      this.notify('switch');
      this.playMechanicalSwitch(state, spatialOptions);
    }

    // 3b. Tab Switch: Soft mechanical switch for tabs and segmented controls
    playTabSwitch(spatialOptions = null) {
      this.notify('tabswitch');
      if (!this._resolveHapticTrigger(spatialOptions, 'switch')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        const pan = this._resolvePan(spatialOptions);
        const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
          ? this._createSpatialRoute(ctx, pan, 60)
          : null;

        osc.connect(gain);
        gain.connect(route ? route.input : (this.masterGainNode || ctx.destination));

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (_) {}
    }

    // 3c. Toggle Chime: Ascending on, descending off
    playToggle(state = true, spatialOptions = null) {
      this.notify('toggle');
      if (!this._resolveHapticTrigger(spatialOptions, 'switch')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startFreq = state ? 440 : 660;
        const endFreq = state ? 880 : 330;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        const pan = this._resolvePan(spatialOptions);
        const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
          ? this._createSpatialRoute(ctx, pan, 70)
          : null;

        osc.connect(gain);
        gain.connect(route ? route.input : (this.masterGainNode || ctx.destination));

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.06);
      } catch (_) {}
    }

    // 4. Harmonic Chime: Success notification chord (Chuông xác nhận thành công)
    playChime(spatialOptions = null) {
      this.notify('chime');
      if (!this._resolveHapticTrigger(spatialOptions, 'chime')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const pan = this._resolvePan(spatialOptions);
        const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
          ? this._createSpatialRoute(ctx, pan, 400)
          : null;

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.035;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(route ? route.input : (this.masterGainNode || ctx.destination));

          osc.onended = () => {
            try { gain.disconnect(); osc.disconnect(); } catch (_) {}
          };

          osc.start(startTime);
          osc.stop(startTime + 0.38);
        });
      } catch (_) {}
    }

    // 5. Rotary Detent Tick: High-density micro detent (Răng cưa núm xoay)
    playDetent(spatialOptions = null) {
      this.notify('detent');
      if (!this._resolveHapticTrigger(spatialOptions, 'detent')) return;
      this.playRotaryStep(0, 24, spatialOptions);
    }

    // 6. Stepped Rotary Detent: High-density micro detent with frequency modulation
    playRotary(step = 1, direction = 1) {
      this.notify('rotary');
      if (!this._resolveHapticTrigger(null, 'rotary')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const baseFreq = 1400 + ((step % 12) * 50) * direction;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(Math.max(900, Math.min(2600, baseFreq)), now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.009);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
        osc.connect(gain);
        gain.connect(this.masterGainNode || ctx.destination);

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.012);
      } catch (_) {}
    }

    // 7. Spring Release: Damped mechanical spring resonance
    playSpring() {
      this.notify('spring');
      if (!this._resolveHapticTrigger(null, 'pop')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.masterGainNode || ctx.destination);

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.15);
      } catch (_) {}
    }

    // 8. Spatial Stereo Panning: Left/Right panning impulse
    playSpatial(pan = -0.85) {
      this.notify('spatial');
      if (!this._resolveHapticTrigger(pan, 'click')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pan < 0 ? 820 : 1080, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

        const route = this._createSpatialRoute(ctx, pan, 70);
        osc.connect(gain);
        gain.connect(route.input);

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.07);
      } catch (_) {}
    }

    // 9. Mechanical Bottom-Out Thud: Deep impact
    playThud(spatialOptions = null) {
      this.notify('thud');
      this.playDullThud(spatialOptions);
    }

    // 10. Two-Stage Shutter / Switch
    playDoubleStage(stage = 1) {
      this.notify('doublestage');
      if (!this._resolveHapticTrigger(null, 'switch')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        if (stage === 1) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(740, now);
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.015);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
        } else {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1750, now);
          osc.frequency.exponentialRampToValueAtTime(340, now + 0.024);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
        }
        osc.connect(gain);
        gain.connect(this.masterGainNode || ctx.destination);

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.03);
      } catch (_) {}
    }

    // ========================================================================
    // 5 WEBAUDIOHAPTICS V2.0 DSP SOUND MODELS
    // ========================================================================

    /**
     * Rotary Step / Gear Click: Crisp mechanical detent with 18ms micro-throttle
     * and 65% downward frequency sweep simulating physical gear ratchet notch.
     */
    playRotaryStep(step = 0, maxSteps = 24, spatialOptions = null) {
      this.notify('rotary');

      const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (this._lastRotaryTime && (nowMs - this._lastRotaryTime < 18)) {
        return;
      }
      this._lastRotaryTime = nowMs;

      if (!this._resolveHapticTrigger(spatialOptions, 'rotary')) return;

      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const stepRatio = Math.min(Math.max((step || 0) / (maxSteps || 24), 0), 1);
        const startFreq = 780 + stepRatio * 260; // 780Hz - 1040Hz
        const endFreq = startFreq * (1 - 0.65);  // Sweeps 65% down

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + 0.018);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

        const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 25);
        osc.connect(gain);
        gain.connect(route.input);

        osc.onended = () => {
          try { gain.disconnect(); osc.disconnect(); } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + 0.02);
      } catch (_) {}
    }

    /**
     * Success Chord: Harmonious C5-E5-G5 major triad staggered by 35ms.
     * Smooth exponential decay with balanced gain headroom to prevent peak clipping.
     */
    playSuccessChord(spatialOptions = null) {
      this.notify('chord');
      if (!this._resolveHapticTrigger(spatialOptions, 'success')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const chordNotes = [523.25, 659.25, 783.99]; // C5, E5, G5
        const staggerDelay = 0.035;
        const noteDuration = 0.38;

        const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 500);

        chordNotes.forEach((freq, idx) => {
          const noteStartTime = now + idx * staggerDelay;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStartTime);

          gain.gain.setValueAtTime(0.062, noteStartTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + noteDuration);

          osc.connect(gain);
          gain.connect(route.input);

          osc.onended = () => {
            try { gain.disconnect(); osc.disconnect(); } catch (_) {}
          };

          osc.start(noteStartTime);
          osc.stop(noteStartTime + noteDuration);
        });
      } catch (_) {}
    }

    /**
     * Dull Thud: Damped bass impact sweeping from 140 Hz down to 40 Hz,
     * conditioned through a resonant lowpass filter (Q = 2.4).
     */
    playDullThud(spatialOptions = null) {
      this.notify('thud');
      if (!this._resolveHapticTrigger(spatialOptions, 'thud')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const duration = 0.09;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + duration);

        let filter = null;
        if (typeof ctx.createBiquadFilter === 'function') {
          filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(160, now);
          filter.frequency.exponentialRampToValueAtTime(60, now + duration);
          filter.Q.setValueAtTime(2.4, now);
        }

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 110);

        if (filter) {
          osc.connect(filter);
          filter.connect(gain);
          const filterTimer = setTimeout(() => {
            try { filter.disconnect(); } catch {}
            if (this._activeTimers) this._activeTimers.delete(filterTimer);
          }, 150);
          if (typeof filterTimer.unref === 'function') filterTimer.unref();
          if (this._activeTimers) this._activeTimers.add(filterTimer);
        } else {
          osc.connect(gain);
        }

        gain.connect(route.input);

        osc.onended = () => {
          try {
            if (filter) { filter.disconnect(); }
            gain.disconnect();
            osc.disconnect();
          } catch (_) {}
        };

        osc.start(now);
        osc.stop(now + duration);
      } catch (_) {}
    }

    /**
     * 2-Phase Mechanical Switch:
     *  Phase 1 (t = 0): Crisp spring tactile leaf latch
     *  Phase 2 (t = +16ms): Damped housing bottom-out stem impact
     */
    playMechanicalSwitch(state = true, spatialOptions = null) {
      this.notify('mech-switch');
      if (!this._resolveHapticTrigger(spatialOptions, 'switch')) return;
      const ctx = this._getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const isEngage = Boolean(state);
        const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 80);

        // Phase 1 (Thì 1): Spring latch mechanical click at t = 0
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const p1Duration = 0.015;

        osc1.type = 'triangle';
        const p1Start = isEngage ? 650 : 820;
        const p1End = isEngage ? 920 : 480;
        osc1.frequency.setValueAtTime(p1Start, now);
        osc1.frequency.exponentialRampToValueAtTime(p1End, now + p1Duration);

        gain1.gain.setValueAtTime(0.07, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + p1Duration);

        osc1.connect(gain1);
        gain1.connect(route.input);

        osc1.onended = () => {
          try { gain1.disconnect(); osc1.disconnect(); } catch (_) {}
        };

        osc1.start(now);
        osc1.stop(now + p1Duration);

        // Phase 2 (Thì 2): Bottom-out stem impact after 16ms (t = now + 0.016s)
        const p2StartTime = now + 0.016;
        const p2Duration = 0.024;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.type = 'sine';
        const p2Start = isEngage ? 280 : 220;
        const p2End = isEngage ? 120 : 90;
        osc2.frequency.setValueAtTime(p2Start, p2StartTime);
        osc2.frequency.exponentialRampToValueAtTime(p2End, p2StartTime + p2Duration);

        gain2.gain.setValueAtTime(0.08, p2StartTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, p2StartTime + p2Duration);

        osc2.connect(gain2);
        gain2.connect(route.input);

        osc2.onended = () => {
          try { gain2.disconnect(); osc2.disconnect(); } catch (_) {}
        };

        osc2.start(p2StartTime);
        osc2.stop(p2StartTime + p2Duration);
      } catch (_) {}
    }

    /**
     * Automatic event binder for HTML elements with data-haptic attributes.
     */
    bind(root) {
      const targetRoot = root || (typeof document !== 'undefined' ? document : null);
      if (typeof window === 'undefined' || !targetRoot) return () => {};

      const resolveSpatial = (el, e) => {
        if (!el || typeof el.getAttribute !== 'function') return null;
        const attr = el.getAttribute('data-haptic-spatial');
        let spatial = null;
        if (attr === 'left') spatial = { pan: -0.8, element: el };
        else if (attr === 'right') spatial = { pan: 0.8, element: el };
        else if (attr === 'center') spatial = { pan: 0, element: el };
        else if (attr !== null && attr !== undefined && attr !== 'false' && attr !== '' && attr !== 'true' && !isNaN(parseFloat(attr))) {
          spatial = { pan: parseFloat(attr), element: el };
        } else if (attr !== null && attr !== undefined && attr !== 'false') {
          spatial = { clientX: e && typeof e.clientX === 'number' ? e.clientX : undefined, element: el };
        }

        const hapticModeAttr = el.getAttribute('data-haptic-mode');
        const vibrateAttr = el.getAttribute('data-haptic-vibrate');

        let customPattern = null;
        let allowVibrate = null;
        if (vibrateAttr !== null && vibrateAttr !== undefined) {
          if (vibrateAttr === 'false') {
            allowVibrate = false;
          } else if (vibrateAttr === 'true' || vibrateAttr === '') {
            allowVibrate = true;
          } else {
            const parts = String(vibrateAttr).split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
            if (parts.length > 0) {
              customPattern = parts;
              allowVibrate = true;
            }
          }
        }

        if (spatial) {
          if (hapticModeAttr) spatial.hapticMode = hapticModeAttr;
          if (allowVibrate !== null) spatial.vibrate = allowVibrate;
          if (customPattern) spatial.customPattern = customPattern;
          return spatial;
        }

        if (hapticModeAttr || allowVibrate !== null || customPattern) {
          return {
            element: el,
            pan: 0,
            hapticMode: hapticModeAttr || undefined,
            vibrate: allowVibrate !== null ? allowVibrate : undefined,
            customPattern: customPattern || undefined,
          };
        }

        return null;
      };

      const handleAction = (e) => {
        const el = (typeof Element !== 'undefined' && e.target instanceof Element)
          ? e.target
          : (e.target?.parentElement || e.target);
        const target = (typeof el?.closest === 'function')
          ? (el.closest('[data-haptic]') || el.closest('[data-haptic-vibrate]') || el.closest('[data-haptic-mode]'))
          : null;
        if (!target) return;

        // Micro-deduplication: Prevents double-trigger audio flutter when browser fires
        // both 'input' and 'click' events on checkboxes and radio buttons in rapid succession (<25ms)
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const evtType = e?.type || 'action';
        if (e && e.type && target._lastHapticEvent && target._lastHapticEvent !== evtType && (now - target._lastHapticTime < 25)) {
          return;
        }
        target._lastHapticTime = now;
        target._lastHapticEvent = evtType;

        const rawType = target.getAttribute('data-haptic') || 'click';
        const soundType = String(rawType).trim().toLowerCase();
        const spatialOpts = resolveSpatial(target, e);

        switch (soundType) {
          case 'rotary':
          case 'rotary-step':
          case 'dial':
          case 'knob': {
            const step = parseFloat(target.getAttribute('data-haptic-step') || target.value || target.getAttribute('aria-valuenow') || '0');
            const max = parseFloat(target.getAttribute('data-haptic-max') || target.max || target.getAttribute('aria-valuemax') || '24');
            this.playRotaryStep(isNaN(step) ? 0 : step, isNaN(max) ? 24 : max, spatialOpts);
            break;
          }
          case 'detent':
            this.playDetent(spatialOpts);
            break;
          case 'chord':
          case 'success':
          case 'success-chord':
            this.playSuccessChord(spatialOpts);
            break;
          case 'thud':
          case 'dull-thud':
          case 'impact':
          case 'drop':
            this.playDullThud(spatialOpts);
            break;
          case 'mech-switch':
          case 'mechanical-switch':
          case 'mechanical': {
            const isChecked = target.checked !== undefined ? target.checked : (target.getAttribute('aria-checked') !== 'false');
            this.playMechanicalSwitch(isChecked, spatialOpts);
            break;
          }
          case 'pop':
            this.playPop(spatialOpts);
            break;
          case 'chime':
            this.playChime(spatialOpts);
            break;
          case 'switch':
          case 'tab':
            this.playTabSwitch(spatialOpts);
            break;
          case 'toggle': {
            const isChecked = target.checked !== undefined ? target.checked : (target.getAttribute('aria-checked') !== 'false');
            this.playToggle(isChecked, spatialOpts);
            break;
          }
          case 'click':
          default:
            this.playClick(spatialOpts);
            break;
        }
      };

      targetRoot.addEventListener('click', handleAction, { passive: true });
      targetRoot.addEventListener('input', handleAction, { passive: true });
      return () => {
        targetRoot.removeEventListener('click', handleAction);
        targetRoot.removeEventListener('input', handleAction);
      };
    }
  }

  const haptics = new WebAudioHapticsEngine();

  // ==========================================================================
  // 3. DYNAMIC SPOTLIGHT TRACKER (Rọi Đèn Chuột & Viền Phản Quang Specular)
  // ==========================================================================
  class SpotlightTracker {
    constructor() {
      this.cards = [];
      this.root = document.documentElement;
      this.init();
    }

    init() {
      this.cards = Array.from(document.querySelectorAll('[data-spotlight], .acrylic-card, .specular-card'));

      let ticking = false;
      let lastX = -1000;
      let lastY = -1000;

      const onPointerMove = (e) => {
        lastX = e.clientX;
        lastY = e.clientY;

        // Set global root coordinates immediately for zero-lag ambient glow
        this.root.style.setProperty('--mouse-x', `${lastX}px`);
        this.root.style.setProperty('--mouse-y', `${lastY}px`);

        if (!ticking) {
          window.requestAnimationFrame(() => {
            // Update card-local coordinates for cards in viewport vicinity
            for (let i = 0; i < this.cards.length; i++) {
              const card = this.cards[i];
              const rect = card.getBoundingClientRect();

              // Only calculate if cursor is reasonably close (within 400px)
              if (
                lastX >= rect.left - 400 &&
                lastX <= rect.right + 400 &&
                lastY >= rect.top - 400 &&
                lastY <= rect.bottom + 400
              ) {
                const cardX = lastX - rect.left;
                const cardY = lastY - rect.top;
                card.style.setProperty('--card-x', `${cardX}px`);
                card.style.setProperty('--card-y', `${cardY}px`);
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      // Bug Fix 1: Bind ONLY ONE event type (pointermove if supported, otherwise mousemove)
      // to eliminate 2x duplicate listener execution per mouse pixel motion.
      const moveEvent = 'PointerEvent' in window ? 'pointermove' : 'mousemove';
      window.addEventListener(moveEvent, onPointerMove, { passive: true });
    }

    refresh() {
      this.cards = Array.from(document.querySelectorAll('[data-spotlight], .acrylic-card, .specular-card'));
    }
  }

  // ==========================================================================
  // 4. 3D PARALLAX TILT ENGINE (Động cơ Nghiêng Phối Cảnh 3D Thẻ Acrylic)
  // ==========================================================================
  class ParallaxTiltEngine {
    constructor() {
      this.tiltElements = [];
      this.init();
    }

    init() {
      this.tiltElements = Array.from(document.querySelectorAll('[data-tilt]'));
      this.tiltElements.forEach((el) => this._bindElement(el));
    }

    _bindElement(el) {
      // Bug Fix 2: Guard against duplicate event listeners on refresh()
      if (el.__wowTiltBound) return;
      el.__wowTiltBound = true;

      const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 10;
      const perspective = el.getAttribute('data-tilt-perspective') || '1000px';
      const scale = parseFloat(el.getAttribute('data-tilt-scale')) || 1.02;

      el.style.transformStyle = 'preserve-3d';

      const telemetryPitch = el.querySelector('[data-tilt-pitch]');
      const telemetryRoll = el.querySelector('[data-tilt-roll]');

      const onMouseMove = (e) => {
        if (isTestMode) return;
        // Bug Fix 10: Clear transition during active mouse movement to eliminate 120ms cursor lag
        el.style.transition = 'none';

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const rotateX = (-percentY * maxTilt).toFixed(2);
        const rotateY = (percentX * maxTilt).toFixed(2);

        el.style.transform = `perspective(${perspective}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        if (telemetryPitch) telemetryPitch.textContent = `${rotateX > 0 ? '+' : ''}${rotateX}°`;
        if (telemetryRoll) telemetryRoll.textContent = `${rotateY > 0 ? '+' : ''}${rotateY}°`;
      };

      const onMouseEnter = () => {
        el.style.transition = 'transform 0.05s ease-out';
      };

      const onMouseLeave = () => {
        // Smooth spring return to equilibrium
        el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1.61, 0.36, 1)';
        el.style.transform = `perspective(${perspective}) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

        if (telemetryPitch) telemetryPitch.textContent = '0.0°';
        if (telemetryRoll) telemetryRoll.textContent = '0.0°';
      };

      el.addEventListener('mousemove', onMouseMove, { passive: true });
      el.addEventListener('mouseenter', onMouseEnter, { passive: true });
      el.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }
  }

  // ==========================================================================
  // 5. MAGNETIC BUTTON CONTROLLER (Nút Bấm Nam Châm & Lún Cơ Học)
  // ==========================================================================
  class MagneticButtonController {
    constructor() {
      this.buttons = [];
      this.init();
    }

    init() {
      this.buttons = Array.from(document.querySelectorAll('[data-magnetic], .btn-magnetic'));
      this.buttons.forEach((btn) => this._bindButton(btn));
    }

    _bindButton(btn) {
      // Bug Fix 2: Guard against duplicate event listeners on refresh()
      if (btn.__wowMagBound) return;
      btn.__wowMagBound = true;

      const pullFactor = parseFloat(btn.getAttribute('data-magnetic-pull')) || 0.32;
      const readoutEl = btn.querySelector('[data-magnetic-readout]') || document.querySelector(btn.getAttribute('data-readout-target'));

      const onMouseMove = (e) => {
        if (isTestMode) return;
        // Bug Fix 10: Clear transition during active mouse movement to eliminate 100ms lag
        btn.style.transition = 'none';

        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = (e.clientX - centerX) * pullFactor;
        const dy = (e.clientY - centerY) * pullFactor;

        // Bug Fix 4: Set CSS variables --mag-x and --mag-y so :active rule preserves translation!
        btn.style.setProperty('--mag-x', `${dx.toFixed(1)}px`);
        btn.style.setProperty('--mag-y', `${dy.toFixed(1)}px`);
        btn.style.transform = `translate(var(--mag-x, 0px), var(--mag-y, 0px))`;

        if (readoutEl) {
          readoutEl.textContent = `ΔX: ${dx.toFixed(1)}px | ΔY: ${dy.toFixed(1)}px`;
        }
      };

      const onMouseEnter = () => {
        btn.style.transition = 'none';
      };

      const onMouseLeave = () => {
        // Spring return on exit
        btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1.61, 0.36, 1)';
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
        btn.style.transform = 'translate(0px, 0px)';
        if (readoutEl) {
          readoutEl.textContent = 'ΔX: 0.0px | ΔY: 0.0px';
        }
      };

      btn.addEventListener('mousemove', onMouseMove, { passive: true });
      btn.addEventListener('mouseenter', onMouseEnter, { passive: true });
      btn.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }
  }

  // ==========================================================================
  // 6. LENIS SMOOTH SCROLL INTEGRATION (Cuộn Mượt Quán Tính & Safe Fallback)
  // ==========================================================================
  class SmoothScrollManager {
    constructor() {
      this.lenis = null;
      this.init();
    }

    init() {
      if (isTestMode) {
        console.info('[WowEngine] Lenis disabled in test-mode for instant scroll testing');
        return;
      }

      if (typeof window.Lenis !== 'undefined') {
        try {
          this.lenis = new window.Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
          });

          let lenisRafId = null;
          const raf = (time) => {
            if (this.lenis && !isTestMode) {
              if (typeof document !== 'undefined' && document.hidden) {
                lenisRafId = null;
                return;
              }
              this.lenis.raf(time);
              lenisRafId = requestAnimationFrame(raf);
            }
          };
          lenisRafId = requestAnimationFrame(raf);

          if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
              if (!document.hidden && this.lenis && !isTestMode && !lenisRafId) {
                lenisRafId = requestAnimationFrame(raf);
              } else if (document.hidden && lenisRafId) {
                cancelAnimationFrame(lenisRafId);
                lenisRafId = null;
              }
            });
          }

          // Connect with GSAP ScrollTrigger if present
          if (typeof window.ScrollTrigger !== 'undefined' && typeof window.gsap !== 'undefined') {
            this.lenis.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add((time) => {
              if (this.lenis && !isTestMode) {
                this.lenis.raf(time * 1000);
              }
            });
            window.gsap.ticker.lagSmoothing(0);
          }
          console.info('[WowEngine] Lenis Smooth Scroll initialized successfully');
        } catch (e) {
          console.warn('[WowEngine] Lenis initialization error, running native smooth scroll:', e);
        }
      } else {
        console.info('[WowEngine] Native smooth scroll active (Lenis CDN offline or deferred)');
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    }

    scrollTo(target, options = {}) {
      if (this.lenis && !isTestMode) {
        this.lenis.scrollTo(target, options);
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) {
          el.scrollIntoView({ behavior: isTestMode ? 'auto' : 'smooth' });
        }
      }
    }
  }

  // ==========================================================================
  // 7. GSAP 60 FPS MOTION TIMELINES & ENTRANCES (Chuyển Động Điện Ảnh)
  // ==========================================================================
  function initMotionSequences() {
    if (isTestMode) {
      // Instant reveal for test mode: all elements visible immediately
      document.querySelectorAll('.animate-entrance, [data-reveal]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
      return;
    }

    if (typeof window.gsap !== 'undefined') {
      const gsap = window.gsap;

      // Register ScrollTrigger if available
      if (typeof window.ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(window.ScrollTrigger);
      }

      // Hero Title Stagger Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-badge', { y: -20, opacity: 0, duration: 0.6, delay: 0.1 })
        .from('.hero-title-line', { y: 35, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .from('.hero-subhead', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.hero-telemetry-ribbon', { y: 15, opacity: 0, duration: 0.5 }, '-=0.2');

      // Scroll reveals for cards
      if (typeof window.ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.acrylic-card').forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              once: true,
            },
            y: 25,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
          });
        });
        window.ScrollTrigger.refresh();
      }
    } else {
      // Pure CSS fallback reveal
      document.querySelectorAll('.animate-entrance').forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, index * 80);
      });
    }
  }

  // ==========================================================================
  // 8. GLOBAL HAPTIC EVENT DELEGATION (Tự Động Bắt Sự Kiện Xúc Giác)
  // ==========================================================================
  function initHapticDelegation() {
    const resolveSpatial = (el, e) => {
      if (!el || typeof el.getAttribute !== 'function') return null;
      const attr = el.getAttribute('data-haptic-spatial');
      if (attr === null || attr === undefined || attr === 'false') return null;
      if (attr !== '' && attr !== 'true' && !isNaN(parseFloat(attr))) {
        return { pan: parseFloat(attr), element: el };
      }
      return { clientX: e && typeof e.clientX === 'number' ? e.clientX : undefined, element: el };
    };

    document.addEventListener('click', (e) => {
      // Don't duplicate click sound if clicking on sound toggle button or V2 soundboard pads (handled explicitly)
      if (e.target.closest('#soundToggleBtn, .haptic-pad-v2, [data-sound-trigger]')) return;

      const target = e.target.closest('[data-haptic], button, .btn-magnetic, .acrylic-tab, .tactile-switch');
      if (!target) return;

      const hapticType = (target.getAttribute('data-haptic') || 'click').toLowerCase();
      const spatialOpts = resolveSpatial(target, e);

      switch (hapticType) {
        case 'rotary':
        case 'rotary-step': {
          const step = parseFloat(target.getAttribute('data-haptic-step') || target.value || target.getAttribute('aria-valuenow') || '0');
          const max = parseFloat(target.getAttribute('data-haptic-max') || target.max || target.getAttribute('aria-valuemax') || '24');
          haptics.playRotaryStep(isNaN(step) ? 0 : step, isNaN(max) ? 24 : max, spatialOpts);
          break;
        }
        case 'chord':
        case 'success':
        case 'success-chord':
          haptics.playSuccessChord(spatialOpts);
          break;
        case 'thud':
        case 'dull-thud':
          haptics.playDullThud(spatialOpts);
          break;
        case 'mech-switch':
        case 'mechanical-switch': {
          const isChecked = target.checked !== undefined ? target.checked : (target.getAttribute('aria-checked') !== 'false');
          haptics.playMechanicalSwitch(isChecked, spatialOpts);
          break;
        }
        case 'pop':
          haptics.playPop(spatialOpts);
          break;
        case 'switch': {
          const isChecked = target.getAttribute('aria-checked') === 'true' || target.classList.contains('active') || target.checked === true;
          haptics.playSwitch(!isChecked, spatialOpts);
          break;
        }
        case 'chime':
          haptics.playChime(spatialOpts);
          break;
        case 'detent':
          haptics.playDetent(spatialOpts);
          break;
        case 'click':
        default:
          haptics.playClick(spatialOpts);
          break;
      }
    });

    // Detent & rotary feedback on sliders/inputs
    document.addEventListener(
      'input',
      (e) => {
        if (e.target.matches('input[type="range"], .rotary-slider, [data-haptic="rotary"], [data-haptic="rotary-step"]')) {
          const step = parseFloat(e.target.value || e.target.getAttribute('data-haptic-step') || '0');
          const max = parseFloat(e.target.max || e.target.getAttribute('data-haptic-max') || '24');
          const spatialOpts = resolveSpatial(e.target, e);
          haptics.playRotaryStep(isNaN(step) ? 0 : step, isNaN(max) ? 24 : max, spatialOpts);
        }
      },
      { passive: true }
    );
  }

  // ==========================================================================
  // 9. ENGINE LIFECYCLE & GLOBAL EXPORT (Khởi động & Xuất Bản Toàn Cục)
  // ==========================================================================
  let spotlightInstance = null;
  let parallaxInstance = null;
  let magneticInstance = null;
  let scrollManagerInstance = null;

  function initWowEngine() {
    spotlightInstance = new SpotlightTracker();
    parallaxInstance = new ParallaxTiltEngine();
    magneticInstance = new MagneticButtonController();
    scrollManagerInstance = new SmoothScrollManager();

    initMotionSequences();
    initHapticDelegation();

    console.info('[WowEngine] All 6 Wow Engine modules loaded and operational');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWowEngine);
  } else {
    initWowEngine();
  }

  // Export to window for external scripting and automated test harnesses
  window.WowEngine = {
    get isTestMode() {
      return isTestMode;
    },
    set isTestMode(val) {
      if (val !== isTestMode) {
        applyMotionMode(val);
      }
    },
    setTestMode: applyMotionMode,
    haptics,
    WebAudioHaptics: WebAudioHapticsEngine,
    HAPTIC_PATTERNS,
    canVibrate,
    get spotlight() {
      return spotlightInstance;
    },
    get parallax() {
      return parallaxInstance;
    },
    get magnetic() {
      return magneticInstance;
    },
    get scroll() {
      return scrollManagerInstance;
    },
    refresh() {
      if (spotlightInstance) spotlightInstance.refresh();
      if (parallaxInstance) parallaxInstance.init();
      if (magneticInstance) magneticInstance.init();
    },
  };
  window.WebAudioHaptics = WebAudioHapticsEngine;
  window.haptics = haptics;
  window.HAPTIC_PATTERNS = HAPTIC_PATTERNS;
  window.canVibrate = canVibrate;
})(window, document);
