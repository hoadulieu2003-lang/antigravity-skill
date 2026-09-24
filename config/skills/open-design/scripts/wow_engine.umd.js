/**
 * ⚡ WOW ENGINE (UMD / Standalone Global Bundle)
 * ===============================================
 * Universal standalone UMD/Global build of WowEngine for direct <script src="..."> tags,
 * legacy browsers, Electron, and local file:// protocols without CORS restrictions.
 *
 * Core Modules:
 *  - initSpotlight(selector, options)
 *  - initParallaxTilt(selector, options)
 *  - WebAudioHaptics / haptics
 *  - initSmoothScroll(options)
 *  - WowEngine.initAll(options)
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.WowEngine = exports;
    global.initSpotlight = exports.initSpotlight;
    global.initParallaxTilt = exports.initParallaxTilt;
    global.WebAudioHaptics = exports.WebAudioHaptics;
    global.haptics = exports.haptics;
    global.initSmoothScroll = exports.initSmoothScroll;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function prefersReducedMotion() {
    if (!isBrowser() || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function resolveElements(target) {
    if (!isBrowser() || !target) return [];
    if (typeof target === 'string') {
      try {
        return Array.from(document.querySelectorAll(target));
      } catch {
        return [];
      }
    }
    if (target instanceof Element) return [target];
    if (target instanceof NodeList || Array.isArray(target) || target instanceof HTMLCollection) {
      return Array.from(target).filter((el) => el instanceof Element);
    }
    return [];
  }

  // 1. Spotlight
  function initSpotlight(selector, options = {}) {
    if (!isBrowser()) return { destroy: () => {}, update: () => {} };

    const {
      proximity = 0,
      activeClass = 'is-spotlight-active',
      relativeRatio = true,
      centeredCoords = true,
      onMove = null,
    } = options;

    const elements = resolveElements(selector);
    if (!elements.length) return { destroy: () => {}, update: () => {} };

    const cleanups = [];

    elements.forEach((el) => {
      let rafId = null;
      let rect = el.getBoundingClientRect();
      let isHovering = false;
      let pendingEvent = null;

      function refreshRect() {
        rect = el.getBoundingClientRect();
      }

      function scheduleUpdate(e) {
        pendingEvent = e;
        if (!rafId) rafId = requestAnimationFrame(render);
      }

      function render() {
        rafId = null;
        if (!pendingEvent) return;

        const x = pendingEvent.clientX - rect.left;
        const y = pendingEvent.clientY - rect.top;
        const width = rect.width || 1;
        const height = rect.height || 1;
        const rx = clamp(x / width, 0, 1);
        const ry = clamp(y / height, 0, 1);

        el.style.setProperty('--mouse-x', `${Math.round(x)}px`);
        el.style.setProperty('--mouse-y', `${Math.round(y)}px`);
        el.style.setProperty('--spotlight-opacity', '1');

        if (relativeRatio) {
          el.style.setProperty('--mouse-rx', rx.toFixed(4));
          el.style.setProperty('--mouse-ry', ry.toFixed(4));
        }

        if (centeredCoords) {
          el.style.setProperty('--mouse-cx', ((rx - 0.5) * 2).toFixed(4));
          el.style.setProperty('--mouse-cy', ((ry - 0.5) * 2).toFixed(4));
        }

        if (typeof onMove === 'function') {
          onMove(pendingEvent, { x, y, rx, ry, width, height, element: el });
        }
      }

      function onPointerEnter(e) {
        isHovering = true;
        refreshRect();
        if (activeClass) el.classList.add(activeClass);
        scheduleUpdate(e);
      }

      function onPointerMove(e) {
        if (!isHovering) {
          isHovering = true;
          refreshRect();
          if (activeClass) el.classList.add(activeClass);
        }
        scheduleUpdate(e);
      }

      function onPointerLeave() {
        isHovering = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        el.style.setProperty('--spotlight-opacity', '0');
        if (activeClass) el.classList.remove(activeClass);
      }

      el.addEventListener('pointerenter', onPointerEnter, { passive: true });
      el.addEventListener('pointermove', onPointerMove, { passive: true });
      el.addEventListener('pointerleave', onPointerLeave, { passive: true });
      window.addEventListener('resize', refreshRect, { passive: true });
      window.addEventListener('scroll', refreshRect, { passive: true });

      el.style.setProperty('--spotlight-opacity', '0');

      cleanups.push(() => {
        if (rafId) cancelAnimationFrame(rafId);
        el.removeEventListener('pointerenter', onPointerEnter);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('resize', refreshRect);
        window.removeEventListener('scroll', refreshRect);
        el.style.removeProperty('--mouse-x');
        el.style.removeProperty('--mouse-y');
        el.style.removeProperty('--mouse-rx');
        el.style.removeProperty('--mouse-ry');
        el.style.removeProperty('--mouse-cx');
        el.style.removeProperty('--mouse-cy');
        el.style.removeProperty('--spotlight-opacity');
        if (activeClass) el.classList.remove(activeClass);
      });
    });

    return {
      destroy: () => cleanups.forEach((fn) => fn()),
      update: () => elements.forEach((el) => el.getBoundingClientRect()),
    };
  }

  // 2. Parallax Tilt
  function initParallaxTilt(selector, options = {}) {
    if (!isBrowser() || prefersReducedMotion()) {
      return { destroy: () => {}, reset: () => {} };
    }

    const {
      maxTilt = 12,
      perspective = 1000,
      scale = 1.04,
      stiffness = 0.08,
      damping = 0.78,
      reverse = false,
      glare = false,
      glareMaxOpacity = 0.3,
      axis = 'both',
    } = options;

    const elements = resolveElements(selector);
    if (!elements.length) return { destroy: () => {}, reset: () => {} };

    const cleanups = [];

    elements.forEach((card) => {
      let currentRotX = 0, currentRotY = 0, currentScale = 1.0;
      let targetRotX = 0, targetRotY = 0, targetScale = 1.0;
      let velX = 0, velY = 0, velScale = 0;
      let isHovering = false;
      let rafId = null;
      let rect = card.getBoundingClientRect();

      const originalTransform = card.style.transform;
      const originalTransformStyle = card.style.transformStyle;
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      let glareEl = null;
      if (glare) {
        glareEl = document.createElement('div');
        glareEl.className = 'wow-parallax-glare';
        Object.assign(glareEl.style, {
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: '0',
          transition: 'opacity 0.25s ease',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), transparent 70%)',
          mixBlendMode: 'overlay',
          zIndex: '10',
        });
        const computedPos = window.getComputedStyle(card).position;
        if (computedPos === 'static') card.style.position = 'relative';
        card.appendChild(glareEl);
      }

      const depthChildren = Array.from(card.querySelectorAll('[data-parallax-depth], [data-depth]')).map((child) => {
        const val = parseFloat(child.getAttribute('data-parallax-depth') || child.getAttribute('data-depth') || '0.3');
        return { el: child, depth: isNaN(val) ? 0.3 : val };
      });

      function refreshRect() {
        rect = card.getBoundingClientRect();
      }

      function onPointerEnter() {
        isHovering = true;
        refreshRect();
        targetScale = scale;
        if (glareEl) glareEl.style.opacity = `${glareMaxOpacity}`;
        startAnimation();
      }

      function onPointerMove(e) {
        if (!isHovering) {
          isHovering = true;
          refreshRect();
          targetScale = scale;
          if (glareEl) glareEl.style.opacity = `${glareMaxOpacity}`;
        }

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width || 1;
        const height = rect.height || 1;

        const normX = clamp((x / width - 0.5) * 2, -1, 1);
        const normY = clamp((y / height - 0.5) * 2, -1, 1);
        const dir = reverse ? -1 : 1;

        if (axis === 'both' || axis === 'y') targetRotY = normX * maxTilt * dir;
        if (axis === 'both' || axis === 'x') targetRotX = -normY * maxTilt * dir;

        if (glareEl) {
          const gx = clamp((x / width) * 100, 0, 100);
          const gy = clamp((y / height) * 100, 0, 100);
          glareEl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.7), transparent 60%)`;
        }

        startAnimation();
      }

      function onPointerLeave() {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
        targetScale = 1.0;
        if (glareEl) glareEl.style.opacity = '0';
        startAnimation();
      }

      function startAnimation() {
        if (!rafId) rafId = requestAnimationFrame(stepSpring);
      }

      function stepSpring() {
        velX = (velX + (targetRotX - currentRotX) * stiffness) * damping;
        currentRotX += velX;

        velY = (velY + (targetRotY - currentRotY) * stiffness) * damping;
        currentRotY += velY;

        velScale = (velScale + (targetScale - currentScale) * stiffness) * damping;
        currentScale += velScale;

        card.style.transform = `perspective(${perspective}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

        if (depthChildren.length) {
          depthChildren.forEach(({ el, depth }) => {
            const sx = (currentRotY * depth * 2.2).toFixed(2);
            const sy = (-currentRotX * depth * 2.2).toFixed(2);
            const sz = (depth * 45).toFixed(1);
            el.style.transform = `translate3d(${sx}px, ${sy}px, ${sz}px)`;
          });
        }

        const isResting =
          !isHovering &&
          Math.abs(currentRotX) < 0.05 &&
          Math.abs(currentRotY) < 0.05 &&
          Math.abs(currentScale - 1.0) < 0.002 &&
          Math.abs(velX) < 0.02 &&
          Math.abs(velY) < 0.02 &&
          Math.abs(velScale) < 0.001;

        if (isResting) {
          currentRotX = 0; currentRotY = 0; currentScale = 1.0;
          velX = 0; velY = 0; velScale = 0;
          card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          if (depthChildren.length) {
            depthChildren.forEach(({ el }) => { el.style.transform = 'translate3d(0px, 0px, 0px)'; });
          }
          rafId = null;
        } else {
          rafId = requestAnimationFrame(stepSpring);
        }
      }

      card.addEventListener('pointerenter', onPointerEnter, { passive: true });
      card.addEventListener('pointermove', onPointerMove, { passive: true });
      card.addEventListener('pointerleave', onPointerLeave, { passive: true });
      window.addEventListener('resize', refreshRect, { passive: true });
      window.addEventListener('scroll', refreshRect, { passive: true });

      cleanups.push(() => {
        if (rafId) cancelAnimationFrame(rafId);
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('resize', refreshRect);
        window.removeEventListener('scroll', refreshRect);
        card.style.transform = originalTransform;
        card.style.transformStyle = originalTransformStyle;
        card.style.willChange = '';
        if (glareEl && glareEl.parentNode) glareEl.parentNode.removeChild(glareEl);
        depthChildren.forEach(({ el }) => { el.style.transform = ''; });
      });
    });

    return {
      destroy: () => cleanups.forEach((fn) => fn()),
      reset: () => {
        elements.forEach((card) => {
          card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
      },
    };
  }

  // 3. WebAudioHaptics
  class WebAudioHaptics {
    constructor(options = {}) {
      this.ctx = null;
      this.isMuted = options.muted || false;
      this.masterVolume = typeof options.volume === 'number' ? clamp(options.volume, 0, 1) : 1.0;
      this.masterGainNode = null;
      this._unlocked = false;

      if (isBrowser()) this._bindAutoUnlock();
    }

    getContext() {
      if (!isBrowser()) return null;
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          try {
            this.ctx = new AudioCtxClass();
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

    _bindAutoUnlock() {
      if (this._unlocked) return;
      const unlock = () => {
        this.getContext();
        this._unlocked = true;
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
    }

    getMuted() {
      return this.isMuted;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (!this.isMuted) this.playPop();
      return this.isMuted;
    }

    setVolume(volume) {
      this.masterVolume = clamp(volume, 0, 1);
      if (this.masterGainNode && this.ctx) {
        this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      }
    }

    getVolume() {
      return this.masterVolume;
    }

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

    playChime() {
      if (this.isMuted) return;
      try {
        const ctx = this.getContext();
        if (!ctx || !this.masterGainNode) return;
        const now = ctx.currentTime;
        const notes = [1046.5, 1318.5, 1567.98];

        notes.forEach((freq, index) => {
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

    bind(root = document) {
      if (!isBrowser || !root) return () => {};
      const handleClick = (e) => {
        const target = e.target.closest('[data-haptic]');
        if (!target) return;
        const soundType = target.getAttribute('data-haptic') || 'click';
        if (soundType === 'pop') this.playPop();
        else if (soundType === 'chime') this.playChime();
        else if (soundType === 'switch' || soundType === 'tab') this.playTabSwitch();
        else this.playClick();
      };
      root.addEventListener('click', handleClick, { passive: true });
      return () => root.removeEventListener('click', handleClick);
    }
  }

  const haptics = new WebAudioHaptics();

  // 4. Smooth Scroll
  function initSmoothScroll(options = {}) {
    if (!isBrowser || prefersReducedMotion()) {
      return {
        destroy: () => {},
        scrollTo: (target, scrollOpts = {}) => {
          const dest = typeof target === 'number' ? target : resolveElements(target)[0]?.offsetTop || 0;
          if (isBrowser) window.scrollTo({ top: dest, behavior: scrollOpts.immediate ? 'instant' : 'smooth' });
        },
        stop: () => {},
        start: () => {},
        onScroll: () => () => {},
      };
    }

    const {
      lerp: lerpFactor = 0.09,
      wheelMultiplier = 1.0,
      smoothTouch = false,
      autoResize = true,
      onScroll = null,
    } = options;

    let currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
    let targetY = currentY;
    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    let isRunning = false;
    let isPaused = false;
    let rafId = null;
    const scrollListeners = new Set();
    if (typeof onScroll === 'function') scrollListeners.add(onScroll);

    function updateMaxScroll() {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function emitScroll(velocity) {
      const progress = maxScroll > 0 ? clamp(currentY / maxScroll, 0, 1) : 0;
      const scrollData = {
        scroll: currentY,
        target: targetY,
        limit: maxScroll,
        velocity,
        progress,
        direction: velocity >= 0 ? 1 : -1,
      };
      scrollListeners.forEach((fn) => {
        try { fn(scrollData); } catch {}
      });
    }

    function tick() {
      if (isPaused) {
        isRunning = false;
        rafId = null;
        return;
      }

      const diff = targetY - currentY;
      const velocity = diff * lerpFactor;
      currentY += velocity;

      window.scrollTo({ top: Math.round(currentY), behavior: 'instant' });
      emitScroll(velocity);

      if (Math.abs(diff) > 0.4) {
        rafId = requestAnimationFrame(tick);
      } else {
        currentY = targetY;
        window.scrollTo({ top: Math.round(currentY), behavior: 'instant' });
        emitScroll(0);
        isRunning = false;
        rafId = null;
      }
    }

    function startLoop() {
      if (!isRunning && !isPaused) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    function onWheel(e) {
      if (e.ctrlKey) return;
      updateMaxScroll();

      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 40;
      else if (e.deltaMode === 2) deltaY *= window.innerHeight;

      deltaY *= wheelMultiplier;
      targetY = clamp(targetY + deltaY, 0, maxScroll);
      startLoop();
    }

    function onNativeScroll() {
      if (isRunning) return;
      currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
      targetY = currentY;
    }

    function onAnchorClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        scrollTo(targetEl, { offset: 0 });
      }
    }

    function scrollTo(target, scrollOpts = {}) {
      updateMaxScroll();
      let destY = 0;
      if (typeof target === 'number') {
        destY = target;
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) destY = el.getBoundingClientRect().top + window.pageYOffset;
      } else if (target instanceof Element) {
        destY = target.getBoundingClientRect().top + window.pageYOffset;
      }

      const offset = scrollOpts.offset || 0;
      destY = clamp(destY + offset, 0, maxScroll);

      if (scrollOpts.immediate) {
        currentY = destY;
        targetY = destY;
        window.scrollTo({ top: Math.round(destY), behavior: 'instant' });
        emitScroll(0);
      } else {
        targetY = destY;
        startLoop();
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    document.addEventListener('click', onAnchorClick, { passive: false });
    if (autoResize) window.addEventListener('resize', updateMaxScroll, { passive: true });

    return {
      destroy: () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('scroll', onNativeScroll);
        document.removeEventListener('click', onAnchorClick);
        if (autoResize) window.removeEventListener('resize', updateMaxScroll);
        scrollListeners.clear();
      },
      scrollTo,
      stop: () => {
        isPaused = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        isRunning = false;
      },
      start: () => {
        isPaused = false;
        startLoop();
      },
      onScroll: (cb) => {
        if (typeof cb === 'function') {
          scrollListeners.add(cb);
          return () => scrollListeners.delete(cb);
        }
        return () => {};
      },
    };
  }

  // 5. Master Suite
  const WowEngine = {
    version: '2.0.0',
    initSpotlight,
    initParallaxTilt,
    WebAudioHaptics,
    haptics,
    initSmoothScroll,
    initAll(config = {}) {
      if (!isBrowser) return { destroy: () => {} };
      const cleanups = [];
      if (config.spotlight !== false) {
        cleanups.push(initSpotlight('[data-spotlight]', typeof config.spotlight === 'object' ? config.spotlight : {}).destroy);
      }
      if (config.parallax !== false) {
        cleanups.push(initParallaxTilt('[data-parallax-tilt]', typeof config.parallax === 'object' ? config.parallax : {}).destroy);
      }
      if (config.haptics !== false) {
        cleanups.push(haptics.bind(document));
      }
      if (config.smoothScroll !== false) {
        cleanups.push(initSmoothScroll(typeof config.smoothScroll === 'object' ? config.smoothScroll : {}).destroy);
      }
      return { destroy: () => cleanups.forEach((fn) => fn()) };
    },
  };

  if (isBrowser) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('[data-wow-auto]')) WowEngine.initAll();
      });
    } else if (document.querySelector('[data-wow-auto]')) {
      WowEngine.initAll();
    }
  }

  return WowEngine;
});
