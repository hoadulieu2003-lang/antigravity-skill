/**
 * ⚡ SCROLLY STAGE ENGINE — Multi-Scene Scrollytelling Pinned Stage Engine
 * =========================================================================
 * High-performance, production-grade pinned stage engine for multi-scene scrollytelling.
 * Designed for 60 FPS cinematic narrative experiences with GSAP, ScrollTrigger, and Lenis.
 * Zero external dependencies required (Vanilla JS fallback), but fully supercharged
 * with GSAP Ticker Master Bridge & Lenis smooth scrolling when present.
 *
 * Core Capabilities:
 *  1. Dynamic Multi-Scene Support (N scenes, auto trackHeight = (N * 100) + 'vh')
 *  2. Locked-VH Architecture (--locked-vh 1-time measurement, iOS Safari address bar jump immunity)
 *  3. GSAP Ticker Master Bridge (Lenis autoRaf: false, lagSmoothing(500, 33), scrollerProxy)
 *  4. Safe Pinning Guard (assertNoTransformedAncestor, auto pinType: 'transform' vs 'fixed')
 *  5. Scrub Progress Bar & Chapter Markers (interactive click navigation)
 *  6. 60 FPS GPU-accelerated Transitions (fade, slide, zoom, stack, custom)
 *  7. Battery & Thermal Watchdog (IntersectionObserver pause/resume when off-screen)
 *  8. Accessibility & Performance Tiering (prefers-reduced-motion & TIER_LITE fallback)
 *  9. SSR-Safe (Universal execution in Node, Vite, React, Vue, Next.js)
 *
 * Part of Antigravity 2.0 Open-Design Architecture.
 * License: Apache-2.0
 */

// =============================================================================
// 0. ENVIRONMENT & UTILITIES (Môi trường & Tiện ích bổ trợ)
// =============================================================================

export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Clamp a number between min and max
 */
