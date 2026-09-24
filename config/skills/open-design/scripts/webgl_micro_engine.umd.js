/**
 * ⚡ WEBGL MICRO-ENGINE (UMD / Standalone Global Bundle)
 * ======================================================
 * Universal standalone UMD/Global build of WebGLMicroEngine for direct <script src="..."> tags,
 * legacy browser scripts, CommonJS require, Electron, and local HTML environments.
 *
 * Core Modules:
 *  - initLiquidWaves(target, options)
 *  - initParticleMesh(target, options)
 *  - initTitaniumGrid(target, options)
 *  - FrameBudgetWatchdog
 *  - WebGLMicroEngine.initAll(options)
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.WebGLMicroEngine = exports;
    global.initLiquidWaves = exports.initLiquidWaves;
    global.initParticleMesh = exports.initParticleMesh;
    global.initTitaniumGrid = exports.initTitaniumGrid;
    global.FrameBudgetWatchdog = exports.FrameBudgetWatchdog;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function computeLuminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function prefersReducedMotion() {
    if (!isBrowser() || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  function isTestMode() {
    if (!isBrowser() || !window.location) return false;
    try {
      const search = window.location.search || '';
      return /[?&]test-mode=(1|true)/i.test(search);
    } catch {
      return false;
    }
  }

  function resolveCanvas(target) {
    if (!target) return null;
    if (typeof target === 'object' && typeof target.getContext === 'function') {
      return target;
    }
    if (!isBrowser()) return null;
    if (typeof target === 'string') {
      try {
        return document.querySelector(target);
      } catch {
        return null;
      }
    }
    if (typeof Element !== 'undefined' && target instanceof Element) {
      return target;
    }
    if (typeof HTMLCanvasElement !== 'undefined' && target instanceof HTMLCanvasElement) {
      return target;
    }
    return null;
  }

  const safeRequestAnimationFrame = (cb) => {
    if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame(cb);
    return null;
  };

  const safeCancelAnimationFrame = (id) => {
    if (id && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(id);
  };

  class FrameBudgetWatchdog {
    constructor(options = {}) {
      this.targetFps = options.targetFps || 60;
      this.targetFrameTime = 1000 / this.targetFps;
      this.budgetCeiling = options.budgetCeiling || 20.0;
      this.maxDpr = options.maxDpr || (isBrowser() ? Math.min(window.devicePixelRatio || 1, 2) : 2);
      this.minDpr = options.minDpr || 0.75;
      this.currentDpr = this.maxDpr;

      const steps = [2.0, 1.5, 1.0, 0.75].filter((v) => v <= this.maxDpr && v >= this.minDpr);
      if (!steps.includes(this.currentDpr)) steps.unshift(this.currentDpr);
      this.dprSteps = Array.from(new Set(steps)).sort((a, b) => b - a);

      this.history = [];
      this.historySize = options.historySize || 30;
      this.slowFrameStreak = 0;
      this.streakThreshold = options.streakThreshold || 10;
      this.cooldownFrames = 0;
      this.onDprChange = options.onDprChange || null;
      this.lastTimestamp = 0;
    }

    recordFrame(now) {
      const timestamp = (typeof now === 'number' && !isNaN(now) && now > 0)
        ? now
        : (isBrowser() && window.performance ? performance.now() : Date.now());

      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
        return;
      }
      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;

      if (delta > 250) {
        return;
      }

      this.history.push(delta);
      if (this.history.length > this.historySize) {
        this.history.shift();
      }

      if (this.cooldownFrames > 0) {
        this.cooldownFrames--;
        return;
      }

      if (delta > this.budgetCeiling) {
        this.slowFrameStreak++;
      } else {
        this.slowFrameStreak = Math.max(0, this.slowFrameStreak - 1);
      }

      const avg = this.history.reduce((sum, d) => sum + d, 0) / this.history.length;
      if ((avg > this.budgetCeiling && this.history.length >= 15) || this.slowFrameStreak >= this.streakThreshold) {
        this.stepDown();
      }
    }

    stepDown() {
      const currIdx = this.dprSteps.indexOf(this.currentDpr);
      if (currIdx !== -1 && currIdx < this.dprSteps.length - 1) {
        const nextDpr = this.dprSteps[currIdx + 1];
        if (nextDpr !== this.currentDpr) {
          this.currentDpr = nextDpr;
          this.cooldownFrames = 120;
          this.slowFrameStreak = 0;
          this.history = [];
          if (typeof this.onDprChange === 'function') {
            this.onDprChange(this.currentDpr);
          }
        }
      }
    }

    getDpr() {
      return this.currentDpr;
    }

    getStats() {
      const avg = this.history.length > 0
        ? this.history.reduce((a, b) => a + b, 0) / this.history.length
        : 16.66;
      return {
        fps: Math.round(1000 / (avg || 16.66)),
        avgFrameTime: Number(avg.toFixed(2)),
        currentDpr: this.currentDpr,
        streak: this.slowFrameStreak,
      };
    }

    reset() {
      this.history = [];
      this.slowFrameStreak = 0;
      this.cooldownFrames = 0;
      this.lastTimestamp = 0;
    }
  }

  const SHADERS = {
    QUAD_VS: `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`,

    LIQUID_WAVES_FS: `precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_base;
uniform float u_speed;
uniform float u_intensity;

vec3 iridescent(float t) {
  return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.00, 0.33, 0.67)));
}

void main() {
  vec2 st = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);
  vec2 m = (u_mouse * 2.0 - u_res) / min(u_res.x, u_res.y);

  float mDist = length(st - m);
  float mRipple = sin(mDist * 10.0 - u_time * 2.4) * exp(-mDist * 2.2) * 0.12;

  float t = u_time * (u_speed > 0.0 ? u_speed : 0.22);
  vec2 p = st * 1.5;

  float w1 = sin(p.x * 2.2 + t + mRipple) + cos(p.y * 1.8 - t * 0.7);
  float w2 = sin(p.x * 1.3 - p.y * 1.7 + t * 0.5 + w1 * 0.45);
  float w3 = cos(length(p + vec2(w2, w1) * 0.32) * 2.6 - t * 0.85);
  float wave = (w1 + w2 + w3) * 0.3333;

  float phase = wave * 0.5 + 0.5 + mRipple * 0.4;
  vec3 irid = iridescent(phase);

  float sheen = pow(max(wave * 0.5 + 0.5, 0.0), 4.0) * 0.28;

  float intensity = (u_intensity > 0.0 ? u_intensity : 1.0);
  vec3 col = u_base + (irid - 0.5) * (0.24 * intensity) + vec3(sheen * 0.30 * intensity);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,

    TITANIUM_GRID_FS: `#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_base;
uniform float u_speed;
uniform float u_intensity;

void main() {
  vec2 st = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);

  vec3 ro = vec3(0.0, 1.25, 0.0);
  vec3 rd = normalize(vec3(st.x, st.y - 0.12, 1.2));

  if (rd.y >= -0.005) {
    gl_FragColor = vec4(u_base, 1.0);
    return;
  }

  float t = -ro.y / rd.y;
  vec3 pos = ro + rd * t;

  float speed = (u_speed > 0.0 ? u_speed : 0.45);
  vec2 uv = vec2(pos.x, pos.z - u_time * speed);

  vec2 normMouse = u_mouse / u_res;
  vec3 lightPos = vec3((normMouse.x - 0.5) * 10.0, 2.8, pos.z + (normMouse.y - 0.5) * 5.0);
  vec3 N = vec3(0.0, 1.0, 0.0);
  vec3 L = normalize(lightPos - pos);
  vec3 V = -rd;
  vec3 H = normalize(L + V);
  float NdotH = max(dot(N, H), 0.0);
  float specular = pow(NdotH, 48.0) * 0.85;

  vec2 gridUV = uv * 1.4;
  vec2 grid = abs(fract(gridUV - 0.5) - 0.5);
  float lineWidth = 0.038;
  float lineAlpha = 0.0;

  #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
    vec2 fw = fwidth(gridUV);
    vec2 aa = 1.0 - smoothstep(lineWidth - fw, lineWidth + fw, grid);
    lineAlpha = max(aa.x, aa.y);
  #else
    vec2 fallLine = step(grid, vec2(lineWidth));
    lineAlpha = max(fallLine.x, fallLine.y);
  #endif

  float fog = exp(-t * 0.048);
  lineAlpha *= fog;

  vec3 titaniumColor = vec3(0.58, 0.64, 0.72);
  vec3 specHighlight = vec3(0.96, 0.98, 1.0) * specular * fog;

  float intensity = (u_intensity > 0.0 ? u_intensity : 1.0);
  vec3 col = mix(u_base, titaniumColor, lineAlpha * 0.65 * intensity) + specHighlight * intensity;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,
  };

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    return { program, vs, fs };
  }

  function createQuadShaderEngine(target, fsSource, defaults, options = {}) {
    const canvas = resolveCanvas(target);
    if (!canvas) {
      return {
        destroy: () => {},
        pause: () => {},
        resume: () => {},
        renderFrame: () => {},
        getWatchdog: () => null,
        resize: () => {},
      };
    }

    const baseRgb = options.baseColor || defaults.baseColor;
    const speed = options.speed !== undefined ? options.speed : defaults.speed;
    const intensity = options.intensity !== undefined ? options.intensity : defaults.intensity;

    let gl = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch {
      gl = null;
    }

    if (!gl) {
      return {
        destroy: () => {},
        pause: () => {},
        resume: () => {},
        renderFrame: () => {},
        getWatchdog: () => null,
        resize: () => {},
      };
    }

    if (defaults.requiresDerivatives && typeof gl.getExtension === 'function') {
      gl.getExtension('OES_standard_derivatives');
    }

    const progInfo = createProgram(gl, SHADERS.QUAD_VS, fsSource);
    if (!progInfo) {
      return {
        destroy: () => {},
        pause: () => {},
        resume: () => {},
        renderFrame: () => {},
        getWatchdog: () => null,
        resize: () => {},
      };
    }

    const { program, vs, fs } = progInfo;

    const posAttr = gl.getAttribLocation(program, 'a_pos');
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uBase = gl.getUniformLocation(program, 'u_base');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');

    const watchdog = new FrameBudgetWatchdog({
      maxDpr: options.maxDpr,
      minDpr: options.minDpr,
      onDprChange: () => resize(),
    });

    let rafId = null;
    let isRunning = false;
    let isPaused = false;
    let isAutoPaused = false;
    let isManuallyPaused = false;
    const isMotionReduced = prefersReducedMotion() || isTestMode();
    let startTime = (isBrowser() && window.performance) ? performance.now() : 0;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let observer = null;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = watchdog.getDpr();
      const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width: canvas.width || 800, height: canvas.height || 600 };
      const w = Math.max(1, Math.round((rect.width || canvas.width || 800) * dpr));
      const h = Math.max(1, Math.round((rect.height || canvas.height || 600) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    }

    function onPointerMove(e) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = watchdog.getDpr();
      mouse.targetX = (e.clientX - rect.left) * dpr;
      mouse.targetY = (rect.height - (e.clientY - rect.top)) * dpr;
    }

    function renderFrame(timeMs) {
      if (!gl || !program) return;
      const elapsed = timeMs !== undefined
        ? timeMs * 0.001
        : (((isBrowser() && window.performance) ? performance.now() : 0) - startTime) * 0.001;

      mouse.x = lerp(mouse.x, mouse.targetX, 0.08);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.08);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform3f(uBase, baseRgb[0], baseRgb[1], baseRgb[2]);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uIntensity, intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function loop(now) {
      if (!isRunning || isPaused || isManuallyPaused) return;
      watchdog.recordFrame(now);
      renderFrame();
      rafId = safeRequestAnimationFrame(loop);
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      isPaused = false;
      resize();
      mouse.targetX = canvas.width * 0.5;
      mouse.targetY = canvas.height * 0.5;
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;

      if (isMotionReduced) {
        renderFrame(0);
        return;
      }

      rafId = safeRequestAnimationFrame(loop);
    }

    function pause() {
      isManuallyPaused = true;
      isPaused = true;
      if (rafId) {
        safeCancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function resume() {
      isManuallyPaused = false;
      if (isMotionReduced) return;
      if (!isRunning || !isPaused) return;
      isPaused = false;
      isAutoPaused = false;
      watchdog.lastTimestamp = isBrowser() && window.performance ? performance.now() : 0;
      rafId = safeRequestAnimationFrame(loop);
    }

    function destroy() {
      isManuallyPaused = true;
      isPaused = true;
      isRunning = false;
      if (rafId) {
        safeCancelAnimationFrame(rafId);
        rafId = null;
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (isBrowser()) {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', onPointerMove);
      }
      if (gl) {
        if (quadBuffer) gl.deleteBuffer(quadBuffer);
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      }
    }

    if (isBrowser()) {
      window.addEventListener('resize', resize, { passive: true });
      canvas.addEventListener('pointermove', onPointerMove, { passive: true });

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === canvas) {
              if (entry.isIntersecting) {
                if (isAutoPaused && !isManuallyPaused && !isMotionReduced) {
                  isAutoPaused = false;
                  isPaused = false;
                  watchdog.lastTimestamp = window.performance ? performance.now() : 0;
                  rafId = safeRequestAnimationFrame(loop);
                }
              } else {
                if (isRunning && !isPaused && !isManuallyPaused && !isMotionReduced) {
                  isAutoPaused = true;
                  isPaused = true;
                  if (rafId) {
                    safeCancelAnimationFrame(rafId);
                    rafId = null;
                  }
                }
              }
            }
          }
        }, { threshold: 0.05 });
        observer.observe(canvas);
      }
    }

    start();

    return {
      destroy,
      pause,
      resume,
      renderFrame,
      getWatchdog: () => watchdog,
      resize,
    };
  }

  function initLiquidWaves(target, options = {}) {
    return createQuadShaderEngine(target, SHADERS.LIQUID_WAVES_FS, {
      baseColor: [0.980, 0.976, 0.965],
      speed: 0.22,
      intensity: 1.0,
    }, options);
  }

  function initTitaniumGrid(target, options = {}) {
    return createQuadShaderEngine(target, SHADERS.TITANIUM_GRID_FS, {
      baseColor: [0.976, 0.980, 0.984],
      speed: 0.45,
      intensity: 1.0,
      requiresDerivatives: true,
    }, options);
  }

  function initParticleMesh(target, options = {}) {
    const canvas = resolveCanvas(target);
    if (!canvas) {
      return {
        destroy: () => {},
        pause: () => {},
        resume: () => {},
        renderFrame: () => {},
        getWatchdog: () => null,
        getLastStrokeCount: () => 0,
        getParticles: () => [],
        getBuckets: () => [[], [], [], []],
        setMousePosition: () => {},
        resize: () => {},
      };
    }

    let ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }

    if (!ctx) {
      return {
        destroy: () => {},
        pause: () => {},
        resume: () => {},
        renderFrame: () => {},
        getWatchdog: () => null,
        getLastStrokeCount: () => 0,
        getParticles: () => [],
        getBuckets: () => [[], [], [], []],
        setMousePosition: () => {},
        resize: () => {},
      };
    }

    const particleCount = options.particleCount || 55;
    const maxDistance = options.maxDistance || 130;
    const mouseRadius = options.mouseRadius || 145;
    const baseColor = options.baseColor || [30, 41, 59];
    const speed = options.speed || 0.45;
    const quantizedAlphas = options.quantizedAlphas || [0.08, 0.18, 0.32, 0.50];

    const watchdog = new FrameBudgetWatchdog({
      maxDpr: options.maxDpr,
      minDpr: options.minDpr,
      onDprChange: () => resize(),
    });

    const particles = [];
    const buckets = [[], [], [], []];
    let lastStrokeCount = 0;
    let rafId = null;
    let isRunning = false;
    let isPaused = false;
    let isAutoPaused = false;
    let isManuallyPaused = false;
    const isMotionReduced = prefersReducedMotion() || isTestMode();
    const mouse = { x: -9999, y: -9999, active: false };
    let observer = null;

    function initParticles() {
      particles.length = 0;
      const w = canvas.width || 800;
      const h = canvas.height || 600;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed * 1.5,
          vy: (Math.random() - 0.5) * speed * 1.5,
          radius: 1.5 + Math.random() * 1.5,
          alpha: 0.4 + Math.random() * 0.45,
        });
      }
    }

    // Pre-seed particles immediately
    initParticles();

    function resize() {
      if (!canvas) return;
      const dpr = watchdog.getDpr();
      const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width: canvas.width || 800, height: canvas.height || 600 };
      const w = Math.max(1, Math.round((rect.width || canvas.width || 800) * dpr));
      const h = Math.max(1, Math.round((rect.height || canvas.height || 600) * dpr));
      const oldW = canvas.width || w;
      const oldH = canvas.height || h;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (particles.length === 0) {
          initParticles();
        } else {
          const sx = w / oldW;
          const sy = h / oldH;
          for (let i = 0; i < particles.length; i++) {
            particles[i].x *= sx;
            particles[i].y *= sy;
          }
        }
      } else if (particles.length === 0) {
        initParticles();
      }
    }


    function update() {
      const w = canvas.width;
      const h = canvas.height;
      const mActive = mouse.active;
      const mx = mouse.x;
      const my = mouse.y;
      const effectiveMouseRadius = mouseRadius * watchdog.getDpr();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < effectiveMouseRadius && dist > 0.001) {
            const force = (1.0 - dist / effectiveMouseRadius) * 2.2;
            p.vx += (dx / dist) * force * 0.25;
            p.vy += (dy / dist) * force * 0.25;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;

        if (Math.hypot(p.vx, p.vy) < 0.12) {
          p.vx += (Math.random() - 0.5) * 0.08;
          p.vy += (Math.random() - 0.5) * 0.08;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > h) { p.y = h; p.vy *= -1; }
      }
    }

    function draw() {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      buckets[0].length = 0;
      buckets[1].length = 0;
      buckets[2].length = 0;
      buckets[3].length = 0;

      const count = particles.length;
      const maxDist = maxDistance * watchdog.getDpr();
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const ratio = dist / maxDist;
            const tier = Math.min(3, Math.max(0, Math.floor((1.0 - ratio) * 4)));
            buckets[tier].push(p1.x, p1.y, p2.x, p2.y);
          }
        }
      }

      const [cr, cg, cb] = baseColor;
      let strokes = 0;
      ctx.lineWidth = Math.max(1, Math.round(watchdog.getDpr() * 0.8));

      for (let t = 0; t < 4; t++) {
        const coords = buckets[t];
        if (coords.length === 0) continue;
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${quantizedAlphas[t]})`;
        ctx.beginPath();
        const len = coords.length;
        for (let k = 0; k < len; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.stroke();
        strokes++;
      }
      lastStrokeCount = strokes;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * watchdog.getDpr(), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function renderFrame() {
      update();
      draw();
    }

    function loop(now) {
      if (!isRunning || isPaused || isManuallyPaused) return;
      watchdog.recordFrame(now);
      renderFrame();
      rafId = safeRequestAnimationFrame(loop);
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      isPaused = false;
      resize();

      if (isMotionReduced) {
        draw();
        return;
      }

      rafId = safeRequestAnimationFrame(loop);
    }

    function pause() {
      isManuallyPaused = true;
      isPaused = true;
      if (rafId) {
        safeCancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function resume() {
      isManuallyPaused = false;
      if (isMotionReduced) return;
      if (!isRunning || !isPaused) return;
      isPaused = false;
      isAutoPaused = false;
      watchdog.lastTimestamp = isBrowser() && window.performance ? performance.now() : 0;
      rafId = safeRequestAnimationFrame(loop);
    }

    function onPointerMove(e) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = watchdog.getDpr();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
      mouse.active = true;
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function destroy() {
      isManuallyPaused = true;
      isPaused = true;
      isRunning = false;
      if (rafId) {
        safeCancelAnimationFrame(rafId);
        rafId = null;
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (isBrowser()) {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
      }
      particles.length = 0;
      buckets[0].length = 0;
      buckets[1].length = 0;
      buckets[2].length = 0;
      buckets[3].length = 0;
    }

    if (isBrowser()) {
      window.addEventListener('resize', resize, { passive: true });
      canvas.addEventListener('pointermove', onPointerMove, { passive: true });
      canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === canvas) {
              if (entry.isIntersecting) {
                if (isAutoPaused && !isManuallyPaused && !isMotionReduced) {
                  isAutoPaused = false;
                  isPaused = false;
                  watchdog.lastTimestamp = window.performance ? performance.now() : 0;
                  rafId = safeRequestAnimationFrame(loop);
                }
              } else {
                if (isRunning && !isPaused && !isManuallyPaused && !isMotionReduced) {
                  isAutoPaused = true;
                  isPaused = true;
                  if (rafId) {
                    safeCancelAnimationFrame(rafId);
                    rafId = null;
                  }
                }
              }
            }
          }
        }, { threshold: 0.05 });
        observer.observe(canvas);
      }
    }

    start();

    return {
      destroy,
      pause,
      resume,
      renderFrame,
      getWatchdog: () => watchdog,
      getLastStrokeCount: () => lastStrokeCount,
      getParticles: () => particles,
      getBuckets: () => buckets,
      setMousePosition: (x, y, active = true) => {
        mouse.x = x;
        mouse.y = y;
        mouse.active = active;
      },
      resize,
    };
  }

  const WebGLMicroEngine = {
    version: '2.0.0',
    init(target, options = {}) {
      const mode = options.mode || 'liquid-waves';
      if (mode === 'particle-mesh') {
        return initParticleMesh(target, options);
      }
      if (mode === 'titanium-grid') {
        return initTitaniumGrid(target, options);
      }
      return initLiquidWaves(target, options);
    },
    initLiquidWaves,
    initParticleMesh,
    initTitaniumGrid,
    FrameBudgetWatchdog,
    SHADERS,

    initAll(options = {}) {
      if (!isBrowser()) return { destroy: () => {} };
      const elements = document.querySelectorAll('[data-micro-engine]');
      const instances = [];

      elements.forEach((el) => {
        const mode = el.getAttribute('data-micro-engine');
        const inst = WebGLMicroEngine.init(el, Object.assign({}, options, { mode }));
        if (inst) instances.push(inst);
      });

      return {
        destroy: () => instances.forEach((inst) => inst.destroy()),
      };
    },
  };

  return WebGLMicroEngine;
});
