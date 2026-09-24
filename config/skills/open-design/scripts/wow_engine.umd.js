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

// =============================================================================
// 0. ENVIRONMENT & UTILITIES (Môi trường & Tiện ích bổ trợ)
// =============================================================================

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Clamp a number between min and max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Linear interpolation (Nội suy tuyến tính)
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Check if user prefers reduced motion (Kiểm tra tùy chọn giảm chuyển động tiếp cận)
 */
function prefersReducedMotion() {
  if (!isBrowser() || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve target elements from string selector, Element, or NodeList
 */
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

// =============================================================================
// 1. SPOTLIGHT ENGINE (Đèn rọi theo tọa độ chuột không giật lag)
// =============================================================================

/**
 * Initializes cursor spotlight effect on matching elements.
 * Updates CSS custom properties `--mouse-x`, `--mouse-y`, `--mouse-rx`, `--mouse-ry`, `--spotlight-opacity`.
 *
 * @param {string|Element|NodeList} selector - Target element(s) or CSS selector
 * @param {Object} [options]
 * @param {number} [options.proximity=0] - Additional detection radius in pixels outside bounding box
 * @param {string} [options.activeClass='is-spotlight-active'] - Class added when cursor is active
 * @param {boolean} [options.relativeRatio=true] - Exposes --mouse-rx (0..1) and --mouse-ry (0..1)
 * @param {boolean} [options.centeredCoords=true] - Exposes --mouse-cx (-1..1) and --mouse-cy (-1..1)
 * @param {Function} [options.onMove] - Optional callback on position change
 * @returns {Object} Control interface with destroy() and update()
 */
function initSpotlight(selector, options = {}) {
  if (!isBrowser()) {
    return { destroy: () => {}, update: () => {} };
  }

  const {
    proximity = 0,
    activeClass = 'is-spotlight-active',
    relativeRatio = true,
    centeredCoords = true,
    onMove = null,
  } = options;

  const elements = resolveElements(selector);
  if (!elements.length) {
    return { destroy: () => {}, update: () => {} };
  }

  const cleanups = [];
  const refreshFunctions = [];

  elements.forEach((el) => {
    let rafId = null;
    let rect = el.getBoundingClientRect();
    let isHovering = false;
    let pendingEvent = null;
    let pendingOpacity = 0;

    // Refresh cached bounding rect on scroll or resize
    function refreshRect() {
      rect = el.getBoundingClientRect();
    }
    refreshFunctions.push(refreshRect);

    function scheduleUpdate(e, opacity = 1) {
      pendingEvent = e;
      pendingOpacity = opacity;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    }

    function render() {
      rafId = null;
      if (!pendingEvent) return;

      const clientX = pendingEvent.clientX;
      const clientY = pendingEvent.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Calculate ratios
      const width = rect.width || 1;
      const height = rect.height || 1;
      const rx = clamp(x / width, 0, 1);
      const ry = clamp(y / height, 0, 1);

      // Direct write to element style (Zero layout thrashing)
      el.style.setProperty('--mouse-x', `${Math.round(x)}px`);
      el.style.setProperty('--mouse-y', `${Math.round(y)}px`);
      const opacityStr = pendingOpacity === 1 ? '1' : pendingOpacity === 0 ? '0' : pendingOpacity.toFixed(4);
      el.style.setProperty('--spotlight-opacity', opacityStr);

      if (relativeRatio) {
        el.style.setProperty('--mouse-rx', rx.toFixed(4));
        el.style.setProperty('--mouse-ry', ry.toFixed(4));
      }

      if (centeredCoords) {
        const cx = (rx - 0.5) * 2;
        const cy = (ry - 0.5) * 2;
        el.style.setProperty('--mouse-cx', cx.toFixed(4));
        el.style.setProperty('--mouse-cy', cy.toFixed(4));
      }

      if (typeof onMove === 'function') {
        onMove(pendingEvent, { x, y, rx, ry, width, height, element: el });
      }
    }

    function onPointerEnter(e) {
      isHovering = true;
      refreshRect();
      if (activeClass) el.classList.add(activeClass);
      scheduleUpdate(e, 1);
    }

    function onPointerMove(e) {
      if (!isHovering) {
        isHovering = true;
        refreshRect();
        if (activeClass) el.classList.add(activeClass);
      }
      scheduleUpdate(e, 1);
    }

    function onPointerLeave() {
      isHovering = false;
      pendingOpacity = 0;
      pendingEvent = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.setProperty('--spotlight-opacity', '0');
      if (activeClass) el.classList.remove(activeClass);
    }

    // Optional Window-level proximity tracker when proximity > 0
    function onWindowPointerMove(e) {
      const clientX = e.clientX;
      const clientY = e.clientY;

      const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
      const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist <= proximity) {
        if (!isHovering) {
          isHovering = true;
          if (activeClass) el.classList.add(activeClass);
        }
        const proximityOpacity = proximity > 0 ? (1 - dist / proximity) : 1;
        scheduleUpdate(e, proximityOpacity);
      } else if (isHovering) {
        onPointerLeave();
      }
    }

    // Attach listeners
    if (proximity > 0) {
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    } else {
      el.addEventListener('pointerenter', onPointerEnter, { passive: true });
      el.addEventListener('pointermove', onPointerMove, { passive: true });
      el.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    window.addEventListener('resize', refreshRect, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });

    // Initial state
    el.style.setProperty('--spotlight-opacity', '0');

    cleanups.push(() => {
      if (rafId) cancelAnimationFrame(rafId);
      if (proximity > 0) {
        window.removeEventListener('pointermove', onWindowPointerMove);
      } else {
        el.removeEventListener('pointerenter', onPointerEnter);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerleave', onPointerLeave);
      }
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
    update: () => refreshFunctions.forEach((fn) => fn()),
  };
}

// =============================================================================
// 2. PARALLAX TILT ENGINE (Nghiêng thẻ 3D Parallax với công thức lò xo đàn hồi)
// =============================================================================

/**
 * Initializes 3D card tilt with realistic damped harmonic spring physics.
 * Recreates the bouncy, responsive spring feel of Portfolio K18.
 *
 * @param {string|Element|NodeList} selector - Target element(s) or CSS selector
 * @param {Object} [options]
 * @param {number} [options.maxTilt=12] - Maximum tilt in degrees
 * @param {number} [options.perspective=1000] - CSS perspective distance in px
 * @param {number} [options.scale=1.04] - Scale factor when hovered
 * @param {number} [options.stiffness=0.08] - Spring stiffness constant (k)
 * @param {number} [options.damping=0.78] - Spring velocity damping factor
 * @param {boolean} [options.reverse=false] - Invert tilt direction
 * @param {boolean} [options.glare=false] - Auto-render specular reflection glare
 * @param {number} [options.glareMaxOpacity=0.3] - Maximum opacity of glare
 * @param {string} [options.axis='both'] - 'x', 'y', or 'both'
 * @returns {Object} Control interface with destroy(), reset(), and setValues()
 */
function initParallaxTilt(selector, options = {}) {
  if (!isBrowser()) {
    return { destroy: () => {}, reset: () => {}, setValues: () => {} };
  }

  // Respect OS reduced motion preference
  if (prefersReducedMotion()) {
    return { destroy: () => {}, reset: () => {}, setValues: () => {} };
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
  if (!elements.length) {
    return { destroy: () => {}, reset: () => {}, setValues: () => {} };
  }

  const cleanups = [];
  const cardControls = [];

  elements.forEach((card) => {
    // Current spring state
    let currentRotX = 0;
    let currentRotY = 0;
    let currentScale = 1.0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetScale = 1.0;

    // Velocity vectors
    let velX = 0;
    let velY = 0;
    let velScale = 0;

    let isHovering = false;
    let rafId = null;
    let rect = card.getBoundingClientRect();

    // Prepare 3D rendering context on card
    const originalTransform = card.style.transform;
    const originalTransformStyle = card.style.transformStyle;
    const originalPosition = card.style.position;
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    // Optional Glare element
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
      // Ensure card has position relative or absolute
      const computedPos = window.getComputedStyle(card).position;
      if (computedPos === 'static') {
        card.style.position = 'relative';
      }
      card.appendChild(glareEl);
    }

    // Children with [data-parallax-depth] or [data-depth]
    const depthChildren = Array.from(card.querySelectorAll('[data-parallax-depth], [data-depth]')).map((child) => {
      const depthVal = parseFloat(child.getAttribute('data-parallax-depth') || child.getAttribute('data-depth') || '0.3');
      return { el: child, depth: isNaN(depthVal) ? 0.3 : depthVal };
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

      const clientX = e.clientX;
      const clientY = e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const width = rect.width || 1;
      const height = rect.height || 1;

      // Normalized coordinates: -1.0 to +1.0
      const normX = clamp((x / width - 0.5) * 2, -1, 1);
      const normY = clamp((y / height - 0.5) * 2, -1, 1);

      const dirMultiplier = reverse ? -1 : 1;

      if (axis === 'both' || axis === 'y') {
        // Rotating along Y axis tilts left/right based on X coordinate
        targetRotY = normX * maxTilt * dirMultiplier;
      }
      if (axis === 'both' || axis === 'x') {
        // Rotating along X axis tilts up/down based on Y coordinate
        targetRotX = -normY * maxTilt * dirMultiplier;
      }

      // Update Glare position
      if (glareEl) {
        const glareX = clamp((x / width) * 100, 0, 100);
        const glareY = clamp((y / height) * 100, 0, 100);
        glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7), transparent 60%)`;
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
      if (!rafId) {
        rafId = requestAnimationFrame(stepSpring);
      }
    }

    // Damped harmonic spring physics tick (Phương trình dao động lò xo tắt dần)
    function stepSpring() {
      // RotX spring physics
      const forceX = (targetRotX - currentRotX) * stiffness;
      velX = (velX + forceX) * damping;
      currentRotX += velX;

      // RotY spring physics
      const forceY = (targetRotY - currentRotY) * stiffness;
      velY = (velY + forceY) * damping;
      currentRotY += velY;

      // Scale spring physics
      const forceScale = (targetScale - currentScale) * stiffness;
      velScale = (velScale + forceScale) * damping;
      currentScale += velScale;

      // Apply 3D transform to card
      card.style.transform = `perspective(${perspective}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

      // Apply Parallax depth shifts to nested children
      if (depthChildren.length) {
        depthChildren.forEach(({ el, depth }) => {
          const shiftX = (currentRotY * depth * 2.2).toFixed(2);
          const shiftY = (-currentRotX * depth * 2.2).toFixed(2);
          const shiftZ = (depth * 45).toFixed(1);
          el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, ${shiftZ}px)`;
        });
      }

      // Check if spring has reached rest equilibrium (Trạng thái cân bằng triệt tiêu dao động)
      const isSettled =
        Math.abs(targetRotX - currentRotX) < 0.05 &&
        Math.abs(targetRotY - currentRotY) < 0.05 &&
        Math.abs(targetScale - currentScale) < 0.002 &&
        Math.abs(velX) < 0.02 &&
        Math.abs(velY) < 0.02 &&
        Math.abs(velScale) < 0.001;

      if (isSettled) {
        // Snap cleanly to target rest and cease animation loop to save CPU
        currentRotX = targetRotX;
        currentRotY = targetRotY;
        currentScale = targetScale;
        velX = 0;
        velY = 0;
        velScale = 0;

        if (!isHovering) {
          card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          if (depthChildren.length) {
            depthChildren.forEach(({ el }) => {
              el.style.transform = 'translate3d(0px, 0px, 0px)';
            });
          }
        } else {
          card.style.transform = `perspective(${perspective}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;
        }

        rafId = null;
      } else {
        rafId = requestAnimationFrame(stepSpring);
      }
    }

    function resetCard() {
      isHovering = false;
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1.0;
      currentRotX = 0;
      currentRotY = 0;
      currentScale = 1.0;
      velX = 0;
      velY = 0;
      velScale = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (glareEl) glareEl.style.opacity = '0';
      if (depthChildren.length) {
        depthChildren.forEach(({ el }) => {
          el.style.transform = 'translate3d(0px, 0px, 0px)';
        });
      }
    }

    function setCardValues(vals, yVal) {
      let rx = 0;
      let ry = 0;
      let s = scale;
      if (typeof vals === 'number') {
        rx = vals;
        ry = typeof yVal === 'number' ? yVal : 0;
      } else if (vals && typeof vals === 'object') {
        if (typeof vals.rotX === 'number') rx = vals.rotX;
        if (typeof vals.rotY === 'number') ry = vals.rotY;
        if (typeof vals.scale === 'number') s = vals.scale;
      }
      targetRotX = rx;
      targetRotY = ry;
      targetScale = s;
      startAnimation();
    }

    cardControls.push({
      reset: resetCard,
      setValues: setCardValues,
    });

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
      card.style.position = originalPosition;
      card.style.willChange = '';
      if (glareEl && glareEl.parentNode) {
        glareEl.parentNode.removeChild(glareEl);
      }
      depthChildren.forEach(({ el }) => {
        el.style.transform = '';
      });
    });
  });

  return {
    destroy: () => cleanups.forEach((fn) => fn()),
    reset: () => {
      cardControls.forEach((c) => c.reset());
    },
    setValues: (vals, yVal) => {
      cardControls.forEach((c) => c.setValues(vals, yVal));
    },
  };
}

// =============================================================================
// 3. WEB AUDIO HAPTICS ENGINE (Bộ tổng hợp âm thanh cơ học qua Web Audio API thuần)
// =============================================================================

/**
 * Pure Web Audio API Mechanical Sound Synthesizer.
 * 100% zero audio files (0 KB mp3/wav download), zero latency, client-side synthesized.
 * Direct inheritance & expansion from Portfolio K18 architectural heritage.
 */
class WebAudioHaptics {
  constructor(options = {}) {
    this.ctx = null;
    this.isMuted = options.muted || false;
    this.masterVolume = typeof options.volume === 'number' ? clamp(options.volume, 0, 1) : 1.0;
    this.masterGainNode = null;
    this._unlocked = false;
    this._unlockListeners = [];
    this._lastRotaryTime = 0;
    this._activeTimers = new Set();

    if (isBrowser()) {
      this._bindAutoUnlock();
    }
  }

  /**
   * Lazy initializes the AudioContext and respects browser Autoplay policy
   */
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

  /**
   * Unlock AudioContext on first user interaction gesture and flush silent buffer
   * to immediately wake up hardware DAC on iOS Safari.
   */
  _bindAutoUnlock() {
    if (this._unlocked) return;
    this._unlockListeners = [];
    const unlock = () => {
      const ctx = this.getContext();
      if (ctx) {
        this._flushSilentBuffer(ctx);
      }
      this._unlocked = true;
      if (this._unlockListeners) {
        this._unlockListeners.forEach(({ type, fn }) => {
          window.removeEventListener(type, fn, true);
        });
        this._unlockListeners = [];
      }
    };
    ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'].forEach((evt) => {
      this._unlockListeners.push({ type: evt, fn: unlock });
      window.addEventListener(evt, unlock, { once: true, passive: true, capture: true });
    });
  }

  /**
   * Silent buffer flush to wake up hardware DAC immediately on iOS Safari
   */
  flushSilentBuffer() {
    return this._flushSilentBuffer(this.getContext());
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

  /**
   * Cleans up audio context and listeners
   */
  destroy() {
    if (this._unlockListeners) {
      if (typeof window !== 'undefined') {
        this._unlockListeners.forEach(({ type, fn }) => {
          try {
            window.removeEventListener(type, fn, true);
          } catch {}
        });
      }
      this._unlockListeners = [];
    }
    if (this._activeTimers) {
      this._activeTimers.forEach((t) => clearTimeout(t));
      this._activeTimers.clear();
    }
    if (this.ctx && typeof this.ctx.close === 'function') {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.masterGainNode = null;
    this._unlocked = false;
  }

  /**
   * Mute or unmute all haptic sounds
   * @param {boolean} muted
   */
  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  getMuted() {
    return this.isMuted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playPop();
    }
    return this.isMuted;
  }

  /**
   * Set master sound volume (0.0 to 1.0)
   * @param {number} volume
   */
  setVolume(volume) {
    this.masterVolume = clamp(volume, 0, 1);
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.masterVolume;
  }

  /**
   * Resolves horizontal acoustic stereo pan position (-0.75 to +0.75)
   * Applies physiological auditory compression (k = 0.75) to prevent extreme
   * binaural isolation and listening fatigue in headphones.
   *
   * @param {number|Object|Element|MouseEvent} [options]
   * @returns {number} Pan value clamped between -0.75 and +0.75
   */
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

    // Physiological compression (Nén sinh lý k = 0.75)
    const k = 0.75;
    return clamp(rawPan, -1, 1) * k;
  }

  /**
   * Constructs an isolated spatial audio routing pipeline with StereoPannerNode.
   * Includes ultimate safety timer to disconnect intermediate nodes and prevent Audio Graph memory leaks.
   *
   * @param {AudioContext} ctx
   * @param {number} [panVal=0] - Target pan value (-1 to 1)
   * @param {number} [durationMs=100] - Duration of sound in milliseconds
   * @returns {Object} Route object with `input`, `panner`, and `disconnect()`
   */
  _createSpatialRoute(ctx, panVal = 0, durationMs = 100) {
    const fallbackTarget = this.masterGainNode || (ctx ? ctx.destination : null);
    if (!ctx || !fallbackTarget) {
      return { input: null, panner: null, connect: () => {}, disconnect: () => {} };
    }

    const safePanVal = (isFinite(panVal) && !isNaN(panVal)) ? panVal : 0;
    const pan = clamp(safePanVal, -1, 1);
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

    // Ultimate safety timer (Bộ định thời an toàn tối hậu chống rò rỉ Audio Graph)
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

  /**
   * Subtle wood/glass mechanical tap for buttons & chips (K18 Signature)
   * @param {number|Object} [spatialOptions=null]
   */
  playClick(spatialOptions = null) {
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

      const pan = this._resolvePan(spatialOptions);
      if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
        const route = this._createSpatialRoute(ctx, pan, 50);
        osc.connect(gain);
        gain.connect(route.input);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGainNode);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * Playful organic pop for drawer open, badges, modals (K18 Signature)
   * @param {number|Object} [spatialOptions=null]
   */
  playPop(spatialOptions = null) {
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

      const pan = this._resolvePan(spatialOptions);
      if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
        const route = this._createSpatialRoute(ctx, pan, 80);
        osc.connect(gain);
        gain.connect(route.input);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGainNode);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  /**
   * Harmonious three-tone triad chime (C6, E6, G6) for success/launches
   * @param {number|Object} [spatialOptions=null]
   */
  playChime(spatialOptions = null) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6

      const pan = this._resolvePan(spatialOptions);
      const route = (pan !== 0 && typeof ctx.createStereoPanner === 'function')
        ? this._createSpatialRoute(ctx, pan, 350)
        : null;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.04);

        gain.gain.setValueAtTime(0.04, now + index * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(route ? route.input : this.masterGainNode);

        osc.start(now + index * 0.04);
        osc.stop(now + index * 0.04 + 0.28);
      });
    } catch {}
  }

  /**
   * Soft mechanical switch for tabs and segmented controls
   * @param {number|Object} [spatialOptions=null]
   */
  playTabSwitch(spatialOptions = null) {
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

      const pan = this._resolvePan(spatialOptions);
      if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
        const route = this._createSpatialRoute(ctx, pan, 60);
        osc.connect(gain);
        gain.connect(route.input);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGainNode);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * Tonal confirmation chime for toggles (on: ascending, off: descending)
   * @param {boolean} [state=true]
   * @param {number|Object} [spatialOptions=null]
   */
  playToggle(state = true, spatialOptions = null) {
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

      const pan = this._resolvePan(spatialOptions);
      if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
        const route = this._createSpatialRoute(ctx, pan, 70);
        osc.connect(gain);
        gain.connect(route.input);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGainNode);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  /**
   * Rotary Step / Gear Click: Crisp mechanical detent with 18ms micro-throttle
   * and 65% downward frequency sweep simulating physical gear ratchet notch.
   *
   * @param {number} [step=0] - Current rotary step position
   * @param {number} [maxSteps=24] - Maximum rotary steps in a revolution
   * @param {number|Object} [spatialOptions=null] - Stereo pan or element coordinates
   */
  playRotaryStep(step = 0, maxSteps = 24, spatialOptions = null) {
    if (this.isMuted) return;

    // 18ms micro-throttle: drops acoustic congestion during high-speed dial turns
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if (this._lastRotaryTime && (nowMs - this._lastRotaryTime < 18)) {
      return;
    }
    this._lastRotaryTime = nowMs;

    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch dynamically scales by rotary position + 65% downward frequency sweep
      const stepRatio = clamp((step || 0) / (maxSteps || 24), 0, 1);
      const startFreq = 780 + stepRatio * 260; // 780Hz - 1040Hz
      const endFreq = startFreq * (1 - 0.65);  // Sweeps 65% down (to 35% of startFreq: ~273Hz - 364Hz)

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + 0.018);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 25);
      osc.connect(gain);
      gain.connect(route.input);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  /**
   * Success Chord: Harmonious C5-E5-G5 major triad staggered by 35ms.
   * Smooth exponential decay with balanced gain headroom to prevent peak clipping.
   *
   * @param {number|Object} [spatialOptions=null]
   */
  playSuccessChord(spatialOptions = null) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

      const now = ctx.currentTime;
      // C5, E5, G5 major triad frequencies (Hz)
      const chordNotes = [523.25, 659.25, 783.99];
      const staggerDelay = 0.035; // 35ms stagger
      const noteDuration = 0.38;  // 380ms smooth decay

      const route = this._createSpatialRoute(ctx, this._resolvePan(spatialOptions), 500);

      chordNotes.forEach((freq, idx) => {
        const noteStartTime = now + idx * staggerDelay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStartTime);

        // Peak-safe gain: 0.062 per note ensures summed headroom never exceeds 0.2 (< 1.0 peak clipping)
        gain.gain.setValueAtTime(0.062, noteStartTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + noteDuration);

        osc.connect(gain);
        gain.connect(route.input);

        osc.start(noteStartTime);
        osc.stop(noteStartTime + noteDuration);
      });
    } catch {}
  }

  /**
   * Dull Thud: Damped bass impact sweeping from 140 Hz down to 40 Hz,
   * conditioned through a resonant lowpass filter (Q = 2.4).
   *
   * @param {number|Object} [spatialOptions=null]
   */
  playDullThud(spatialOptions = null) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

      const now = ctx.currentTime;
      const duration = 0.09; // 90ms damped duration

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Damped bass pitch sweep: 140 Hz down to 40 Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + duration);

      // Resonant lowpass filter with Q = 2.4
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

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  /**
   * 2-Phase Mechanical Switch:
   *  Phase 1 (t = 0): Crisp spring tactile leaf latch
   *  Phase 2 (t = +16ms): Damped housing bottom-out stem impact
   *
   * @param {boolean} [state=true] - Toggle state (true: engage, false: release)
   * @param {number|Object} [spatialOptions=null]
   */
  playMechanicalSwitch(state = true, spatialOptions = null) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

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
      osc2.start(p2StartTime);
      osc2.stop(p2StartTime + p2Duration);
    } catch {}
  }

  /**
   * Automatic event binder for HTML elements with data-haptic attributes.
   * Supports: click, pop, chime, switch/tab, toggle, rotary/rotary-step, chord/success-chord, thud/dull-thud, mech-switch/mechanical-switch.
   * Supports spatial audio panning via data-haptic-spatial="true" or data-haptic-spatial="-0.5".
   *
   * @param {Element|Document} [root]
   * @returns {Function} Unbind function
   */
  bind(root) {
    const targetRoot = root || (typeof document !== 'undefined' ? document : null);
    if (!isBrowser() || !targetRoot) return () => {};

    const resolveSpatial = (el, e) => {
      if (!el || typeof el.getAttribute !== 'function') return null;
      const attr = el.getAttribute('data-haptic-spatial');
      if (attr === null || attr === undefined || attr === 'false') return null;
      if (attr === 'left') return { pan: -0.8, element: el };
      if (attr === 'right') return { pan: 0.8, element: el };
      if (attr === 'center') return { pan: 0, element: el };
      if (attr !== '' && attr !== 'true' && !isNaN(parseFloat(attr))) {
        return { pan: parseFloat(attr), element: el };
      }
      return { clientX: e && typeof e.clientX === 'number' ? e.clientX : undefined, element: el };
    };

    const handleAction = (e) => {
      const el = (typeof Element !== 'undefined' && e.target instanceof Element)
        ? e.target
        : (e.target?.parentElement || e.target);
      const target = el?.closest?.('[data-haptic]');
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

/**
 * Singleton ready-to-use instance
 */
const haptics = new WebAudioHaptics();

// =============================================================================
// 4. SMOOTH SCROLL ENGINE (Cuộn quán tính Lenis standalone êm ái)
// =============================================================================

/**
 * Standalone Lenis-style inertia momentum smooth scroll engine.
 * Zero external dependencies. Normalizes mouse wheel, trackpad, and keyboard smooth interpolation.
 *
 * @param {Object} [options]
 * @param {number} [options.lerp=0.09] - Damping interpolation factor (0.05 to 0.15)
 * @param {number} [options.wheelMultiplier=1.0] - Mouse wheel speed multiplier
 * @param {boolean} [options.smoothTouch=false] - Smooth touch events (default false for native mobile flick)
 * @param {boolean} [options.autoResize=true] - Auto recalculate scroll boundary on window resize
 * @param {Function} [options.onScroll] - Callback triggered on each scroll frame
 * @returns {Object} Control interface with destroy(), scrollTo(), stop(), start(), onScroll()
 */
function initSmoothScroll(options = {}) {
  if (!isBrowser()) {
    return {
      destroy: () => {},
      scrollTo: () => {},
      stop: () => {},
      start: () => {},
      onScroll: () => () => {},
    };
  }

  // Respect OS reduced motion preference
  if (prefersReducedMotion()) {
    return {
      destroy: () => {},
      scrollTo: (target, scrollOpts = {}) => {
        let dest = 0;
        if (typeof target === 'number') {
          dest = target;
        } else {
          const els = resolveElements(target);
          if (!els.length) return;
          dest = els[0].offsetTop || 0;
        }
        window.scrollTo({ top: dest, behavior: scrollOpts.immediate ? 'instant' : 'smooth' });
      },
      stop: () => {},
      start: () => {},
      onScroll: (cb) => {
        const handler = () => {
          const top = window.pageYOffset || document.documentElement?.scrollTop || 0;
          const max = Math.max(0, (document.documentElement?.scrollHeight || 0) - window.innerHeight);
          const prog = max > 0 ? clamp(top / max, 0, 1) : 0;
          try {
            cb({
              scroll: top,
              target: top,
              limit: max,
              velocity: 0,
              progress: prog,
              direction: 0,
            });
          } catch {}
        };
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
      },
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
      try {
        fn(scrollData);
      } catch {}
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

    // Apply scroll to window
    window.scrollTo({ top: Math.round(currentY), behavior: 'instant' });
    emitScroll(velocity);

    // Continue loop until rest threshold is reached
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

  // Detect whether target element or an ancestor is a scrollable container
  function isScrollableElement(el, deltaY) {
    let cur = el;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      if (cur instanceof Element) {
        const style = window.getComputedStyle(cur);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          const canScrollDown = deltaY > 0 && cur.scrollTop < cur.scrollHeight - cur.clientHeight - 1;
          const canScrollUp = deltaY < 0 && cur.scrollTop > 1;
          if (canScrollDown || canScrollUp) return true;
        }
      }
      cur = cur.parentElement;
    }
    return false;
  }

  // Wheel event listener with delta normalization
  function onWheel(e) {
    if (e.ctrlKey || e.defaultPrevented) return; // Allow pinch-to-zoom & respect handled events

    let deltaY = e.deltaY;
    // If predominantly horizontal, let native handling proceed
    if (Math.abs(e.deltaX) > Math.abs(deltaY)) return;

    // Check if target is inside a scrollable container that can scroll
    if (e.target && isScrollableElement(e.target, deltaY)) return;

    // Prevent native scroll jump so inertia engine controls position
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    updateMaxScroll();

    // Normalize lines to pixels (Firefox deltaMode 1)
    if (e.deltaMode === 1) deltaY *= 40;
    // Normalize pages to pixels (deltaMode 2)
    else if (e.deltaMode === 2) deltaY *= window.innerHeight;

    deltaY *= wheelMultiplier;

    targetY = clamp(targetY + deltaY, 0, maxScroll);
    startLoop();
  }

  // Touch event listeners for smooth touch (optional)
  let touchStartY = 0;
  function onTouchStart(e) {
    if (!smoothTouch || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (!smoothTouch || e.touches.length !== 1) return;
    updateMaxScroll();
    const touchY = e.touches[0].clientY;
    const deltaY = (touchStartY - touchY) * 1.5;
    touchStartY = touchY;

    targetY = clamp(targetY + deltaY, 0, maxScroll);
    startLoop();
  }

  // Keyboard navigation (PageUp, PageDown, Space, Arrows, Home, End)
  function onKeyDown(e) {
    if (e.defaultPrevented) return;
    // Ignore when focus is inside interactive elements
    const tag = (e.target && e.target.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target.isContentEditable) return;

    let delta = 0;
    switch (e.key) {
      case 'ArrowDown':
        delta = 80;
        break;
      case 'ArrowUp':
        delta = -80;
        break;
      case 'PageDown':
      case ' ':
        delta = window.innerHeight * 0.8;
        break;
      case 'PageUp':
        delta = -window.innerHeight * 0.8;
        break;
      case 'Home':
        if (typeof e.preventDefault === 'function') e.preventDefault();
        targetY = 0;
        startLoop();
        return;
      case 'End':
        if (typeof e.preventDefault === 'function') e.preventDefault();
        updateMaxScroll();
        targetY = maxScroll;
        startLoop();
        return;
      default:
        return;
    }

    if (delta !== 0) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      updateMaxScroll();
      targetY = clamp(targetY + delta, 0, maxScroll);
      startLoop();
    }
  }

  // Sync state if user drags native scrollbar
  function onNativeScroll() {
    if (isRunning) return;
    currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
    targetY = currentY;
  }

  // Intercept anchor link clicks for smooth navigation
  function onAnchorClick(e) {
    const el = e.target instanceof Element ? e.target : e.target?.parentElement;
    const anchor = el?.closest?.('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    try {
      const id = hash.slice(1);
      const targetEl = document.getElementById(id) || document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        scrollTo(targetEl, { offset: 0 });
      }
    } catch {}
  }

  /**
   * Programmatic scroll to target position or element
   */
  function scrollTo(target, scrollOpts = {}) {
    updateMaxScroll();
    let destY = 0;

    if (typeof target === 'number') {
      destY = target;
    } else if (typeof target === 'string') {
      try {
        const id = target.startsWith('#') ? target.slice(1) : null;
        const el = (id ? document.getElementById(id) : null) || document.querySelector(target);
        if (!el) return;
        destY = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      } catch {
        return;
      }
    } else if (target instanceof Element) {
      destY = target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
    } else {
      return;
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

  // Attach event listeners
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  document.addEventListener('click', onAnchorClick, { passive: false });

  if (smoothTouch) {
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
  }

  if (autoResize) {
    window.addEventListener('resize', updateMaxScroll, { passive: true });
  }

  return {
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', onWheel, { passive: false });
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('keydown', onKeyDown, { passive: false });
      document.removeEventListener('click', onAnchorClick);
      if (smoothTouch) {
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
      }
      if (autoResize) {
        window.removeEventListener('resize', updateMaxScroll);
      }
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

// =============================================================================
// 5. WOW ENGINE MASTER SUITE (Khung điều phối WowEngine tự động)
// =============================================================================

const WowEngine = {
  version: '2.0.0',
  initSpotlight,
  initParallaxTilt,
  WebAudioHaptics,
  haptics,
  initSmoothScroll,

  /**
   * One-line master initializer: automatically discovers and powers up all
   * [data-spotlight], [data-parallax-tilt], [data-haptic], and smooth scrolling.
   *
   * @param {Object} [config]
   * @param {boolean|Object} [config.spotlight=true]
   * @param {boolean|Object} [config.parallax=true]
   * @param {boolean|Object} [config.haptics=true]
   * @param {boolean|Object} [config.smoothScroll=true]
   * @returns {Object} Master cleanup interface
   */
  initAll(config = {}) {
    if (!isBrowser()) {
      return { destroy: () => {} };
    }

    const cleanups = [];

    // 1. Spotlight on [data-spotlight]
    if (config.spotlight !== false) {
      const spotOpts = typeof config.spotlight === 'object' ? config.spotlight : {};
      const spotHandle = initSpotlight('[data-spotlight]', spotOpts);
      cleanups.push(spotHandle.destroy);
    }

    // 2. Parallax Tilt on [data-parallax-tilt]
    if (config.parallax !== false) {
      const tiltOpts = typeof config.parallax === 'object' ? config.parallax : {};
      const tiltHandle = initParallaxTilt('[data-parallax-tilt]', tiltOpts);
      cleanups.push(tiltHandle.destroy);
    }

    // 3. Web Audio Haptics on [data-haptic]
    if (config.haptics !== false) {
      const unbindHaptics = haptics.bind(document);
      cleanups.push(unbindHaptics);
    }

    // 4. Smooth Scroll
    if (config.smoothScroll !== false) {
      const scrollOpts = typeof config.smoothScroll === 'object' ? config.smoothScroll : {};
      const scrollHandle = initSmoothScroll(scrollOpts);
      cleanups.push(scrollHandle.destroy);
    }

    return {
      destroy: () => cleanups.forEach((fn) => fn()),
    };
  },
};

// =============================================================================
// 6. UNIVERSAL BROWSER AUTO-ATTACHMENT (Tự động gắn cắm môi trường Window/Browser)
// =============================================================================

if (isBrowser()) {
  window.WowEngine = WowEngine;
  window.initSpotlight = initSpotlight;
  window.initParallaxTilt = initParallaxTilt;
  window.WebAudioHaptics = WebAudioHaptics;
  window.haptics = haptics;
  window.initSmoothScroll = initSmoothScroll;

  // Auto-init on DOMContentLoaded if data-wow-auto is present on body or html
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.querySelector('[data-wow-auto]')) {
        WowEngine.initAll();
      }
    });
  } else if (document.querySelector('[data-wow-auto]')) {
    WowEngine.initAll();
  }
}
  return WowEngine;
});