export function clamp(val, min = 0, max = 1) {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (typeof num !== 'number' || Number.isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

/**
 * Linear interpolation (Nội suy tuyến tính)
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Check if user prefers reduced motion (Kiểm tra tùy chọn giảm chuyển động tiếp cận)
 */
export function prefersReducedMotion() {
  if (!isBrowser() || !window.matchMedia) return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Detect if client is a low-power / lite tier device (TIER_LITE)
 */
export function isTierLite(options = {}) {
  if (options.tier === 'lite') return true;
  if (options.tier === 'high') return false;
  if (!isBrowser()) return false;

  try {
    // Hardware concurrency <= 2 indicates dual-core or budget mobile device
    if (typeof navigator !== 'undefined') {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        return true;
      }
      // Device memory in GB (Chrome/Edge API)
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
        return true;
      }
    }
  } catch {
    // Safe fallback
  }

  return false;
}

/**
 * Check if target is a valid DOM element safely
 */
export function isElement(target) {
  if (!target || typeof target !== 'object') return false;
  if (typeof Element !== 'undefined') {
    try {
      if (target instanceof Element) return true;
    } catch {}
  }
  if (typeof window !== 'undefined' && window.Element) {
    try {
      if (target instanceof window.Element) return true;
    } catch {}
  }
  return (
    typeof target.tagName === 'string' ||
    (Boolean(target.style) && (Boolean(target.attributes) || typeof target.setAttribute === 'function'))
  );
}

/**
 * Resolve target elements from string selector, Element, or NodeList
 */
export function resolveElement(target, parent = null) {
  if (!isBrowser() || !target) return null;
  if (typeof target === 'string') {
    try {
      const scope = isElement(parent) ? parent : document;
      return scope.querySelector(target);
    } catch {
      return null;
    }
  }
  if (isElement(target)) return target;
  return null;
}

export function resolveElements(target, parent = null) {
  if (!isBrowser() || !target) return [];
  if (typeof target === 'string') {
    try {
      const scope = isElement(parent) ? parent : document;
      return Array.from(scope.querySelectorAll(target));
    } catch {
      return [];
    }
  }
  if (isElement(target)) return [target];
  if (
    Array.isArray(target) ||
    (typeof NodeList !== 'undefined' && target instanceof NodeList) ||
    (typeof HTMLCollection !== 'undefined' && target instanceof HTMLCollection) ||
    (target && typeof target === 'object' && typeof target.length === 'number' && typeof target.item === 'function')
  ) {
    return Array.from(target).filter((el) => isElement(el));
  }
  return [];
}

/**
 * Set CSS property or custom property safely
 */
export function setStyleProperty(el, key, val) {
  if (!el || !el.style) return;
  if (typeof el.style.setProperty === 'function') {
    el.style.setProperty(key, String(val));
  } else {
    el.style[key] = String(val);
  }
}

/**
 * Remove CSS property or custom property safely
 */
export function removeStyleProperty(el, key) {
  if (!el || !el.style) return;
  if (typeof el.style.removeProperty === 'function') {
    el.style.removeProperty(key);
  } else {
    delete el.style[key];
  }
}

// =============================================================================
// 1. LOCKED-VH ARCHITECTURE (Chống giật thanh địa chỉ di động)
// =============================================================================

/**
 * Measure 1% of viewport height once in pixels to prevent mobile address bar jank
 */
export function calculateLockedVh() {
  if (!isBrowser()) return 8.0; // 800px / 100 fallback for SSR
  return window.innerHeight * 0.01;
}

/**
 * Lock viewport height CSS custom property on element or :root
 */
export function lockViewportHeight(targetElement = null) {
  if (!isBrowser()) return 8.0;
  const lockedVh = calculateLockedVh();
  const pxValue = `${lockedVh}px`;

  try {
    if (document && document.documentElement) {
      setStyleProperty(document.documentElement, '--locked-vh', pxValue);
    }
    if (isElement(targetElement)) {
      setStyleProperty(targetElement, '--locked-vh', pxValue);
    }
  } catch {
    // Safe fallback
  }

  return lockedVh;
}

// =============================================================================
// 2. SAFE PINNING GUARD (Kỹ thuật Ghim An Toàn)
// =============================================================================

/**
 * Inspect ancestors of an element to assert whether any ancestor has CSS properties
 * that create a new stacking/transform context which breaks position: fixed.
 *
 * Properties inspected:
 * - transform !== 'none'
 * - filter !== 'none'
 * - perspective !== 'none'
 * - contain contains 'paint', 'layout', 'strict', or 'content'
 * - will-change contains 'transform', 'filter', or 'perspective'
 *
 * @param {Element} element
 * @returns {{
 *   safe: boolean,
 *   transformedAncestor: Element | null,
 *   property: string | null,
 *   value: string | null,
 *   suggestedPinType: 'fixed' | 'transform',
 *   reason: string
 * }}
 */
export function assertNoTransformedAncestor(element) {
  if (!isBrowser() || !isElement(element)) {
    return {
      safe: true,
      transformedAncestor: null,
      property: null,
      value: null,
      suggestedPinType: 'fixed',
      reason: 'Element not in browser DOM',
    };
  }

  let curr = element.parentElement;
  while (curr && curr.nodeType === 1 && curr !== document) {
    let style = null;
    try {
      style = window.getComputedStyle(curr);
    } catch {
      break;
    }

    if (style) {
      // 1. transform check
      const transform = style.transform || style.webkitTransform;
      if (transform && transform !== 'none' && transform !== '') {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'transform',
          value: transform,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}${curr.id ? '#' + curr.id : ''}${curr.className ? '.' + String(curr.className).trim().replace(/\\s+/g, '.') : ''}> has transform: "${transform}". This creates a local stacking context and breaks position: fixed pinning!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }

      // 2. filter check
      const filter = style.filter || style.webkitFilter;
      if (filter && filter !== 'none' && filter !== '') {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'filter',
          value: filter,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}> has filter: "${filter}". Filter creates a containing block that traps position: fixed elements!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }

      // 3. backdrop-filter check
      const backdropFilter = style.backdropFilter || style.webkitBackdropFilter;
      if (backdropFilter && backdropFilter !== 'none' && backdropFilter !== '') {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'backdrop-filter',
          value: backdropFilter,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}> has backdrop-filter: "${backdropFilter}". Backdrop filter creates a containing block that traps position: fixed elements!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }

      // 4. perspective check
      const perspective = style.perspective || style.webkitPerspective;
      if (perspective && perspective !== 'none' && perspective !== '0px' && perspective !== '') {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'perspective',
          value: perspective,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}> has perspective: "${perspective}". Perspective establishes a 3D coordinate space trapping position: fixed elements!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }

      // 5. contain check
      const contain = style.contain || '';
      if (/paint|layout|strict|content/.test(contain)) {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'contain',
          value: contain,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}> has contain: "${contain}". Layout/paint containment traps fixed descendants!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }

      // 6. will-change check
      const willChange = style.willChange || '';
      if (/transform|filter|backdrop-filter|perspective/.test(willChange)) {
        const info = {
          safe: false,
          transformedAncestor: curr,
          property: 'will-change',
          value: willChange,
          suggestedPinType: 'transform',
          reason: `Ancestor <${curr.tagName.toLowerCase()}> has will-change: "${willChange}". This creates a containing block breaking position: fixed!`,
        };
        console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
        return info;
      }
    }

    curr = curr.parentElement;
  }

  return {
    safe: true,
    transformedAncestor: null,
    property: null,
    value: null,
    suggestedPinType: 'fixed',
    reason: 'All ancestors are clean without transform/filter containment',
  };
}

// =============================================================================
// 3. GSAP TICKER MASTER BRIDGE (Đồng bộ Ticker & Điều hướng Lenis)
// =============================================================================

const bridgedLenisMap = new WeakMap();

/**
 * Configure and synchronize Lenis smooth scroll into gsap.ticker.
 *
 * Rules:
 *  - Enforce Lenis autoRaf: false (triệt tiêu hoàn toàn Double Ticking)
 *  - gsap.ticker.add((time) => lenis.raf(time * 1000))
 *  - gsap.ticker.lagSmoothing(500, 33) (tuyệt đối cấm lagSmoothing(0))
 *  - ScrollTrigger.scrollerProxy configuration
 *
 * @param {object} bridgeOptions
 * @returns {{ destroy: () => void, isConnected: boolean }}
 */
