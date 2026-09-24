/**
 * ⚡ SCROLLY STAGE ENGINE (UMD / Standalone Global Bundle)
 * ========================================================
 * Universal standalone UMD/Global build of ScrollyStageEngine for direct <script src="..."> tags,
 * legacy browser support, Electron, and local file:// protocols without CORS restrictions.
 *
 * Core Capabilities:
 *  - Dynamic Multi-Scene Support (N scenes, auto trackHeight = (N * 100) + 'vh')
 *  - Locked-VH Architecture (--locked-vh for iOS Safari address bar jump immunity)
 *  - GSAP Ticker Master Bridge (Lenis autoRaf: false, lagSmoothing(500, 33), scrollerProxy)
 *  - Safe Pinning Guard (assertNoTransformedAncestor, auto pinType: 'transform' vs 'fixed')
 *  - Scrub Progress Bar & Chapter Markers (interactive click navigation)
 *  - 60 FPS GPU-accelerated Transitions (fade, slide, zoom, stack, custom)
 *  - Battery & Thermal Watchdog (IntersectionObserver pause/resume when off-screen)
 *  - Accessibility & Performance Tiering (prefers-reduced-motion & TIER_LITE fallback)
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.ScrollyStageEngine = exports.ScrollyStageEngine;
    global.assertNoTransformedAncestor = exports.assertNoTransformedAncestor;
    global.setupGsapTickerBridge = exports.setupGsapTickerBridge;
    global.calculateSceneTimeline = exports.calculateSceneTimeline;
    global.calculateTrackHeight = exports.calculateTrackHeight;
    global.lockViewportHeight = exports.lockViewportHeight;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // =============================================================================
  // 0. ENVIRONMENT & UTILITIES
  // =============================================================================

  const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

  function clamp(val, min = 0, max = 1) {
    if (typeof val !== 'number' || Number.isNaN(val)) return min;
    return Math.min(Math.max(val, min), max);
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function prefersReducedMotion() {
    if (!isBrowser() || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  function isTierLite(options = {}) {
    if (options.tier === 'lite') return true;
    if (options.tier === 'high') return false;
    if (!isBrowser()) return false;

    try {
      if (typeof navigator !== 'undefined') {
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
          return true;
        }
        if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
          return true;
        }
      }
    } catch {}

    return false;
  }

  function isElement(target) {
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

  function resolveElement(target, parent = null) {
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

  function resolveElements(target, parent = null) {
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

  function setStyleProperty(el, key, val) {
    if (!el || !el.style) return;
    if (typeof el.style.setProperty === 'function') {
      el.style.setProperty(key, String(val));
    } else {
      el.style[key] = String(val);
    }
  }

  function removeStyleProperty(el, key) {
    if (!el || !el.style) return;
    if (typeof el.style.removeProperty === 'function') {
      el.style.removeProperty(key);
    } else {
      delete el.style[key];
    }
  }

  // =============================================================================
  // 1. LOCKED-VH ARCHITECTURE
  // =============================================================================

  function calculateLockedVh() {
    if (!isBrowser()) return 8.0;
    return window.innerHeight * 0.01;
  }

  function lockViewportHeight(targetElement = null) {
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
    } catch {}

    return lockedVh;
  }

  // =============================================================================
  // 2. SAFE PINNING GUARD
  // =============================================================================

  function assertNoTransformedAncestor(element) {
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
    while (curr && curr !== document.documentElement && curr !== document.body) {
      let style = null;
      try {
        style = window.getComputedStyle(curr);
      } catch {
        break;
      }

      if (style) {
        // transform
        const transform = style.transform || style.webkitTransform;
        if (transform && transform !== 'none' && transform !== '') {
          const info = {
            safe: false,
            transformedAncestor: curr,
            property: 'transform',
            value: transform,
            suggestedPinType: 'transform',
            reason: `Ancestor <${curr.tagName.toLowerCase()}${curr.id ? '#' + curr.id : ''}${curr.className ? '.' + String(curr.className).trim().replace(/\s+/g, '.') : ''}> has transform: "${transform}". This creates a local stacking context and breaks position: fixed pinning!`,
          };
          console.warn(`[ScrollyStageEngine] ${info.reason} Auto-selecting pinType: 'transform'.`);
          return info;
        }

        // filter
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

        // perspective
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

        // contain
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

        // will-change
        const willChange = style.willChange || '';
        if (/transform|filter|perspective/.test(willChange)) {
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
  // 3. GSAP TICKER MASTER BRIDGE
  // =============================================================================

  function setupGsapTickerBridge(bridgeOptions = {}) {
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

    try {
      gsap.ticker.lagSmoothing(500, 33);
    } catch {}

    let tickerListener = null;
    let scrollTriggerScrollHandler = null;
    let scrollTriggerRefreshHandler = null;

    if (lenis) {
      if (lenis.options && lenis.options.autoRaf === true) {
        console.warn(
          '[ScrollyStageEngine] Lenis autoRaf was enabled! Disabling internal RAF to eliminate double-ticking.'
        );
        lenis.options.autoRaf = false;
        if (typeof lenis.stop === 'function') {
          lenis.stop();
          if (typeof lenis.start === 'function') lenis.start();
        }
      }

      tickerListener = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerListener);

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
    }

    return {
      isConnected: true,
      destroy: () => {
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
      },
    };
  }

  // =============================================================================
  // 4. TIMELINE DISTRIBUTION & MATH
  // =============================================================================

  function calculateSceneTimeline(rawProgress, sceneCount) {
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
        sceneProgresses: [globalProgress],
      };
    }

    const segmentFraction = 1 / (N - 1);
    const exactIndex = globalProgress * (N - 1);
    const activeIndex = clamp(Math.round(exactIndex), 0, N - 1);

    const sceneProgresses = new Array(N);
    for (let i = 0; i < N; i++) {
      const center = i / (N - 1);
      const dist = Math.abs(globalProgress - center);
      const segDist = dist / segmentFraction;
      sceneProgresses[i] = clamp(1 - segDist, 0, 1);
    }

    const segmentIndex = clamp(Math.floor(exactIndex), 0, N - 2);
    const localSegmentProgress = (globalProgress - segmentIndex * segmentFraction) / segmentFraction;

    return {
      globalProgress,
      activeIndex,
      sceneProgress: clamp(localSegmentProgress, 0, 1),
      sceneProgresses,
    };
  }

  function calculateTrackHeight(sceneCount, trackMultiplier = 100) {
    const N = Math.max(1, parseInt(sceneCount, 10) || 1);
    const mult = Math.max(10, parseFloat(trackMultiplier) || 100);
    return `${N * mult}vh`;
  }

  // =============================================================================
  // 5. SCROLLY STAGE ENGINE CLASS
  // =============================================================================

  class ScrollyStageEngine {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          container: null,
          stage: null,
          scenes: [],
          trackMultiplier: 100,
          pinType: 'auto',
          gsap: null,
          ScrollTrigger: null,
          lenis: null,
          progressBar: null,
          chapterMarkers: null,
          transition: 'fade',
          onProgress: null,
          onSceneChange: null,
          reducedMotion: 'auto',
          tier: 'auto',
          viewportObserver: true,
          autoInit: true,
        },
        options
      );

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

      this.isReducedMotion =
        this.options.reducedMotion === true ||
        (this.options.reducedMotion === 'auto' && prefersReducedMotion());
      this.isTierLite = isTierLite(this.options);

      if (this.options.autoInit) {
        this.init();
      }
    }

    init() {
      if (!isBrowser()) return this;
      if (this.isDestroyed) return this;

      this.container = resolveElement(this.options.container);
      if (!this.container) return this;

      this.stage =
        resolveElement(this.options.stage, this.container) ||
        resolveElement('.scrolly-stage', this.container) ||
        this.container.firstElementChild;

      if (!this.stage) return this;

      this._resolveScenes();
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

      if (this.options.pinType === 'auto') {
        const guardResult = assertNoTransformedAncestor(this.stage);
        this.pinType = guardResult.suggestedPinType;
      } else {
        this.pinType = this.options.pinType;
      }

      this._applyStyles();
      this._setupProgressBar();
      this._setupChapterMarkers();
      this._setupScrollIntegration();
      this._setupIntersectionObserver();
      this.update(0);

      return this;
    }

    _resolveScenes() {
      const rawScenes = this.options.scenes;
      let resolved = [];

      if (Array.isArray(rawScenes) && rawScenes.length > 0) {
        resolved = rawScenes.map((item, idx) => {
          if (typeof item === 'string') {
            return { id: `scene-${idx}`, title: item, element: null, index: idx };
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

    _applyStyles() {
      if (!this.container || !this.stage) return;

      const N = this.scenes.length || 1;
      const trackHeight = calculateTrackHeight(N, this.options.trackMultiplier);

      this.container.style.position = 'relative';
      this.container.style.height = trackHeight;
      this.container.setAttribute('data-scrolly-container', 'true');
      this.container.setAttribute('data-scene-count', String(N));

      this.stage.style.position = 'sticky';
      this.stage.style.top = '0px';
      this.stage.style.left = '0px';
      this.stage.style.width = '100%';
      this.stage.style.height = 'calc(var(--locked-vh, 1vh) * 100)';
      this.stage.style.maxHeight = '100vh';
      this.stage.style.overflow = 'hidden';
      this.stage.setAttribute('data-scrolly-stage', 'true');
      this.stage.setAttribute('data-pin-type', this.pinType);

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

    _setupProgressBar() {
      if (!this.options.progressBar) return;

      let barEl = resolveElement(this.options.progressBar, this.stage || this.container);
      if (!barEl && this.stage) {
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

    _setupChapterMarkers() {
      if (!this.options.chapterMarkers) return;

      let markersWrap = resolveElement(this.options.chapterMarkers, this.stage || this.container);
      const N = this.scenes.length;

      if (!markersWrap && this.stage && N > 0) {
        markersWrap = document.createElement('nav');
        markersWrap.className = 'scrolly-chapter-markers';
        markersWrap.setAttribute('aria-label', 'Scrollytelling Scenes');
        markersWrap.style.position = 'absolute';
        markersWrap.style.right = '24px';
        markersWrap.style.top = '50%';
        markersWrap.style.transform = 'translateY(-50%)';
        markersWrap.style.display = 'flex';
        markersWrap.style.flexDirection = 'column';
        markersWrap.style.gap = '12px';
        markersWrap.style.zIndex = '90';
        this.stage.appendChild(markersWrap);
        this.cleanups.push(() => markersWrap.remove());
      }

      if (markersWrap && N > 0) {
        this.markersContainer = markersWrap;
        let markerBtns = resolveElements('[data-scene-marker]', markersWrap);
        if (markerBtns.length === 0) {
          markersWrap.innerHTML = '';
          markerBtns = this.scenes.map((scene, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scrolly-marker-dot';
            btn.setAttribute('data-scene-marker', String(i));
            btn.setAttribute('aria-label', scene.title || `Go to Scene ${i + 1}`);
            btn.style.width = '12px';
            btn.style.height = '12px';
            btn.style.borderRadius = '50%';
            btn.style.border = '2px solid rgba(0, 0, 0, 0.4)';
            btn.style.background = i === 0 ? 'currentColor' : 'transparent';
            btn.style.padding = '0';
            btn.style.cursor = 'pointer';
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

    _setupScrollIntegration() {
      const gsap = this.options.gsap || (isBrowser() && window.gsap) || null;
      const ScrollTrigger = this.options.ScrollTrigger || (isBrowser() && window.ScrollTrigger) || null;
      const lenis = this.options.lenis || null;

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
      } catch {}
    }

    update(rawProgress) {
      if (this.isDestroyed) return;

      const N = this.scenes.length;
      const timeline = calculateSceneTimeline(rawProgress, N);
      const { globalProgress, activeIndex, sceneProgress, sceneProgresses } = timeline;

      this.progress = globalProgress;
      const prevIndex = this.activeIndex;
      const hasSceneChanged = prevIndex !== activeIndex;
      this.activeIndex = activeIndex;

      if (this.stage) {
        setStyleProperty(this.stage, '--scrolly-progress', globalProgress.toFixed(4));
        setStyleProperty(this.stage, '--active-scene-index', String(activeIndex));
        setStyleProperty(this.stage, '--scene-progress', sceneProgress.toFixed(4));
      }

      if (this.progressBar) {
        this.progressBar.style.transform = `scaleX(${globalProgress})`;
        this.progressBar.setAttribute('aria-valuenow', Math.round(globalProgress * 100));
      }

      if (this.chapterMarkers.length > 0) {
        this.chapterMarkers.forEach((marker, i) => {
          const isActive = i === activeIndex;
          marker.setAttribute('aria-current', isActive ? 'step' : 'false');
          marker.setAttribute('data-active', isActive ? 'true' : 'false');
          marker.style.transform = isActive ? 'scale(1.4)' : 'scale(1.0)';
          marker.style.background = isActive ? 'currentColor' : 'transparent';
        });
      }

      this.scenes.forEach((scene, i) => {
        const localWeight = sceneProgresses[i] !== undefined ? sceneProgresses[i] : (i === activeIndex ? 1 : 0);
        if (scene.element) {
          this._renderSceneStyles(scene.element, scene.transition, localWeight, i, activeIndex);
        }
        if (typeof scene.onUpdate === 'function') {
          scene.onUpdate(localWeight, scene);
        }
      });

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

      if (typeof this.options.onProgress === 'function') {
        this.options.onProgress(globalProgress, activeIndex, sceneProgress);
      }
    }

    _renderSceneStyles(el, transition, weight, sceneIndex, activeIndex) {
      if (!el || !el.style) return;

      if (this.isReducedMotion || this.isTierLite) {
        el.style.opacity = weight > 0.01 ? String(weight.toFixed(3)) : '0';
        el.style.visibility = weight > 0.01 ? 'visible' : 'hidden';
        el.style.pointerEvents = sceneIndex === activeIndex ? 'auto' : 'none';
        el.style.transform = 'none';
        return;
      }

      const clampedWeight = clamp(weight, 0, 1);
      const isVisible = clampedWeight > 0.005;

      el.style.visibility = isVisible ? 'visible' : 'hidden';
      el.style.pointerEvents = sceneIndex === activeIndex ? 'auto' : 'none';

      switch (transition) {
        case 'slide': {
          const offset = (sceneIndex - activeIndex) * 50;
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
          const z = (sceneIndex - activeIndex) * 30;
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

      this.update(progress);
    }

    pause() {
      this.isPaused = true;
    }

    resume() {
      this.isPaused = false;
      if (this.isViewportActive) {
        this.update(this.progress);
      }
    }

    refresh() {
      if (this.isDestroyed) return;
      lockViewportHeight(this.stage);
      if (this.scrollTriggerInstance && typeof this.scrollTriggerInstance.refresh === 'function') {
        this.scrollTriggerInstance.refresh();
      }
      this.update(this.progress);
    }

    destroy() {
      if (this.isDestroyed) return;
      this.isDestroyed = true;

      this.cleanups.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
      this.cleanups = [];

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

    static assertNoTransformedAncestor = assertNoTransformedAncestor;
    static setupGsapTickerBridge = setupGsapTickerBridge;
    static calculateSceneTimeline = calculateSceneTimeline;
    static calculateTrackHeight = calculateTrackHeight;
    static calculateLockedVh = calculateLockedVh;
    static lockViewportHeight = lockViewportHeight;
    static isTierLite = isTierLite;
    static prefersReducedMotion = prefersReducedMotion;

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

  return {
    isBrowser,
    clamp,
    lerp,
    prefersReducedMotion,
    isTierLite,
    calculateLockedVh,
    lockViewportHeight,
    assertNoTransformedAncestor,
    setupGsapTickerBridge,
    calculateSceneTimeline,
    calculateTrackHeight,
    ScrollyStageEngine,
    default: ScrollyStageEngine,
  };
});
