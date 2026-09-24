/**
 * ⚡ BATTERY WATCHDOG & ECO GRAPHIC ARBITER (UMD / Standalone Global Bundle)
 * =========================================================================
 * Universal standalone UMD/Global build of BatteryWatchdog for direct <script src="..."> tags,
 * legacy browsers, Electron, and local file:// protocols without CORS restrictions.
 *
 * Core Modules:
 *  - AdaptiveBatteryWatchdog
 *  - EcoGraphicArbiter
 *  - BATTERY_TIERS
 *  - DISPLAY_STATES
 *  - initBatteryWatchdog(options)
 *  - initGraphicArbiter(options)
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.BatteryWatchdog = exports;
    global.AdaptiveBatteryWatchdog = exports.AdaptiveBatteryWatchdog;
    global.EcoGraphicArbiter = exports.EcoGraphicArbiter;
    global.BATTERY_TIERS = exports.BATTERY_TIERS;
    global.DISPLAY_STATES = exports.DISPLAY_STATES;
    global.initBatteryWatchdog = exports.initBatteryWatchdog;
    global.initGraphicArbiter = exports.initGraphicArbiter;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  const safeRequestAnimationFrame = (cb) => {
    if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame(cb);
    if (typeof setTimeout !== 'undefined') return setTimeout(() => cb(Date.now()), 16);
    return null;
  };

  const safeCancelAnimationFrame = (id) => {
    if (id == null) return;
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(id);
    } else if (typeof clearTimeout !== 'undefined') {
      clearTimeout(id);
    }
  };

  const BATTERY_TIERS = Object.freeze({
    HIGH: 'TIER_HIGH',
    ECO: 'TIER_ECO',
    CRITICAL: 'TIER_CRITICAL',
  });

  const DISPLAY_STATES = Object.freeze({
    ACTIVE: 'ACTIVE',
    IDLE: 'IDLE',
    SLEEP: 'SLEEP',
    HIDDEN: 'HIDDEN',
    BLURRED: 'BLURRED',
  });

  class AdaptiveBatteryWatchdog {
    constructor(options = {}) {
      this.lowBatteryThreshold = options.lowBatteryThreshold !== undefined ? options.lowBatteryThreshold : 0.20;
      this.criticalBatteryThreshold = options.criticalBatteryThreshold !== undefined ? options.criticalBatteryThreshold : 0.10;
      this.idleTimeout = options.idleTimeout !== undefined ? options.idleTimeout : 30000;
      this.hiddenFps = options.hiddenFps !== undefined ? options.hiddenFps : 1;
      this.blurFps = options.blurFps !== undefined ? options.blurFps : 1;
      this.sleepFps = options.sleepFps !== undefined ? options.sleepFps : 0;
      this.ecoFps = options.ecoFps !== undefined ? options.ecoFps : 30;
      this.highFps = options.highFps !== undefined ? options.highFps : 60;
      this.criticalFps = options.criticalFps !== undefined ? options.criticalFps : 15;

      this.autoSleep = options.autoSleep !== false;
      this.observeVisibility = options.observeVisibility !== false;
      this.observeBlur = options.observeBlur !== false;

      this.onTierChange = typeof options.onTierChange === 'function' ? options.onTierChange : null;
      this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : null;
      this.onSleep = typeof options.onSleep === 'function' ? options.onSleep : null;
      this.onWake = typeof options.onWake === 'function' ? options.onWake : null;
      this._listeners = new Map();

      this.tier = BATTERY_TIERS.HIGH;
      this.state = DISPLAY_STATES.ACTIVE;
      this.isSleepingState = false;
      this.isDocumentHidden = false;
      this.isWindowBlurred = false;
      this.lastActivityTime = Date.now();
      this._lastTimerResetTime = 0;
      this.batterySupported = false;

      this.batteryInfo = {
        charging: true,
        level: 1.0,
        chargingTime: 0,
        dischargingTime: Infinity,
        supported: false,
      };

      this._batteryManager = null;
      this._idleTimer = null;
      this._boundOnActivity = this._onActivity.bind(this);
      this._boundOnVisibilityChange = this._onVisibilityChange.bind(this);
      this._boundOnBlur = this._onBlur.bind(this);
      this._boundOnFocus = this._onFocus.bind(this);
      this._boundBatteryChange = this._onBatteryChange.bind(this);

      this._destroyed = false;

      this._initBatteryMonitoring();
      this._initVisibilityAndBlur();
      this._initActivityListeners();
      this._resetIdleTimer();
    }

    addEventListener(event, callback) {
      if (typeof callback !== 'function') return;
      if (!this._listeners.has(event)) {
        this._listeners.set(event, new Set());
      }
      this._listeners.get(event).add(callback);
    }

    removeEventListener(event, callback) {
      if (this._listeners.has(event)) {
        this._listeners.get(event).delete(callback);
      }
    }

    _emit(event, ...args) {
      if (this._listeners.has(event)) {
        for (const cb of this._listeners.get(event)) {
          try {
            cb(...args);
          } catch (err) {
            console.error(`[AdaptiveBatteryWatchdog] Error in '${event}' listener:`, err);
          }
        }
      }
    }

    async _initBatteryMonitoring() {
      if (!isBrowser() || typeof navigator === 'undefined' || typeof navigator.getBattery !== 'function') {
        this.batterySupported = false;
        this.batteryInfo.supported = false;
        this._evaluateTier();
        return;
      }

      try {
        const battery = await navigator.getBattery();
        if (this._destroyed) return;

        this._batteryManager = battery;
        this.batterySupported = true;
        this.batteryInfo.supported = true;
        this._syncBatteryManager(battery);

        if (typeof battery.addEventListener === 'function') {
          battery.addEventListener('chargingchange', this._boundBatteryChange);
          battery.addEventListener('levelchange', this._boundBatteryChange);
          battery.addEventListener('chargingtimechange', this._boundBatteryChange);
          battery.addEventListener('dischargingtimechange', this._boundBatteryChange);
        }
      } catch {
        this.batterySupported = false;
        this.batteryInfo.supported = false;
        this._evaluateTier();
      }
    }

    _syncBatteryManager(battery) {
      if (!battery) return;
      this.batteryInfo.charging = typeof battery.charging === 'boolean' ? battery.charging : true;
      this.batteryInfo.level = typeof battery.level === 'number' && !isNaN(battery.level)
        ? clamp(battery.level, 0, 1)
        : 1.0;
      this.batteryInfo.chargingTime = battery.chargingTime || 0;
      this.batteryInfo.dischargingTime = battery.dischargingTime || Infinity;
      this._evaluateTier();
    }

    _onBatteryChange() {
      if (this._batteryManager) {
        this._syncBatteryManager(this._batteryManager);
      }
    }

    _evaluateTier() {
      const prevTier = this.tier;
      const { charging, level } = this.batteryInfo;

      if (!charging && level < this.criticalBatteryThreshold) {
        this.tier = BATTERY_TIERS.CRITICAL;
      } else if (!charging || level < this.lowBatteryThreshold) {
        this.tier = BATTERY_TIERS.ECO;
      } else {
        this.tier = BATTERY_TIERS.HIGH;
      }

      if (this.tier !== prevTier) {
        if (this.onTierChange) {
          this.onTierChange(this.tier, { ...this.batteryInfo });
        }
        this._emit('tierchange', this.tier, { ...this.batteryInfo });
      }
    }

    _initVisibilityAndBlur() {
      if (!isBrowser()) return;

      if (this.observeVisibility && typeof document !== 'undefined' && document.addEventListener) {
        this.isDocumentHidden = !!document.hidden;
        document.addEventListener('visibilitychange', this._boundOnVisibilityChange);
        window.addEventListener('pagehide', this._boundOnVisibilityChange);
        window.addEventListener('pageshow', this._boundOnVisibilityChange);
      }

      if (this.observeBlur && typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('blur', this._boundOnBlur);
        window.addEventListener('focus', this._boundOnFocus);
      }

      this._updateDisplayState();
    }

    _onVisibilityChange() {
      if (typeof document !== 'undefined') {
        this.isDocumentHidden = !!document.hidden;
      }
      this._updateDisplayState();
    }

    _onBlur() {
      this.isWindowBlurred = true;
      this._updateDisplayState();
    }

    _onFocus() {
      this.isWindowBlurred = false;
      this._recordActivityInternal(true);
      this._updateDisplayState();
    }

    _updateDisplayState() {
      const prevState = this.state;

      if (this.isDocumentHidden) {
        this.state = DISPLAY_STATES.HIDDEN;
      } else if (this.isWindowBlurred) {
        this.state = DISPLAY_STATES.BLURRED;
      } else if (this.isSleepingState) {
        this.state = DISPLAY_STATES.SLEEP;
      } else {
        this.state = DISPLAY_STATES.ACTIVE;
      }

      if (this.state !== prevState) {
        if (this.onStateChange) {
          this.onStateChange(this.state);
        }
        this._emit('statechange', this.state);
      }
    }

    _initActivityListeners() {
      if (!isBrowser() || !this.autoSleep) return;

      const events = [
        'mousemove',
        'mousedown',
        'pointermove',
        'keydown',
        'wheel',
        'scroll',
        'touchstart',
      ];

      events.forEach((evt) => {
        window.addEventListener(evt, this._boundOnActivity, { passive: true, capture: true });
      });
    }

    _onActivity() {
      this._recordActivityInternal(false);
    }

    _recordActivityInternal(force = false) {
      const now = Date.now();
      this.lastActivityTime = now;

      if (this.isSleepingState) {
        this.wake();
        return;
      }

      const elapsedSinceReset = now - this._lastTimerResetTime;
      if (force || !this._idleTimer || elapsedSinceReset >= 1000) {
        this._resetIdleTimer();
      }
    }

    _resetIdleTimer() {
      if (!this.autoSleep) return;

      if (this._idleTimer) {
        clearTimeout(this._idleTimer);
        this._idleTimer = null;
      }

      if (!this._destroyed && !this.isSleepingState) {
        this._lastTimerResetTime = Date.now();
        this._idleTimer = setTimeout(() => {
          this.sleep();
        }, this.idleTimeout);
      }
    }

    sleep() {
      if (this.isSleepingState) return;

      this.isSleepingState = true;
      if (this._idleTimer) {
        clearTimeout(this._idleTimer);
        this._idleTimer = null;
      }

      this._updateDisplayState();

      if (this.onSleep) {
        this.onSleep();
      }
      this._emit('sleep');
    }

    wake() {
      if (!this.isSleepingState && this.state === DISPLAY_STATES.ACTIVE) return;

      this.isSleepingState = false;
      this.lastActivityTime = Date.now();
      this._resetIdleTimer();
      this._updateDisplayState();

      if (this.onWake) {
        this.onWake();
      }
      this._emit('wake');
    }

    recordActivity() {
      this._recordActivityInternal(true);
    }

    getTier() {
      return this.tier;
    }

    getState() {
      return this.state;
    }

    getBatteryInfo() {
      return { ...this.batteryInfo };
    }

    isSleeping() {
      return this.isSleepingState;
    }

    isHidden() {
      return this.isDocumentHidden;
    }

    isBlurred() {
      return this.isWindowBlurred;
    }

    getTargetFps() {
      if (this.isDocumentHidden) {
        return this.hiddenFps;
      }
      if (this.isWindowBlurred) {
        return this.blurFps;
      }
      if (this.isSleepingState) {
        return this.sleepFps;
      }
      switch (this.tier) {
        case BATTERY_TIERS.CRITICAL:
          return this.criticalFps;
        case BATTERY_TIERS.ECO:
          return this.ecoFps;
        case BATTERY_TIERS.HIGH:
        default:
          return this.highFps;
      }
    }

    simulateBattery(customInfo = {}) {
      this.batterySupported = true;
      this.batteryInfo.supported = true;
      if (typeof customInfo.charging === 'boolean') {
        this.batteryInfo.charging = customInfo.charging;
      }
      if (typeof customInfo.level === 'number' && !isNaN(customInfo.level)) {
        this.batteryInfo.level = clamp(customInfo.level, 0, 1);
      }
      if (typeof customInfo.chargingTime === 'number') {
        this.batteryInfo.chargingTime = customInfo.chargingTime;
      }
      if (typeof customInfo.dischargingTime === 'number') {
        this.batteryInfo.dischargingTime = customInfo.dischargingTime;
      }
      this._evaluateTier();
    }

    simulateVisibility(hidden) {
      this.isDocumentHidden = !!hidden;
      this._updateDisplayState();
    }

    simulateBlur(blurred) {
      this.isWindowBlurred = !!blurred;
      this._updateDisplayState();
    }

    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;

      if (this._idleTimer) {
        clearTimeout(this._idleTimer);
        this._idleTimer = null;
      }

      if (this._batteryManager && typeof this._batteryManager.removeEventListener === 'function') {
        this._batteryManager.removeEventListener('chargingchange', this._boundBatteryChange);
        this._batteryManager.removeEventListener('levelchange', this._boundBatteryChange);
        this._batteryManager.removeEventListener('chargingtimechange', this._boundBatteryChange);
        this._batteryManager.removeEventListener('dischargingtimechange', this._boundBatteryChange);
      }

      if (isBrowser()) {
        if (typeof document !== 'undefined' && document.removeEventListener) {
          document.removeEventListener('visibilitychange', this._boundOnVisibilityChange);
        }
        if (typeof window !== 'undefined' && window.removeEventListener) {
          window.removeEventListener('pagehide', this._boundOnVisibilityChange);
          window.removeEventListener('pageshow', this._boundOnVisibilityChange);
          window.removeEventListener('blur', this._boundOnBlur);
          window.removeEventListener('focus', this._boundOnFocus);

          const events = [
            'mousemove',
            'mousedown',
            'pointermove',
            'keydown',
            'wheel',
            'scroll',
            'touchstart',
          ];
          events.forEach((evt) => {
            window.removeEventListener(evt, this._boundOnActivity, { passive: true, capture: true });
          });
        }
      }

      if (this._listeners) {
        this._listeners.clear();
      }
    }
  }

  class EcoGraphicArbiter {
    constructor(options = {}) {
      this.watchdog = options.watchdog || new AdaptiveBatteryWatchdog(options.watchdogOptions || {});
      this._ownsWatchdog = !options.watchdog;

      this.uiTargetFps = options.uiTargetFps || 60;
      this.canvasTargetFps = options.canvasTargetFps || 30;
      this.ecoCanvasTargetFps = options.ecoCanvasTargetFps || 30;
      this.highCanvasTargetFps = options.highCanvasTargetFps || 60;
      this.criticalCanvasTargetFps = options.criticalCanvasTargetFps || 15;
      this.hiddenFps = options.hiddenFps !== undefined ? options.hiddenFps : 1;
      this.sleepFps = options.sleepFps !== undefined ? options.sleepFps : 0;

      this.uiRenderers = new Map();
      this.canvasRenderers = new Map();

      this.isRunning = false;
      this._isLoopSleeping = false;
      this._rafId = null;
      this._lastTime = 0;
      this._lastUiTime = 0;
      this._lastCanvasTime = 0;

      this.metrics = {
        uiFrames: 0,
        canvasFrames: 0,
        skippedCanvasFrames: 0,
        lastStepTime: 0,
        measuredUiFps: 0,
        measuredCanvasFps: 0,
      };
      this._fpsWindowStart = 0;
      this._fpsUiCount = 0;
      this._fpsCanvasCount = 0;

      this._boundStep = this._loop.bind(this);
      this._boundOnWatchdogWake = () => {
        if (this.isRunning && this._isLoopSleeping) {
          this._isLoopSleeping = false;
          this._lastTime = 0;
          this._lastUiTime = 0;
          this._lastCanvasTime = 0;
          this._rafId = safeRequestAnimationFrame(this._boundStep);
        }
      };
      this._boundOnWatchdogSleep = () => {
        if (this.isRunning && this._rafId !== null) {
          this._isLoopSleeping = true;
          safeCancelAnimationFrame(this._rafId);
          this._rafId = null;
        }
      };

      if (this.watchdog && typeof this.watchdog.addEventListener === 'function') {
        this.watchdog.addEventListener('wake', this._boundOnWatchdogWake);
        this.watchdog.addEventListener('sleep', this._boundOnWatchdogSleep);
      }

      this._destroyed = false;

      if (options.autoStart && isBrowser()) {
        this.start();
      }
    }

    registerUIRenderer(id, renderFn) {
      if (typeof renderFn !== 'function') return;
      this.uiRenderers.set(id, renderFn);
    }

    unregisterUIRenderer(id) {
      this.uiRenderers.delete(id);
    }

    registerCanvasRenderer(id, renderFn, options = {}) {
      if (typeof renderFn !== 'function') return;

      const resolvedCanvas = options.canvas || (options.gl && options.gl.canvas) || null;
      const entry = {
        id,
        renderFn,
        canvas: resolvedCanvas,
        gl: options.gl || null,
        targetFps: options.targetFps || null,
        autoRecover: options.autoRecover !== false,
        isContextLost: false,
        recoveryHandle: null,
        onLost: options.onLost || null,
        onRestored: options.onRestored || null,
      };

      if (resolvedCanvas && entry.autoRecover) {
        entry.recoveryHandle = this.attachContextRecovery(resolvedCanvas, {
          onLost: (e) => {
            entry.isContextLost = true;
            if (typeof entry.onLost === 'function') entry.onLost(e);
          },
          onRestored: (e) => {
            entry.isContextLost = false;
            if (typeof entry.onRestored === 'function') entry.onRestored(e, entry.gl);
          },
        });
      }

      this.canvasRenderers.set(id, entry);
    }

    unregisterCanvasRenderer(id) {
      const entry = this.canvasRenderers.get(id);
      if (entry && entry.recoveryHandle) {
        entry.recoveryHandle.detach();
      }
      this.canvasRenderers.delete(id);
    }

    calculateScissorRect(canvasBounds, panelBounds) {
      const cw = Math.max(0, canvasBounds.width || 0);
      const ch = Math.max(0, canvasBounds.height || 0);

      if (cw === 0 || ch === 0 || !panelBounds) {
        return {
          x: 0,
          y: 0,
          width: cw,
          height: ch,
          occludedRatio: 0,
          isOccluded: false,
          savingsPercent: 0,
        };
      }

      const canvasLeft = canvasBounds.x || 0;
      const canvasTop = canvasBounds.y || 0;

      const px = (panelBounds.x || 0) - canvasLeft;
      const py = (panelBounds.y || 0) - canvasTop;
      const pw = Math.max(0, panelBounds.width || 0);
      const ph = Math.max(0, panelBounds.height || 0);

      const intersectLeft = Math.max(0, px);
      const intersectRight = Math.min(cw, px + pw);
      const intersectTop = Math.max(0, py);
      const intersectBottom = Math.min(ch, py + ph);

      const overlapW = Math.max(0, intersectRight - intersectLeft);
      const overlapH = Math.max(0, intersectBottom - intersectTop);
      const occludedArea = overlapW * overlapH;
      const canvasArea = cw * ch;
      const occludedRatio = canvasArea > 0 ? occludedArea / canvasArea : 0;
      const isOccluded = occludedRatio > 0.001;

      if (!isOccluded) {
        return {
          x: 0,
          y: 0,
          width: cw,
          height: ch,
          occludedRatio: 0,
          isOccluded: false,
          savingsPercent: 0,
        };
      }

      const touchesRight = intersectRight >= cw - 1;
      const touchesLeft = intersectLeft <= 1;
      const touchesTop = intersectTop <= 1;
      const touchesBottom = intersectBottom >= ch - 1;

      let scissorX = 0;
      let scissorY = 0;
      let scissorW = cw;
      let scissorH = ch;

      if (touchesRight && !touchesLeft && overlapH >= ch * 0.5) {
        scissorX = 0;
        scissorY = 0;
        scissorW = Math.max(0, Math.floor(intersectLeft));
        scissorH = ch;
      } else if (touchesLeft && !touchesRight && overlapH >= ch * 0.5) {
        scissorX = Math.min(cw, Math.ceil(intersectRight));
        scissorY = 0;
        scissorW = Math.max(0, cw - scissorX);
        scissorH = ch;
      } else if (touchesTop && !touchesBottom && overlapW >= cw * 0.5) {
        scissorX = 0;
        scissorY = 0;
        scissorW = cw;
        scissorH = Math.max(0, Math.floor(ch - intersectBottom));
      } else if (touchesBottom && !touchesTop && overlapW >= cw * 0.5) {
        const visibleH = Math.max(0, Math.floor(intersectTop));
        scissorX = 0;
        scissorY = Math.min(ch, Math.ceil(ch - visibleH));
        scissorW = cw;
        scissorH = visibleH;
      } else {
        const candidates = [
          { x: 0, y: 0, w: Math.max(0, Math.floor(intersectLeft)), h: ch },
          { x: Math.min(cw, Math.ceil(intersectRight)), y: 0, w: Math.max(0, cw - Math.ceil(intersectRight)), h: ch },
          { x: 0, y: 0, w: cw, h: Math.max(0, Math.floor(ch - intersectBottom)) },
          { x: 0, y: Math.min(ch, Math.ceil(ch - Math.floor(intersectTop))), w: cw, h: Math.max(0, Math.floor(intersectTop)) },
        ];

        let bestCandidate = null;
        let maxCandidateArea = 0;

        for (const cand of candidates) {
          const area = cand.w * cand.h;
          if (area > maxCandidateArea && area < canvasArea) {
            maxCandidateArea = area;
            bestCandidate = cand;
          }
        }

        if (bestCandidate && maxCandidateArea >= canvasArea * 0.5 && (canvasArea - maxCandidateArea) >= canvasArea * 0.05) {
          scissorX = bestCandidate.x;
          scissorY = bestCandidate.y;
          scissorW = bestCandidate.w;
          scissorH = bestCandidate.h;
        } else {
          scissorX = 0;
          scissorY = 0;
          scissorW = cw;
          scissorH = ch;
        }
      }

      const actualSavedArea = canvasArea - (scissorW * scissorH);
      const savingsPercent = canvasArea > 0 ? Math.round((actualSavedArea / canvasArea) * 100) : 0;
      const finalIsOccluded = savingsPercent > 0;

      return {
        x: scissorX,
        y: scissorY,
        width: scissorW,
        height: scissorH,
        occludedRatio,
        isOccluded: finalIsOccluded,
        savingsPercent,
      };
    }

    applyScissorOptimization(gl, canvasBounds, panelBounds) {
      if (!gl || typeof gl.enable !== 'function' || typeof gl.scissor !== 'function') {
        return null;
      }

      const rect = this.calculateScissorRect(canvasBounds, panelBounds);
      if (rect.isOccluded && rect.savingsPercent > 0 && rect.width > 0 && rect.height > 0 && (rect.width < (canvasBounds.width || 0) || rect.height < (canvasBounds.height || 0))) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(rect.x, rect.y, rect.width, rect.height);
      } else {
        gl.disable(gl.SCISSOR_TEST);
      }

      return rect;
    }

    clearScissorOptimization(gl) {
      if (gl && typeof gl.disable === 'function') {
        gl.disable(gl.SCISSOR_TEST);
      }
    }

    attachContextRecovery(canvas, callbacks = {}) {
      if (!canvas || typeof canvas.addEventListener !== 'function') {
        return { detach: () => {}, isLost: () => false };
      }

      let isLost = false;

      const onContextLost = (e) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        isLost = true;
        if (typeof callbacks.onLost === 'function') {
          callbacks.onLost(e);
        }
      };

      const onContextRestored = (e) => {
        isLost = false;
        if (typeof callbacks.onRestored === 'function') {
          callbacks.onRestored(e);
        }
      };

      canvas.addEventListener('webglcontextlost', onContextLost, false);
      canvas.addEventListener('webglcontextrestored', onContextRestored, false);

      return {
        detach: () => {
          canvas.removeEventListener('webglcontextlost', onContextLost, false);
          canvas.removeEventListener('webglcontextrestored', onContextRestored, false);
        },
        isLost: () => isLost,
      };
    }

    simulateContextLost(canvas) {
      if (!canvas || typeof canvas.dispatchEvent !== 'function') return false;
      let prevented = false;
      const evt = {
        type: 'webglcontextlost',
        cancelable: true,
        defaultPrevented: false,
        preventDefault: () => {
          prevented = true;
        },
      };
      if (typeof Event !== 'undefined') {
        try {
          const customEvt = new Event('webglcontextlost', { cancelable: true });
          canvas.dispatchEvent(customEvt);
          return customEvt.defaultPrevented;
        } catch {
          // Fallback
        }
      }
      canvas.dispatchEvent(evt);
      return prevented || evt.defaultPrevented;
    }

    simulateContextRestored(canvas) {
      if (!canvas || typeof canvas.dispatchEvent !== 'function') return false;
      if (typeof Event !== 'undefined') {
        try {
          const customEvt = new Event('webglcontextrestored');
          return canvas.dispatchEvent(customEvt);
        } catch {
          // Fallback
        }
      }
      return canvas.dispatchEvent({ type: 'webglcontextrestored' });
    }

    getEffectiveUiFps() {
      if (this.watchdog.isHidden()) {
        return this.hiddenFps;
      }
      if (this.watchdog.isSleeping()) {
        return this.sleepFps;
      }
      if (this.watchdog.isBlurred()) {
        return Math.min(this.watchdog.blurFps, this.uiTargetFps);
      }
      return this.uiTargetFps || 60;
    }

    getEffectiveCanvasFps() {
      if (this.watchdog.isHidden()) {
        return this.hiddenFps;
      }
      if (this.watchdog.isSleeping()) {
        return this.sleepFps;
      }
      if (this.watchdog.isBlurred()) {
        return Math.min(this.watchdog.blurFps, this.canvasTargetFps);
      }
      const tier = this.watchdog.getTier();
      switch (tier) {
        case BATTERY_TIERS.CRITICAL:
          return this.criticalCanvasTargetFps;
        case BATTERY_TIERS.ECO:
          return this.ecoCanvasTargetFps;
        case BATTERY_TIERS.HIGH:
        default:
          return this.canvasTargetFps || this.highCanvasTargetFps;
      }
    }

    step(now = Date.now()) {
      if (this._lastTime === 0) {
        this._lastTime = now;
        this._lastUiTime = now;
        this._lastCanvasTime = now;
        this._fpsWindowStart = now;
        return { renderedUi: false, renderedCanvas: false };
      }

      const deltaTotal = now - this._lastTime;
      this._lastTime = now;
      this.metrics.lastStepTime = now;

      const targetUiFps = this.getEffectiveUiFps();
      let renderedUi = false;

      if (targetUiFps > 0) {
        const uiInterval = 1000 / targetUiFps;
        const uiElapsed = now - this._lastUiTime;

        if (uiElapsed >= uiInterval - 2) {
          this._lastUiTime = now;
          this.metrics.uiFrames++;
          this._fpsUiCount++;
          renderedUi = true;

          for (const [id, renderFn] of this.uiRenderers) {
            try {
              renderFn(now, uiElapsed);
            } catch (err) {
              console.error(`[EcoGraphicArbiter] Error in UI renderer '${id}':`, err);
            }
          }
        }
      }

      const targetCanvasFps = this.getEffectiveCanvasFps();
      let renderedCanvas = false;

      if (targetCanvasFps <= 0) {
        this.metrics.skippedCanvasFrames++;
      } else {
        const canvasInterval = 1000 / targetCanvasFps;
        const canvasElapsed = now - this._lastCanvasTime;

        if (canvasElapsed >= canvasInterval - 2) {
          this._lastCanvasTime = now;
          this.metrics.canvasFrames++;
          this._fpsCanvasCount++;
          renderedCanvas = true;

          for (const [id, entry] of this.canvasRenderers) {
            if (entry.isContextLost) {
              continue;
            }
            try {
              entry.renderFn(now, canvasElapsed);
            } catch (err) {
              console.error(`[EcoGraphicArbiter] Error in Canvas renderer '${id}':`, err);
            }
          }
        } else {
          this.metrics.skippedCanvasFrames++;
        }
      }

      if (now - this._fpsWindowStart >= 1000) {
        const durationSec = (now - this._fpsWindowStart) / 1000;
        this.metrics.measuredUiFps = Math.round(this._fpsUiCount / durationSec);
        this.metrics.measuredCanvasFps = Math.round(this._fpsCanvasCount / durationSec);
        this._fpsWindowStart = now;
        this._fpsUiCount = 0;
        this._fpsCanvasCount = 0;
      }

      return { renderedUi, renderedCanvas };
    }

    _loop(now) {
      if (!this.isRunning) return;
      this.step(now || Date.now());

      if (!this.isRunning) return;

      if (this.watchdog.isSleeping()) {
        this._isLoopSleeping = true;
        this._rafId = null;
        return;
      }

      this._rafId = safeRequestAnimationFrame(this._boundStep);
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this._isLoopSleeping = false;
      this._lastTime = 0;
      this._lastUiTime = 0;
      this._lastCanvasTime = 0;
      this._rafId = safeRequestAnimationFrame(this._boundStep);
    }

    stop() {
      this.isRunning = false;
      this._isLoopSleeping = false;
      if (this._rafId !== null) {
        safeCancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    }

    getMetrics() {
      return { ...this.metrics };
    }

    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;

      this.stop();

      if (this.watchdog && typeof this.watchdog.removeEventListener === 'function') {
        this.watchdog.removeEventListener('wake', this._boundOnWatchdogWake);
        this.watchdog.removeEventListener('sleep', this._boundOnWatchdogSleep);
      }

      for (const [id, entry] of this.canvasRenderers) {
        if (entry.recoveryHandle) {
          entry.recoveryHandle.detach();
        }
      }

      this.uiRenderers.clear();
      this.canvasRenderers.clear();

      if (this._ownsWatchdog && this.watchdog) {
        this.watchdog.destroy();
      }
    }
  }

  function initBatteryWatchdog(options = {}) {
    return new AdaptiveBatteryWatchdog(options);
  }

  function initGraphicArbiter(options = {}) {
    return new EcoGraphicArbiter(options);
  }

  const BatteryWatchdog = {
    version: '2.0.0',
    BATTERY_TIERS,
    DISPLAY_STATES,
    AdaptiveBatteryWatchdog,
    EcoGraphicArbiter,
    initBatteryWatchdog,
    initGraphicArbiter,
  };

  if (isBrowser()) {
    window.BatteryWatchdog = BatteryWatchdog;
    window.AdaptiveBatteryWatchdog = AdaptiveBatteryWatchdog;
    window.EcoGraphicArbiter = EcoGraphicArbiter;
    window.BATTERY_TIERS = BATTERY_TIERS;
    window.DISPLAY_STATES = DISPLAY_STATES;
    window.initBatteryWatchdog = initBatteryWatchdog;
    window.initGraphicArbiter = initGraphicArbiter;
  }

  return BatteryWatchdog;
});