export function setupGsapTickerBridge(bridgeOptions = {}) {
  const {
    gsap = (isBrowser() && window.gsap) || null,
    lenis = null,
    ScrollTrigger = (isBrowser() && window.ScrollTrigger) || null,
    scroller = (isBrowser() && document.documentElement) || null,
    pinType = 'fixed',
  } = bridgeOptions;

  if (!gsap || !gsap.ticker) {
    return {
      isConnected: false,
      destroy: () => {},
    };
  }

  // 1. Guard against dangerous lagSmoothing(0)
  // GSAP ticker lagSmoothing(0) disables lag smoothing completely, which causes
  // huge timeline jumps and stutter when garbage collection or heavy layout runs.
  // We enforce the gold-standard lagSmoothing(500, 33).
  try {
    gsap.ticker.lagSmoothing(500, 33);
  } catch {
    // Safe fallback
  }

  // 2. Lenis integration with Deduplication & Ref-counting
  if (lenis && typeof lenis === 'object') {
    let existingRecord = null;
    try {
      existingRecord = bridgedLenisMap.get(lenis);
    } catch {}

    if (existingRecord) {
      existingRecord.refCount++;
      return {
        isConnected: true,
        destroy: () => {
          if (!existingRecord) return;
          existingRecord.refCount--;
          if (existingRecord.refCount <= 0) {
            existingRecord.teardown();
            try {
              bridgedLenisMap.delete(lenis);
            } catch {}
            existingRecord = null;
          }
        },
      };
    }

    // Assert Lenis does not spawn internal RAF loop (autoRaf: false)
    if (lenis.options && lenis.options.autoRaf === true) {
      console.warn(
        '[ScrollyStageEngine] Lenis autoRaf was enabled! Disabling internal RAF to eliminate double-ticking.'
      );
      lenis.options.autoRaf = false;
      if (typeof lenis.stop === 'function') {
        // Stop any running internal loop
        lenis.stop();
        if (typeof lenis.start === 'function') lenis.start();
      }
    }

    // Connect Lenis to GSAP Ticker
    // GSAP ticker provides time in seconds; Lenis raf expects milliseconds.
    const tickerListener = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerListener);

    let scrollTriggerScrollHandler = null;
    let scrollTriggerRefreshHandler = null;

    // Wire up ScrollTrigger scrollerProxy if ScrollTrigger is active
    if (ScrollTrigger && typeof ScrollTrigger.scrollerProxy === 'function') {
      const targetScroller = scroller || (isBrowser() ? document.body : null);
      if (targetScroller) {
        ScrollTrigger.scrollerProxy(targetScroller, {
          scrollTop(value) {
            if (arguments.length && typeof value === 'number') {
              if (typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(value, { immediate: true });
              }
            }
            return typeof lenis.scroll === 'number'
              ? lenis.scroll
              : isBrowser()
              ? window.scrollY || window.pageYOffset || 0
              : 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: isBrowser() ? window.innerWidth : 1920,
              height: isBrowser() ? window.innerHeight : 1080,
            };
          },
          pinType: pinType || 'fixed',
        });

        scrollTriggerScrollHandler = () => {
          ScrollTrigger.update();
        };

        if (typeof lenis.on === 'function') {
          lenis.on('scroll', scrollTriggerScrollHandler);
        }

        scrollTriggerRefreshHandler = () => {
          if (typeof lenis.resize === 'function') {
            lenis.resize();
          }
        };

        if (typeof ScrollTrigger.addEventListener === 'function') {
          ScrollTrigger.addEventListener('refresh', scrollTriggerRefreshHandler);
        }
      }
    }

    const teardown = () => {
      if (tickerListener && gsap && gsap.ticker) {
        try {
          gsap.ticker.remove(tickerListener);
        } catch {}
      }
      if (lenis && typeof lenis.off === 'function' && scrollTriggerScrollHandler) {
        try {
          lenis.off('scroll', scrollTriggerScrollHandler);
        } catch {}
      }
      if (ScrollTrigger && typeof ScrollTrigger.removeEventListener === 'function' && scrollTriggerRefreshHandler) {
        try {
          ScrollTrigger.removeEventListener('refresh', scrollTriggerRefreshHandler);
        } catch {}
      }
    };

    const bridgeRecord = { refCount: 1, teardown };
    try {
      bridgedLenisMap.set(lenis, bridgeRecord);
    } catch {}

    return {
      isConnected: true,
      destroy: () => {
        bridgeRecord.refCount--;
        if (bridgeRecord.refCount <= 0) {
          teardown();
          try {
            bridgedLenisMap.delete(lenis);
          } catch {}
        }
      },
    };
  }

  return {
    isConnected: true,
    destroy: () => {},
  };
}

// =============================================================================
// 4. TIMELINE DISTRIBUTION & MATH (Phân bổ trục thời gian N cảnh)
// =============================================================================

/**
 * Calculate timeline state for N scenes given a global progress ratio in [0, 1].
 *
 * @param {number} rawProgress - Global progress between 0 and 1
 * @param {number} sceneCount - Total number of scenes N
 * @returns {{
 *   globalProgress: number,
 *   activeIndex: number,
 *   sceneProgress: number,
 *   sceneProgresses: number[]
 * }}
 */
