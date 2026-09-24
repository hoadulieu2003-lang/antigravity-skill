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
  const isTestMode = urlParams.get('test-mode') === '1' || window.__TEST_MODE__ === true;

  if (isTestMode) {
    document.documentElement.classList.add('test-mode');
    document.documentElement.setAttribute('data-test-mode', 'true');
    console.info('[WowEngine] Dual-Mode Motion: TEST-MODE ACTIVE (0ms instant execution, transitions bypassed)');
  } else {
    document.documentElement.classList.add('kinetic-mode');
    document.documentElement.setAttribute('data-test-mode', 'false');
    console.info('[WowEngine] Dual-Mode Motion: 60 FPS KINETIC GSAP ACTIVE');
  }

  // ==========================================================================
  // 2. WEBAUDIO HAPTICS ENGINE (Cỗ máy Tổng hợp Âm thanh Xúc giác)
  // ==========================================================================
  class WebAudioHapticsEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.listeners = new Set();
      this.hasUserInteracted = false;
      this.onAudioTrigger = null; // Callback for visualizers

      this._initAutoplayUnlock();
    }

    _initAutoplayUnlock() {
      const unlock = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this._getContext();
        }
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    }

    _getContext() {
      if (this.isMuted) return null;
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.ctx = new AudioCtx();
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
      this.listeners.forEach((cb) => cb(this.isMuted));
      return this.isMuted;
    }

    toggleMute() {
      this.setMuted(!this.isMuted);
      if (!this.isMuted) {
        this._getContext();
        this.playPop();
      }
      return this.isMuted;
    }

    subscribe(cb) {
      this.listeners.add(cb);
      return () => this.listeners.delete(cb);
    }

    // 1. Mechanical Click: Crisp high-frequency transient (Nút bấm cơ học)
    playClick() {
      if (isTestMode) return;
      const ctx = this._getContext();
      if (!ctx) return;
      this.notify('click');
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.018);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.022);
      } catch (_) {}
    }

    // 2. Soft Tactile Pop: Bubble actuation (Mở hộp thoại, thẻ chip)
    playPop() {
      if (isTestMode) return;
      const ctx = this._getContext();
      if (!ctx) return;
      this.notify('pop');
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.035);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    }

    // 3. Switch Clack: Double pulse mechanical bottom-out (Công tắc cơ)
    playSwitch(state = true) {
      if (isTestMode) return;
      const ctx = this._getContext();
      if (!ctx) return;
      this.notify('switch');
      try {
        const now = ctx.currentTime;
        const baseFreq = state ? 840 : 620;

        // Primary snap
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(200, now + 0.022);

        gain1.gain.setValueAtTime(0.09, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.028);

        // Secondary bottom-out thud
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(240, now + 0.006);
        osc2.frequency.exponentialRampToValueAtTime(75, now + 0.038);

        gain2.gain.setValueAtTime(0.14, now + 0.006);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.006);
        osc2.stop(now + 0.045);
      } catch (_) {}
    }

    // 4. Harmonic Chime: Success notification chord (Chuông xác nhận thành công)
    playChime() {
      if (isTestMode) return;
      const ctx = this._getContext();
      if (!ctx) return;
      this.notify('chime');
      try {
        const now = ctx.currentTime;
        // Triad frequencies: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.035;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.38);
        });
      } catch (_) {}
    }

    // 5. Rotary Detent Tick: High-density micro detent (Răng cưa núm xoay)
    playDetent() {
      if (isTestMode) return;
      const ctx = this._getContext();
      if (!ctx) return;
      this.notify('detent');
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.012);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.014);
      } catch (_) {}
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

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('mousemove', onPointerMove, { passive: true });
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
      const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 10;
      const perspective = el.getAttribute('data-tilt-perspective') || '1000px';
      const scale = parseFloat(el.getAttribute('data-tilt-scale')) || 1.02;

      el.style.transformStyle = 'preserve-3d';
      if (!el.parentElement.style.perspective) {
        el.parentElement.style.perspective = perspective;
      }

      let isHovered = false;
      const telemetryPitch = el.querySelector('[data-tilt-pitch]');
      const telemetryRoll = el.querySelector('[data-tilt-roll]');

      const onMouseMove = (e) => {
        if (isTestMode) return;
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
        isHovered = true;
        el.style.transition = 'transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)';
      };

      const onMouseLeave = () => {
        isHovered = false;
        el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
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
      const pullFactor = parseFloat(btn.getAttribute('data-magnetic-pull')) || 0.32;
      const readoutEl = btn.querySelector('[data-magnetic-readout]') || document.querySelector(btn.getAttribute('data-readout-target'));

      const onMouseMove = (e) => {
        if (isTestMode) return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = (e.clientX - centerX) * pullFactor;
        const dy = (e.clientY - centerY) * pullFactor;

        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;

        if (readoutEl) {
          readoutEl.textContent = `ΔX: ${dx.toFixed(1)}px | ΔY: ${dy.toFixed(1)}px`;
        }
      };

      const onMouseEnter = () => {
        btn.style.transition = 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)';
      };

      const onMouseLeave = () => {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1.61, 0.36, 1)'; // Spring overshoot return
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

          const raf = (time) => {
            if (this.lenis) {
              this.lenis.raf(time);
              requestAnimationFrame(raf);
            }
          };
          requestAnimationFrame(raf);

          // Connect with GSAP ScrollTrigger if present
          if (typeof window.ScrollTrigger !== 'undefined' && typeof window.gsap !== 'undefined') {
            this.lenis.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add((time) => {
              this.lenis.raf(time * 1000);
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
        gsap.utils.toArray('.acrylic-card, .bento-tile').forEach((card) => {
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
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-haptic], button, .btn-magnetic, .acrylic-tab, .tactile-switch');
      if (!target) return;

      const hapticType = target.getAttribute('data-haptic') || 'click';
      switch (hapticType) {
        case 'pop':
          haptics.playPop();
          break;
        case 'switch':
          const isChecked = target.getAttribute('aria-checked') === 'true' || target.classList.contains('active');
          haptics.playSwitch(!isChecked);
          break;
        case 'chime':
          haptics.playChime();
          break;
        case 'detent':
          haptics.playDetent();
          break;
        case 'click':
        default:
          haptics.playClick();
          break;
      }
    });

    // Detent feedback on sliders/inputs
    document.addEventListener(
      'input',
      (e) => {
        if (e.target.matches('input[type="range"], .rotary-slider')) {
          haptics.playDetent();
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
    isTestMode,
    haptics,
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
})(window, document);
