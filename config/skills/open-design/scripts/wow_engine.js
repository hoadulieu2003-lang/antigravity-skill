/**
 * ⚡ WOW ENGINE — Antigravity 2.0 High-Performance UI/UX Interaction Engine
 * =========================================================================
 * Pure Vanilla JavaScript interaction suite designed for world-class web experiences.
 * Zero external dependencies (0 KB runtime assets).
 * SSR-safe: 100% compatible with standalone HTML, Vite, React, Vue, and Next.js.
 *
 * Core Modules:
 *  1. initSpotlight(selector, options)    - Cursor-tracking radial glow (--mouse-x, --mouse-y) with zero lag
 *  2. initParallaxTilt(selector, options) - 3D card tilt with damped spring physics & elastic bounce
 *  3. WebAudioHaptics / haptics           - Pure Web Audio API tactile sound synthesizer (Click, Pop, Chime)
 *  4. initSmoothScroll(options)           - Standalone Lenis-style inertia momentum smooth scroll
 *  5. WowEngine.initAll(options)          - Auto-activates all data-* attributes across the document
 *
 * Inspired by: Linear, Vercel, Apple, and Portfolio K18 Sankou Design Engine.
 * License: Apache-2.0
 */

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
export function initSpotlight(selector, options = {}) {
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

  elements.forEach((el) => {
    let rafId = null;
    let rect = el.getBoundingClientRect();
    let isHovering = false;
    let pendingEvent = null;

    // Refresh cached bounding rect on scroll or resize
    function refreshRect() {
      rect = el.getBoundingClientRect();
    }

    function scheduleUpdate(e) {
      pendingEvent = e;
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
      el.style.setProperty('--spotlight-opacity', '1');

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

    // Attach listeners
    el.addEventListener('pointerenter', onPointerEnter, { passive: true });
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', refreshRect, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });

    // Initial state
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
export function initParallaxTilt(selector, options = {}) {
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
      const isResting =
        !isHovering &&
        Math.abs(currentRotX) < 0.05 &&
        Math.abs(currentRotY) < 0.05 &&
        Math.abs(currentScale - 1.0) < 0.002 &&
        Math.abs(velX) < 0.02 &&
        Math.abs(velY) < 0.02 &&
        Math.abs(velScale) < 0.001;

      if (isResting) {
        // Snap cleanly to rest and cease animation loop to save CPU
        currentRotX = 0;
        currentRotY = 0;
        currentScale = 1.0;
        velX = 0;
        velY = 0;
        velScale = 0;
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

        if (depthChildren.length) {
          depthChildren.forEach(({ el }) => {
            el.style.transform = 'translate3d(0px, 0px, 0px)';
          });
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
      elements.forEach((card) => {
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
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
export class WebAudioHaptics {
  constructor(options = {}) {
    this.ctx = null;
    this.isMuted = options.muted || false;
    this.masterVolume = typeof options.volume === 'number' ? clamp(options.volume, 0, 1) : 1.0;
    this.masterGainNode = null;
    this._unlocked = false;

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
   * Unlock AudioContext on first user interaction gesture
   */
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
   * Subtle wood/glass mechanical tap for buttons & chips (K18 Signature)
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
   * Playful organic pop for drawer open, badges, modals (K18 Signature)
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
   * Harmonious three-tone triad chime (C6, E6, G6) for success/launches
   */
  playChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGainNode) return;

      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6

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

  /**
   * Soft mechanical switch for tabs and segmented controls
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
   * Tonal confirmation chime for toggles (on: ascending, off: descending)
   * @param {boolean} state
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

  /**
   * Automatic event binder for HTML elements with data-haptic attributes.
   * e.g. <button data-haptic="click">, <div data-haptic="pop">, <a data-haptic="chime">
   *
   * @param {Element|Document} [root=document]
   * @returns {Function} Unbind function
   */
  bind(root = document) {
    if (!isBrowser() || !root) return () => {};

    const handleClick = (e) => {
      const target = e.target.closest('[data-haptic]');
      if (!target) return;

      const soundType = target.getAttribute('data-haptic') || 'click';
      switch (soundType) {
        case 'pop':
          this.playPop();
          break;
        case 'chime':
          this.playChime();
          break;
        case 'switch':
        case 'tab':
          this.playTabSwitch();
          break;
        case 'click':
        default:
          this.playClick();
          break;
      }
    };

    root.addEventListener('click', handleClick, { passive: true });
    return () => {
      root.removeEventListener('click', handleClick);
    };
  }
}

/**
 * Singleton ready-to-use instance
 */
export const haptics = new WebAudioHaptics();

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
export function initSmoothScroll(options = {}) {
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
        const dest = typeof target === 'number' ? target : resolveElements(target)[0]?.offsetTop || 0;
        window.scrollTo({ top: dest, behavior: scrollOpts.immediate ? 'instant' : 'smooth' });
      },
      stop: () => {},
      start: () => {},
      onScroll: (cb) => {
        window.addEventListener('scroll', cb, { passive: true });
        return () => window.removeEventListener('scroll', cb);
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

  // Wheel event listener with delta normalization
  function onWheel(e) {
    if (e.ctrlKey) return; // Allow pinch-to-zoom

    updateMaxScroll();

    let deltaY = e.deltaY;
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
        targetY = 0;
        startLoop();
        return;
      case 'End':
        updateMaxScroll();
        targetY = maxScroll;
        startLoop();
        return;
      default:
        return;
    }

    if (delta !== 0) {
      updateMaxScroll();
      targetY = clamp(targetY + delta, 0, maxScroll);
      startLoop();
    }
  }

  // Sync state if user drags native scrollbar
  let isInternalScroll = false;
  function onNativeScroll() {
    if (isRunning) return;
    currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
    targetY = currentY;
  }

  // Intercept anchor link clicks for smooth navigation
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

  /**
   * Programmatic scroll to target position or element
   */
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

  // Attach event listeners
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: true });
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
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('keydown', onKeyDown);
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

export const WowEngine = {
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

export default WowEngine;