export function calculateSceneTimeline(rawProgress, sceneCount) {
  const globalProgress = clamp(rawProgress, 0, 1);
  const N = Math.max(0, parseInt(sceneCount, 10) || 0);

  if (N <= 0) {
    return {
      globalProgress,
      activeIndex: 0,
      sceneProgress: 0,
      sceneProgresses: [],
    };
  }

  if (N === 1) {
    return {
      globalProgress,
      activeIndex: 0,
      sceneProgress: globalProgress,
      sceneProgresses: [1.0],
    };
  }

  // Active index mapped across (N - 1) transition segments
  // Progress = 0 -> scene 0
  // Progress = 1 -> scene N - 1
  const segmentFraction = 1 / (N - 1);
  const exactIndex = globalProgress * (N - 1);
  const activeIndex = clamp(Math.round(exactIndex), 0, N - 1);

  // Calculate local progress for each individual scene
  // For scene i:
  // - Before (i - 1): 0.0
  // - Transition into i (from i-1 to i): 0.0 -> 1.0
  // - Active at i: 1.0
  // - Transition out of i (from i to i+1): 1.0 -> 0.0
  const sceneProgresses = new Array(N);
  for (let i = 0; i < N; i++) {
    const center = i / (N - 1);
    const dist = Math.abs(globalProgress - center);
    // Normalized distance in segment units
    const segDist = dist / segmentFraction;
    sceneProgresses[i] = clamp(1 - segDist, 0, 1);
  }

  // Local progress inside the current active segment
  const segmentIndex = clamp(Math.floor(exactIndex), 0, N - 2);
  const localSegmentProgress = (globalProgress - segmentIndex * segmentFraction) / segmentFraction;

  return {
    globalProgress,
    activeIndex,
    sceneProgress: clamp(localSegmentProgress, 0, 1),
    sceneProgresses,
  };
}

/**
 * Calculate required track height string for N scenes
 */
export function calculateTrackHeight(sceneCount, trackMultiplier = 100) {
  const N = Math.max(1, parseInt(sceneCount, 10) || 1);
  const mult = Math.max(10, parseFloat(trackMultiplier) || 100);
  return `${N * mult}vh`;
}

// =============================================================================
// 5. SCROLLY STAGE ENGINE (Cỗ máy Sân khấu Ghim Đa Cảnh)
// =============================================================================

export class ScrollyStageEngine {
  /**
   * @param {object} options
   */
  constructor(options = {}) {
    this.options = Object.assign(
      {
        container: null,
        stage: null,
        scenes: [],
        trackMultiplier: 100,
        pinType: 'auto', // 'auto' | 'fixed' | 'transform'
        gsap: null,
        ScrollTrigger: null,
        lenis: null,
        progressBar: null,
        chapterMarkers: null,
        transition: 'fade', // 'fade' | 'slide' | 'zoom' | 'stack' | 'custom'
        onProgress: null,
        onSceneChange: null,
        reducedMotion: 'auto', // 'auto' | boolean
        tier: 'auto', // 'auto' | 'high' | 'lite'
        viewportObserver: true,
        autoInit: true,
      },
      options
    );

    // State
    this.container = null;
    this.stage = null;
    this.scenes = [];
    this.progressBar = null;
    this.chapterMarkers = [];
    this.markersContainer = null;
    this.activeIndex = 0;
    this.progress = 0;
    this.isViewportActive = true;
    this.isPaused = false;
    this.isDestroyed = false;
    this.pinType = 'fixed';
    this.tickerBridge = null;
    this.intersectionObserver = null;
    this.scrollTriggerInstance = null;
    this.boundScrollListener = null;
    this.boundResizeListener = null;
    this.boundProgressBarClick = null;
    this.markerClickListeners = [];
    this.cleanups = [];

    // Motion & Tier resolution
    this.isReducedMotion =
      this.options.reducedMotion === true ||
      (this.options.reducedMotion === 'auto' && prefersReducedMotion());
    this.isTierLite = isTierLite(this.options);

    if (this.options.autoInit) {
      this.init();
    }
  }

  /**
   * Initialize the scrolly stage engine
   */
  init() {
    if (!isBrowser()) return this;
    if (this.isDestroyed) return this;

    // 1. Resolve Container and Stage DOM elements
    this.container = resolveElement(this.options.container);
    if (!this.container) {
      // Return safe no-op if container not found
      return this;
    }

    this.stage =
      resolveElement(this.options.stage, this.container) ||
      resolveElement('.scrolly-stage', this.container) ||
      this.container.firstElementChild;

    if (!this.stage) {
      return this;
    }

    // 2. Resolve Scenes
    this._resolveScenes();

    // 3. Lock Viewport Height (--locked-vh for iOS Safari address bar jump immunity)
    lockViewportHeight(this.stage);
    this.boundResizeListener = () => {
      lockViewportHeight(this.stage);
      this.refresh();
    };
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('resize', this.boundResizeListener, { passive: true });
      window.addEventListener('orientationchange', this.boundResizeListener, { passive: true });
      this.cleanups.push(() => {
        if (typeof window.removeEventListener === 'function') {
          window.removeEventListener('resize', this.boundResizeListener);
          window.removeEventListener('orientationchange', this.boundResizeListener);
        }
      });
    }

    // 4. Safe Pinning Guard: check transformed ancestors
    if (this.options.pinType === 'auto') {
      const guardResult = assertNoTransformedAncestor(this.stage);
      this.pinType = guardResult.suggestedPinType;
    } else {
      this.pinType = this.options.pinType;
    }

    // 5. Apply Track & Stage Layout Styles
    this._applyStyles();

    // 6. Setup Progress Bar and Chapter Markers
    this._setupProgressBar();
    this._setupChapterMarkers();

    // 7. Setup GSAP / ScrollTrigger / Lenis Bridge or Standalone Scroll Listener
    this._setupScrollIntegration();

    // 8. Setup IntersectionObserver for battery / CPU watchdog
    this._setupIntersectionObserver();

    // 9. Initial Scene Update (frame 0)
    this.update(0);

    return this;
  }

  /**
   * Resolve scene definitions from options or DOM
   */
  _resolveScenes() {
    const rawScenes = this.options.scenes;
    let resolved = [];

    if (Array.isArray(rawScenes) && rawScenes.length > 0) {
      resolved = rawScenes.map((item, idx) => {
        if (typeof item === 'string') {
          return { id: `scene-${idx}`, title: item, element: null, index: idx };
        }
        if (isElement(item)) {
          return {
            id: (typeof item.getAttribute === 'function' && item.getAttribute('data-scene-id')) || item.id || `scene-${idx}`,
            title: (typeof item.getAttribute === 'function' && item.getAttribute('data-scene-title')) || `Chapter ${idx + 1}`,
            element: item,
            transition: (typeof item.getAttribute === 'function' && item.getAttribute('data-transition')) || this.options.transition,
            data: {},
            index: idx,
          };
        }
        const el = resolveElement(item.element, this.stage);
        return {
          id: item.id || `scene-${idx}`,
          title: item.title || item.label || `Chapter ${idx + 1}`,
          element: el,
          transition: item.transition || this.options.transition,
          onEnter: item.onEnter,
          onLeave: item.onLeave,
          onUpdate: item.onUpdate,
          customAnimation: item.customAnimation,
          data: item.data || {},
          index: idx,
        };
      });
    }

    // Auto-discover from DOM if not passed or empty
    if (resolved.length === 0 && this.stage) {
      const sceneEls = resolveElements('[data-scene], .scrolly-scene', this.stage);
      resolved = sceneEls.map((el, idx) => ({
        id: el.getAttribute('data-scene-id') || el.id || `scene-${idx}`,
        title: el.getAttribute('data-scene-title') || `Chapter ${idx + 1}`,
        element: el,
        transition: el.getAttribute('data-transition') || this.options.transition,
        index: idx,
      }));
    }

    this.scenes = resolved;
  }

  /**
   * Apply necessary CSS properties to container, stage, and scene elements
   */
  _applyStyles() {
    if (!this.container || !this.stage) return;

    const N = this.scenes.length || 1;
    const trackHeight = calculateTrackHeight(N, this.options.trackMultiplier);

    // Container acts as the scroll track
    this.container.style.position = 'relative';
    this.container.style.height = trackHeight;
    this.container.setAttribute('data-scrolly-container', 'true');
    this.container.setAttribute('data-scene-count', String(N));

    // Stage acts as the pinned viewport
    this.stage.style.position = 'sticky';
    this.stage.style.top = '0px';
    this.stage.style.left = '0px';
    this.stage.style.width = '100%';
    this.stage.style.height = 'calc(var(--locked-vh, 1vh) * 100)';
    this.stage.style.maxHeight = 'calc(var(--locked-vh, 1vh) * 100)';
    this.stage.style.overflow = 'hidden';
    this.stage.setAttribute('data-scrolly-stage', 'true');
    this.stage.setAttribute('data-pin-type', this.pinType);

    // Apply GPU acceleration and layering to scene elements
    this.scenes.forEach((scene, i) => {
      if (scene.element) {
        scene.element.style.position = 'absolute';
        scene.element.style.top = '0px';
        scene.element.style.left = '0px';
        scene.element.style.width = '100%';
        scene.element.style.height = '100%';
        scene.element.style.willChange = this.isReducedMotion ? 'opacity' : 'transform, opacity';
        scene.element.setAttribute('data-scene-index', String(i));
      }
    });
  }

  /**
   * Wire up scrub progress bar
   */
  _setupProgressBar() {
    if (!this.options.progressBar) return;

    let barEl = resolveElement(this.options.progressBar, this.stage || this.container);
    if (!barEl && this.stage) {
      // Auto-create progress bar if requested with boolean true
      barEl = document.createElement('div');
      barEl.className = 'scrolly-progress-bar';
      barEl.style.position = 'absolute';
      barEl.style.top = '0';
      barEl.style.left = '0';
      barEl.style.width = '100%';
      barEl.style.height = '4px';
      barEl.style.transformOrigin = 'left center';
      barEl.style.transform = 'scaleX(0)';
      barEl.style.zIndex = '100';
      barEl.style.pointerEvents = 'auto';
      barEl.style.cursor = 'pointer';
      this.stage.appendChild(barEl);
      this.cleanups.push(() => barEl.remove());
    }

    if (barEl) {
      this.progressBar = barEl;
      this.boundProgressBarClick = (e) => {
        const rect = barEl.getBoundingClientRect();
        if (rect.width > 0) {
          const clickRatio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
          this.seek(clickRatio, { smooth: true });
        }
      };
      barEl.addEventListener('click', this.boundProgressBarClick);
      this.cleanups.push(() => {
        barEl.removeEventListener('click', this.boundProgressBarClick);
      });
    }
  }

  /**
   * Wire up interactive chapter markers
   */
  _setupChapterMarkers() {
    if (!this.options.chapterMarkers) return;

    let markersWrap = resolveElement(this.options.chapterMarkers, this.stage || this.container);
    const N = this.scenes.length;

    if (!markersWrap && this.stage && N > 0) {
      // Auto-create chapter markers container
      const isDense = N > 25;
      markersWrap = document.createElement('nav');
      markersWrap.className = 'scrolly-chapter-markers';
      markersWrap.setAttribute('aria-label', 'Scrollytelling Scenes');
      markersWrap.style.position = 'absolute';
      markersWrap.style.right = '24px';
      markersWrap.style.top = '50%';
      markersWrap.style.transform = 'translateY(-50%)';
      markersWrap.style.display = 'flex';
      markersWrap.style.flexDirection = 'column';
      markersWrap.style.gap = isDense ? '6px' : '12px';
      markersWrap.style.maxHeight = '70vh';
      markersWrap.style.overflowY = 'auto';
      markersWrap.style.scrollbarWidth = 'none';
      markersWrap.style.zIndex = '90';
      this.stage.appendChild(markersWrap);
      this.cleanups.push(() => markersWrap.remove());
    }

    if (markersWrap && N > 0) {
      this.markersContainer = markersWrap;
      const isDense = N > 25;
      const dotSize = isDense ? '8px' : '12px';
      // Look for pre-existing marker buttons or auto-generate
      let markerBtns = resolveElements('[data-scene-marker]', markersWrap);
      if (markerBtns.length === 0) {
        markersWrap.innerHTML = '';
        markerBtns = this.scenes.map((scene, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'scrolly-marker-dot';
          btn.setAttribute('data-scene-marker', String(i));
          btn.setAttribute('aria-label', scene.title || `Go to Scene ${i + 1}`);
          btn.style.width = dotSize;
          btn.style.height = dotSize;
          btn.style.borderRadius = '50%';
          btn.style.border = '2px solid rgba(0, 0, 0, 0.4)';
          btn.style.background = i === 0 ? 'currentColor' : 'transparent';
          btn.style.padding = '0';
          btn.style.cursor = 'pointer';
          btn.style.flexShrink = '0';
          btn.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s';
          markersWrap.appendChild(btn);
          return btn;
        });
      }

      this.chapterMarkers = markerBtns;
      markerBtns.forEach((btn, i) => {
        const clickHandler = (e) => {
          e.preventDefault();
          this.goToScene(i, { smooth: true });
        };
        btn.addEventListener('click', clickHandler);
        this.markerClickListeners.push({ element: btn, handler: clickHandler });
      });

      this.cleanups.push(() => {
        this.markerClickListeners.forEach(({ element, handler }) => {
          element.removeEventListener('click', handler);
        });
        this.markerClickListeners = [];
      });
    }
  }

  /**
   * Setup GSAP / ScrollTrigger / Lenis or Standalone scroll tracking
   */
  _setupScrollIntegration() {
    const gsap = this.options.gsap || (isBrowser() && window.gsap) || null;
    const ScrollTrigger = this.options.ScrollTrigger || (isBrowser() && window.ScrollTrigger) || null;
    const lenis = this.options.lenis || null;

    // 1. If GSAP Ticker Bridge is relevant, connect it
    if (gsap && (lenis || ScrollTrigger)) {
      this.tickerBridge = setupGsapTickerBridge({
        gsap,
        lenis,
        ScrollTrigger,
        scroller: document.documentElement,
        pinType: this.pinType,
      });
      this.cleanups.push(() => {
        if (this.tickerBridge) this.tickerBridge.destroy();
      });
    }

    // 2. If ScrollTrigger is available, create ScrollTrigger instance
    if (ScrollTrigger && this.container && this.stage) {
      try {
        this.scrollTriggerInstance = ScrollTrigger.create({
          trigger: this.container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: this.isReducedMotion ? 0 : true,
          pin: this.stage,
          pinType: this.pinType,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (this.isViewportActive && !this.isPaused) {
              this.update(self.progress);
            }
          },
        });

        this.cleanups.push(() => {
          if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
          }
        });
        return;
      } catch (err) {
        console.warn('[ScrollyStageEngine] ScrollTrigger initialization failed, falling back to vanilla scroll.', err);
      }
    }

    // 3. Fallback: Pure Vanilla scroll tracking with rAF batching
    let isTicking = false;
    const onScroll = () => {
      if (isTicking || !this.isViewportActive || this.isPaused) return;
      isTicking = true;
      requestAnimationFrame(() => {
        isTicking = false;
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) {
          this.update(0);
          return;
        }
        const currentScroll = -rect.top;
        const progress = clamp(currentScroll / totalScrollable, 0, 1);
        this.update(progress);
      });
    };

    this.boundScrollListener = onScroll;
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanups.push(() => {
        if (typeof window.removeEventListener === 'function') {
          window.removeEventListener('scroll', onScroll);
        }
      });
    }
  }

  /**
   * Setup IntersectionObserver to pause rendering when the stage scrolls off-screen
   */
  _setupIntersectionObserver() {
    if (!this.options.viewportObserver || !isBrowser()) {
      return;
    }

    const IOClass =
      (typeof window !== 'undefined' && window.IntersectionObserver) ||
      (typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null);

    if (!IOClass) {
      return;
    }

    try {
      this.intersectionObserver = new IOClass(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === this.container) {
              const wasActive = this.isViewportActive;
              this.isViewportActive = entry.isIntersecting;
              if (!wasActive && this.isViewportActive && !this.isPaused) {
                // Viewport entered: force immediate update
                this.update(this.progress);
              }
            }
          }
        },
        { rootMargin: '100px 0px 100px 0px', threshold: 0 }
      );

      if (this.container) {
        this.intersectionObserver.observe(this.container);
      }

      this.cleanups.push(() => {
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
          this.intersectionObserver = null;
        }
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Main render update function: takes progress in [0, 1]
   *
   * @param {number} rawProgress
   */
  update(rawProgress) {
    if (this.isDestroyed) return;

    const N = this.scenes.length;
    const timeline = calculateSceneTimeline(rawProgress, N);
    const { globalProgress, activeIndex, sceneProgress, sceneProgresses } = timeline;

    this.progress = globalProgress;
    const prevIndex = this.activeIndex;
    const hasSceneChanged = prevIndex !== activeIndex;
    this.activeIndex = activeIndex;

    // 1. Update CSS custom properties
    if (this.stage) {
      setStyleProperty(this.stage, '--scrolly-progress', globalProgress.toFixed(4));
      setStyleProperty(this.stage, '--active-scene-index', String(activeIndex));
      setStyleProperty(this.stage, '--scene-progress', sceneProgress.toFixed(4));
    }

    // 2. Update Progress Bar
    if (this.progressBar) {
      this.progressBar.style.transform = `scaleX(${globalProgress})`;
      this.progressBar.setAttribute('aria-valuenow', Math.round(globalProgress * 100));
    }

    // 3. Update Chapter Markers
    if (this.chapterMarkers.length > 0) {
      this.chapterMarkers.forEach((marker, i) => {
        const isActive = i === activeIndex;
        marker.setAttribute('aria-current', isActive ? 'step' : 'false');
        marker.setAttribute('data-active', isActive ? 'true' : 'false');
        marker.style.transform = isActive ? 'scale(1.4)' : 'scale(1.0)';
        marker.style.background = isActive ? 'currentColor' : 'transparent';
      });
    }

    // 4. Update Scene Transitions (60 FPS GPU-accelerated styling)
    this.scenes.forEach((scene, i) => {
      const localWeight = sceneProgresses[i] !== undefined ? sceneProgresses[i] : (i === activeIndex ? 1 : 0);
      const isActive = i === activeIndex;

      if (scene.element) {
        this._renderSceneStyles(scene.element, scene.transition, localWeight, i, activeIndex);
      }

      // Fire individual scene onUpdate callback
      if (typeof scene.onUpdate === 'function') {
        scene.onUpdate(localWeight, scene);
      }
    });

    // 5. Fire Lifecycle Callbacks
    if (hasSceneChanged) {
      const prevScene = this.scenes[prevIndex];
      const currScene = this.scenes[activeIndex];
      const direction = activeIndex > prevIndex ? 'forward' : 'backward';

      if (prevScene && typeof prevScene.onLeave === 'function') {
        prevScene.onLeave(prevScene, direction);
      }
      if (currScene && typeof currScene.onEnter === 'function') {
        currScene.onEnter(currScene, direction);
      }
      if (typeof this.options.onSceneChange === 'function') {
        this.options.onSceneChange(activeIndex, prevIndex);
      }
    }

    // Global onProgress callback
    if (typeof this.options.onProgress === 'function') {
      this.options.onProgress(globalProgress, activeIndex, sceneProgress);
    }
  }

  /**
   * Apply 60 FPS GPU transforms to scene element based on transition preset
   */
  _renderSceneStyles(el, transition, weight, sceneIndex, activeIndex) {
    if (!el || !el.style) return;

    // Reduced motion or TIER_LITE fallback: pure opacity, zero 3D transforms
    if (this.isReducedMotion || this.isTierLite) {
      el.style.opacity = weight > 0.01 ? String(weight.toFixed(3)) : '0';
      el.style.visibility = weight > 0.01 ? 'visible' : 'hidden';
      el.style.pointerEvents = sceneIndex === activeIndex ? 'auto' : 'none';
      el.style.transform = 'none';
      return;
    }

    // Standard 60 FPS Cinematic Transitions
    const clampedWeight = clamp(weight, 0, 1);
    const isVisible = clampedWeight > 0.005;

    el.style.visibility = isVisible ? 'visible' : 'hidden';
    el.style.pointerEvents = sceneIndex === activeIndex ? 'auto' : 'none';

    switch (transition) {
      case 'slide': {
        const offset = (sceneIndex - activeIndex) * 50; // pixels
        const y = lerp(offset, 0, clampedWeight);
        el.style.opacity = clampedWeight.toFixed(3);
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        break;
      }
      case 'zoom': {
        const scale = lerp(0.88, 1.0, clampedWeight);
        el.style.opacity = clampedWeight.toFixed(3);
        el.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;
        break;
      }
      case 'stack': {
        const z = (sceneIndex - activeIndex) * 30; // depth
        const scale = lerp(0.92, 1.0, clampedWeight);
        el.style.opacity = clampedWeight.toFixed(3);
        el.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        break;
      }
      case 'fade':
      default: {
        el.style.opacity = clampedWeight.toFixed(3);
        el.style.transform = 'translate3d(0, 0, 0)';
        break;
      }
    }
  }

  /**
   * Programmatically navigate to a specific scene index
   */
  goToScene(index, { smooth = true, immediate = false } = {}) {
    const N = this.scenes.length;
    if (N <= 0) return;
    const targetIdx = clamp(index, 0, N - 1);
    const targetProgress = N > 1 ? targetIdx / (N - 1) : 0;
    this.seek(targetProgress, { smooth, immediate });
  }

  nextScene() {
    this.goToScene(this.activeIndex + 1);
  }

  prevScene() {
    this.goToScene(this.activeIndex - 1);
  }

  /**
   * Scroll / seek to a specific progress ratio [0, 1]
   */
  seek(targetProgress, { smooth = true, immediate = false } = {}) {
    if (!isBrowser() || !this.container) return;

    const progress = clamp(targetProgress, 0, 1);
    const lenis = this.options.lenis;
    const rect = this.container.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const containerTop = rect.top + currentScrollY;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScrollY = containerTop + progress * Math.max(0, totalScrollable);

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetScrollY, { immediate: immediate || !smooth });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: immediate || !smooth ? 'auto' : 'smooth',
      });
    }

    // Force internal update immediately
    this.update(progress);
  }

  /**
   * Pause updates
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume updates
   */
  resume() {
    this.isPaused = false;
    if (this.isViewportActive) {
      this.update(this.progress);
    }
  }

  /**
   * Refresh measurements, locked VH, and proxies
   */
  refresh() {
    if (this.isDestroyed) return;
    lockViewportHeight(this.stage);
    if (this.scrollTriggerInstance && typeof this.scrollTriggerInstance.refresh === 'function') {
      this.scrollTriggerInstance.refresh();
    }
    this.update(this.progress);
  }

  /**
   * Tear down all listeners, proxies, and DOM mutations
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    // Run all registered cleanup handlers
    this.cleanups.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
    this.cleanups = [];

    // Reset styles
    if (this.container) {
      this.container.removeAttribute('data-scrolly-container');
      this.container.removeAttribute('data-scene-count');
    }
    if (this.stage) {
      this.stage.removeAttribute('data-scrolly-stage');
      this.stage.removeAttribute('data-pin-type');
      removeStyleProperty(this.stage, '--scrolly-progress');
      removeStyleProperty(this.stage, '--active-scene-index');
      removeStyleProperty(this.stage, '--scene-progress');
    }

    this.scenes = [];
    this.chapterMarkers = [];
    this.progressBar = null;
  }

  // =============================================================================
  // STATIC UTILITY HELPERS
  // =============================================================================

  static assertNoTransformedAncestor = assertNoTransformedAncestor;
  static setupGsapTickerBridge = setupGsapTickerBridge;
  static calculateSceneTimeline = calculateSceneTimeline;
  static calculateTrackHeight = calculateTrackHeight;
  static calculateLockedVh = calculateLockedVh;
  static lockViewportHeight = lockViewportHeight;
  static isTierLite = isTierLite;
  static prefersReducedMotion = prefersReducedMotion;

  /**
   * Auto-discover and initialize all scrolly stages marked with [data-scrolly-stage]
   */
  static initAll(options = {}) {
    if (!isBrowser()) {
      return { destroy: () => {}, instances: [] };
    }

    const stages = resolveElements('[data-scrolly-stage]');
    const instances = [];

    stages.forEach((stageEl) => {
      const container = stageEl.closest('[data-scrolly-container]') || stageEl.parentElement;
      const instance = new ScrollyStageEngine(
        Object.assign(
          {
            container,
            stage: stageEl,
          },
          options
        )
      );
      instances.push(instance);
    });

    return {
      instances,
      destroy: () => instances.forEach((inst) => inst.destroy()),
    };
  }
}

// Auto-attach to window in browser environments
if (isBrowser()) {
  window.ScrollyStageEngine = ScrollyStageEngine;
  window.assertNoTransformedAncestor = assertNoTransformedAncestor;
  window.setupGsapTickerBridge = setupGsapTickerBridge;
}

export default ScrollyStageEngine;
