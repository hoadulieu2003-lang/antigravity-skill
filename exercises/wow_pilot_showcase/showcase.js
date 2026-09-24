/**
 * ============================================================================
 * ANTIGRAVITY 2.0 // SHOWCASE V2 INTERACTIVE DESIGN SYSTEM HUB ENGINE
 * ============================================================================
 * File: exercises/wow_pilot_showcase/showcase.js
 * Modules:
 *   1. 3D WebGL Micro-Engine (Iridescent Waves, Particle Mesh, Titanium Grid)
 *   2. WebAudioHaptics v2.0 (10 Native Tactile Physical Waveforms & Spatial Panner)
 *   3. Stepped Rotary Dial Controller (High-density detent micro ticks)
 *   4. Two-Stage Mechanical Switch & Spatial Stereo Panner Controller
 *   5. Mechanical Stepped Odometer (Audible Detent Increment Reels)
 *   6. Spring Physics Toast Notification Engine (cubic-bezier 0.22, 1.61, 0.36, 1)
 *   7. Live Delight Inspector HUD (Real-time 60 FPS, Tactile Depth, WCAG AAA)
 * ============================================================================
 */

(function (window, document) {
  'use strict';

  // ==========================================================================
  // TAPTIC ENGINE TRIGGER & VISUAL PULSE
  // ==========================================================================
  function triggerTaptic(type) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        switch (type) {
          case 'click':
          case 'detent':
            navigator.vibrate(10);
            break;
          case 'pop':
          case 'switch':
            navigator.vibrate(20);
            break;
          case 'chime':
            navigator.vibrate([15, 30, 20]);
            break;
          case 'spring':
            navigator.vibrate([10, 15, 10, 15]);
            break;
          case 'thud':
            navigator.vibrate(35);
            break;
          case 'rotary':
            navigator.vibrate(8);
            break;
          default:
            navigator.vibrate(15);
        }
      } catch (_) {}
    }
    const tapticDot = document.getElementById('hudTapticDot');
    if (tapticDot) {
      tapticDot.classList.add('pulsing');
      setTimeout(() => tapticDot.classList.remove('pulsing'), 200);
    }
  }

  // ==========================================================================
  // 1. WEBAUDIOHAPTICS V2.0 (10 NATIVE TACTILE WAVEFORMS)
  // ==========================================================================
  class WebAudioHapticsV2 {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.listeners = new Set();
      this.onAudioTrigger = null;
      this.hasInteracted = false;
      this._initAutoplayUnlock();
    }

    _initAutoplayUnlock() {
      const unlock = () => {
        if (!this.hasInteracted) {
          this.hasInteracted = true;
          this.getContext();
        }
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    }

    getContext() {
      if (this.isMuted) return null;
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.ctx = new AudioCtx();
          } catch (e) {
            console.warn('[WebAudioHapticsV2] AudioContext error:', e);
          }
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    notify(type, meta = {}) {
      if (typeof this.onAudioTrigger === 'function') {
        try {
          this.onAudioTrigger(type, meta);
        } catch (_) {}
      }
      triggerTaptic(type);
    }

    getMuted() {
      return this.isMuted;
    }

    setMuted(muted) {
      this.isMuted = !!muted;
      this.listeners.forEach((cb) => cb(this.isMuted));
      return this.isMuted;
    }

    toggleMute(playFeedback = false) {
      this.setMuted(!this.isMuted);
      if (!this.isMuted && playFeedback) {
        this.playPop();
      }
      return this.isMuted;
    }

    // 1. Mechanical Click
    playClick() {
      this.notify('click');
      if (this.isMuted) return;
      const ctx = this.getContext();
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
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.022);
      } catch (_) {}
    }

    // 2. Soft Tactile Pop
    playPop() {
      this.notify('pop');
      if (this.isMuted) return;
      const ctx = this.getContext();
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
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    }

    // 3. Switch Clack
    playSwitch(state = true) {
      this.notify('switch', { state });
      if (this.isMuted) return;
      const ctx = this.getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const baseFreq = state ? 840 : 620;
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

    // 4. Harmonic Success Chord / Chime
    playChime() {
      this.notify('chime');
      if (this.isMuted) return;
      const ctx = this.getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
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

    // 5. Detent Micro Tick
    playDetent() {
      this.notify('detent');
      if (this.isMuted) return;
      const ctx = this.getContext();
      if (!ctx) return;
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

    // 6. Stepped Rotary Detent Tick
    playRotary(step = 1, direction = 1) {
      this.notify('rotary', { step, direction });
      if (this.isMuted) return;
      const ctx = this.getContext();
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
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.012);
      } catch (_) {}
    }

    // 7. Spring Release
    playSpring() {
      this.notify('spring');
      if (this.isMuted) return;
      const ctx = this.getContext();
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
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (_) {}
    }

    // 8. Spatial Stereo Panning
    playSpatial(pan = -0.85) {
      this.notify('spatial', { pan });
      if (this.isMuted) return;
      const ctx = this.getContext();
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

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(pan, now);
          osc.connect(gain);
          gain.connect(panner);
          panner.connect(ctx.destination);
        } else {
          osc.connect(gain);
          gain.connect(ctx.destination);
        }
        osc.start(now);
        osc.stop(now + 0.07);
      } catch (_) {}
    }

    // 9. Mechanical Bottom-Out Thud
    playThud() {
      this.notify('thud');
      if (this.isMuted) return;
      const ctx = this.getContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.045);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } catch (_) {}
    }

    // 10. Two-Stage Shutter Click
    playDoubleStage(stage = 1) {
      this.notify('doublestage', { stage });
      if (this.isMuted) return;
      const ctx = this.getContext();
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
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } catch (_) {}
    }
  }

  const hapticsV2 = new WebAudioHapticsV2();

  // ==========================================================================
  // 2. 3D WEBGL MICRO-ENGINE (HERO BACKGROUND WITH 3 MODES)
  // ==========================================================================
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
    TITANIUM_GRID_FS: `precision highp float;
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
  float lineAlpha = step(grid.x, lineWidth) + step(grid.y, lineWidth);
  lineAlpha = clamp(lineAlpha, 0.0, 1.0);

  float fog = exp(-t * 0.048);
  lineAlpha *= fog;

  vec3 titaniumColor = vec3(0.58, 0.64, 0.72);
  vec3 specHighlight = vec3(0.96, 0.98, 1.0) * specular * fog;

  float intensity = (u_intensity > 0.0 ? u_intensity : 1.0);
  vec3 col = mix(u_base, titaniumColor, lineAlpha * 0.65 * intensity) + specHighlight * intensity;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`
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

  class WebGLMicroEngine {
    constructor(canvasId) {
      this.canvasId = canvasId;
      this.canvas = document.getElementById(canvasId);
      this.gl = null;
      this.ctx2d = null;
      this.currentContextType = null; // 'webgl' | '2d'
      this.mode = 'waves'; // 'waves' | 'particles' | 'grid'
      this.targetMode = 'waves';
      this.animId = null;
      this.startTime = performance.now();
      this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      this.particles = [];
      this.isTestMode = false;
      this.programs = {};
      this.quadBuffer = null;

      if (this.canvas) {
        this.init();
      }
    }

    init() {
      this._initParticles();
      this._initContextForMode(this.mode);
      this._bindEvents();
      this.resize();
      this.start();
    }

    _initContextForMode(mode) {
      const needsWebGL = mode === 'waves' || mode === 'grid';
      if (needsWebGL) {
        // If current context was 2d, replace canvas element to clear context exclusivity
        if (this.currentContextType === '2d' && this.canvas && this.canvas.parentElement) {
          const fresh = document.createElement('canvas');
          fresh.id = this.canvasId;
          fresh.className = this.canvas.className;
          this.canvas.replaceWith(fresh);
          this.canvas = fresh;
        }

        if (!this.gl && this.canvas) {
          try {
            this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: true }) ||
                      this.canvas.getContext('experimental-webgl', { alpha: true });
          } catch (_) {
            this.gl = null;
          }
        }

        if (this.gl) {
          this.currentContextType = 'webgl';
          this.ctx2d = null;
          if (!this.quadBuffer) {
            this.quadBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), this.gl.STATIC_DRAW);
          }
          if (!this.programs.waves) {
            this.programs.waves = createProgram(this.gl, SHADERS.QUAD_VS, SHADERS.LIQUID_WAVES_FS);
          }
          if (!this.programs.grid) {
            this.programs.grid = createProgram(this.gl, SHADERS.QUAD_VS, SHADERS.TITANIUM_GRID_FS);
          }
        } else {
          // WebGL disabled/unavailable (e.g. headless --disable-gpu) -> fallback to 2D
          this.currentContextType = '2d';
          this.ctx2d = this.canvas ? this.canvas.getContext('2d') : null;
        }
      } else {
        // Mode is particles -> runs on 2D context
        if (this.currentContextType === 'webgl' && this.canvas && this.canvas.parentElement) {
          const fresh = document.createElement('canvas');
          fresh.id = this.canvasId;
          fresh.className = this.canvas.className;
          this.canvas.replaceWith(fresh);
          this.canvas = fresh;
        }
        this.currentContextType = '2d';
        this.ctx2d = this.canvas ? this.canvas.getContext('2d') : null;
        this.gl = null;
        this.quadBuffer = null;
        this.programs = {};
      }
    }

    _initParticles() {
      this.particles = [];
      const count = 75;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random(),
          y: Math.random(),
          z: Math.random() * 0.8 + 0.2,
          vx: (Math.random() - 0.5) * 0.0006,
          vy: (Math.random() - 0.5) * 0.0006,
          radius: Math.random() * 2.5 + 1.2,
        });
      }
    }

    _bindEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });
      window.addEventListener('mousemove', (e) => {
        if (this.isTestMode) return;
        this.mouse.targetX = e.clientX / window.innerWidth;
        this.mouse.targetY = e.clientY / window.innerHeight;
      }, { passive: true });

      // Mode change listeners from parent
      window.addEventListener('wow:modechange', (e) => {
        this.isTestMode = !!e.detail?.isTestMode;
      });
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: 600 };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor((rect.height || 600) * dpr);
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }
      if (this.gl) {
        this.gl.viewport(0, 0, w, h);
      }
    }

    setMode(mode) {
      if (['waves', 'particles', 'grid'].includes(mode)) {
        this.mode = mode;
        this.targetMode = mode;
        this._initContextForMode(mode);
        this.resize();
      }
    }

    start() {
      const render = (time) => {
        this.animId = requestAnimationFrame(render);
        this.draw(time);
      };
      this.animId = requestAnimationFrame(render);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    draw(time) {
      if (!this.canvas) return;
      const elapsed = (time - this.startTime) * 0.001;

      // Mouse smoothing
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      const w = this.canvas.width;
      const h = this.canvas.height;
      if (w === 0 || h === 0) return;

      if (this.currentContextType === 'webgl' && this.gl) {
        this._renderWebGL(w, h, elapsed);
      } else if (this.ctx2d) {
        this._render2D(w, h, elapsed);
      }
    }

    _renderWebGL(w, h, elapsed) {
      const gl = this.gl;
      const progInfo = this.programs[this.mode];
      if (!gl || !progInfo || !progInfo.program) {
        // Fallback to 2D if program missing
        if (this.ctx2d) this._render2D(w, h, elapsed);
        return;
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(progInfo.program);

      const posAttr = gl.getAttribLocation(progInfo.program, 'a_pos');
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(progInfo.program, 'u_res');
      const uTime = gl.getUniformLocation(progInfo.program, 'u_time');
      const uMouse = gl.getUniformLocation(progInfo.program, 'u_mouse');
      const uBase = gl.getUniformLocation(progInfo.program, 'u_base');
      const uSpeed = gl.getUniformLocation(progInfo.program, 'u_speed');
      const uIntensity = gl.getUniformLocation(progInfo.program, 'u_intensity');

      if (uRes) gl.uniform2f(uRes, w, h);
      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uMouse) gl.uniform2f(uMouse, this.mouse.x * w, (1.0 - this.mouse.y) * h);
      if (uBase) gl.uniform3f(uBase, 0.973, 0.980, 0.988); // Luminous #F8FAFC
      if (uSpeed) gl.uniform1f(uSpeed, this.mode === 'waves' ? 0.22 : 0.45);
      if (uIntensity) gl.uniform1f(uIntensity, 1.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    _render2D(w, h, elapsed) {
      const ctx = this.ctx2d;
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (this.mode === 'waves') {
        this._renderWaves(ctx, w, h, elapsed);
      } else if (this.mode === 'particles') {
        this._renderParticles(ctx, w, h, elapsed);
      } else if (this.mode === 'grid') {
        this._renderTitaniumGrid(ctx, w, h, elapsed);
      }
    }

    _renderWaves(ctx, w, h, t) {
      const numLines = 7;
      const baseY = h * 0.58;

      for (let i = 0; i < numLines; i++) {
        const offset = i * 22;
        const alpha = 0.18 + (i / numLines) * 0.28;
        ctx.beginPath();
        ctx.lineWidth = 1.5 + (i * 0.35);

        // Gradient stroke
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(56, 189, 248, ${alpha * 0.4})`);
        grad.addColorStop(0.35, `rgba(2, 132, 199, ${alpha})`);
        grad.addColorStop(0.7, `rgba(99, 102, 241, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(168, 85, 247, ${alpha * 0.3})`);
        ctx.strokeStyle = grad;

        const speed = 1.2 + i * 0.25;
        const waveH = 34 + i * 8;

        for (let x = 0; x <= w; x += 18) {
          const nx = x / w;
          const mouseDist = Math.abs(nx - this.mouse.x);
          const mouseBump = Math.max(0, 1 - mouseDist * 3) * 25 * (1 - this.mouse.y);
          const y = baseY + Math.sin(nx * 5.2 + t * speed + i * 0.7) * waveH +
                    Math.cos(nx * 2.8 - t * 0.8) * 16 - mouseBump + offset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    _renderParticles(ctx, w, h, t) {
      const pts = this.particles;
      const mx = this.mouse.x * w;
      const my = this.mouse.y * h;

      // Update positions
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!this.isTestMode) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;
        }

        const px = p.x * w;
        const py = p.y * h;

        // Connect nearby particles
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = px - p2.x * w;
          const dy = py - p2.y * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.moveTo(px, py);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        }

        // Draw particle node
        const dMouse = Math.hypot(px - mx, py - my);
        const isHovered = dMouse < 100;
        ctx.beginPath();
        ctx.arc(px, py, isHovered ? p.radius * 1.8 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? 'rgba(2, 132, 199, 0.85)' : 'rgba(100, 116, 139, 0.45)';
        ctx.fill();
      }
    }

    _renderTitaniumGrid(ctx, w, h, t) {
      const horizon = h * 0.38;
      const step = 42;
      const scrollOffset = (t * 28) % step;

      ctx.save();
      // Draw receding perspective grid
      const numLines = 18;
      for (let i = -numLines; i <= numLines; i++) {
        const xBottom = w * 0.5 + i * 58 + (this.mouse.x - 0.5) * 80;
        const xTop = w * 0.5 + i * 14 + (this.mouse.x - 0.5) * 20;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
        ctx.moveTo(xTop, horizon);
        ctx.lineTo(xBottom, h);
        ctx.stroke();
      }

      // Horizontal rolling lines
      for (let y = horizon; y < h; y += step) {
        const curY = y + scrollOffset;
        if (curY > h) continue;
        const depthRatio = (curY - horizon) / (h - horizon);
        ctx.beginPath();
        ctx.lineWidth = 0.8 + depthRatio * 1.4;
        ctx.strokeStyle = `rgba(2, 132, 199, ${depthRatio * 0.35})`;
        ctx.moveTo(0, curY);
        ctx.lineTo(w, curY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ==========================================================================
  // 3. STEPPED ROTARY KNOB CONTROLLER
  // ==========================================================================
  class SteppedRotaryController {
    constructor(elementId, readoutId) {
      this.dial = document.getElementById(elementId);
      this.readout = document.getElementById(readoutId);
      this.currentAngle = 0;
      this.isDragging = false;
      this.lastStep = 0;
      this.stepSize = 15; // 15 degrees per detent notch

      if (this.dial) {
        this.init();
      }
    }

    init() {
      const onStart = (e) => {
        this.isDragging = true;
        this._updateFromPointer(e);
      };

      const onMove = (e) => {
        if (!this.isDragging) return;
        this._updateFromPointer(e);
      };

      const onEnd = () => {
        this.isDragging = false;
      };

      this.dial.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      this.dial.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);

      // Keyboard navigation for accessibility
      this.dial.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.setAngle(this.currentAngle + 15);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.setAngle(this.currentAngle - 15);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.setAngle(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.setAngle(345);
        }
      });

      // Wheel support
      this.dial.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 15 : -15;
        this.setAngle(this.currentAngle + delta);
      }, { passive: false });
    }

    _updateFromPointer(e) {
      const rect = this.dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rad = Math.atan2(clientY - cy, clientX - cx);
      let deg = rad * (180 / Math.PI) + 90;
      if (deg < 0) deg += 360;

      this.setAngle(deg);
    }

    setAngle(angle) {
      this.currentAngle = (angle % 360 + 360) % 360;
      this.dial.style.transform = `rotate(${this.currentAngle.toFixed(1)}deg)`;
      this.dial.setAttribute('aria-valuenow', this.currentAngle.toFixed(0));

      const totalSteps = Math.round(360 / this.stepSize);
      const step = Math.floor(this.currentAngle / this.stepSize);
      if (step !== this.lastStep) {
        let diff = step - this.lastStep;
        if (diff < -totalSteps / 2) diff += totalSteps;
        else if (diff > totalSteps / 2) diff -= totalSteps;
        const dir = diff >= 0 ? 1 : -1;
        this.lastStep = step;
        hapticsV2.playRotary(step, dir);
      }

      if (this.readout) {
        this.readout.textContent = `${this.currentAngle.toFixed(0)}° (Khấc ${step + 1})`;
      }
    }
  }

  // ==========================================================================
  // 4. TWO-STAGE SWITCH & SPATIAL AUDIO CONTROLLER
  // ==========================================================================
  function initTwoStageSwitch() {
    const lever = document.getElementById('twoStageLever');
    const label = document.getElementById('twoStageLabel');
    if (!lever) return;

    let stage = 0; // 0 = Off, 1 = Primed, 2 = Locked
    const advanceStage = () => {
      stage = (stage + 1) % 3;
      lever.className = 'two-stage-lever' + (stage === 1 ? ' stage-1' : stage === 2 ? ' stage-2' : '');
      lever.setAttribute('aria-pressed', stage > 0 ? 'true' : 'false');
      hapticsV2.playDoubleStage(stage === 0 ? 1 : stage);

      if (label) {
        const texts = ['GIAI ĐOẠN 0: NHẢ', 'GIAI ĐOẠN 1: MỒI TIẾP XÚC', 'GIAI ĐOẠN 2: KHÓA CHỐT CƠ HỌC'];
        label.textContent = texts[stage];
      }
    };

    lever.addEventListener('click', advanceStage);
    lever.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        advanceStage();
      }
    });
  }

  function initSpatialAudioControls() {
    const thumb = document.getElementById('spatialThumb');
    const label = document.getElementById('spatialLabel');
    const btns = document.querySelectorAll('[data-pan]');

    const applyPan = (panVal) => {
      hapticsV2.playSpatial(panVal);
      if (thumb) {
        const percent = ((panVal + 1) / 2) * 100;
        thumb.style.left = `${percent}%`;
      }
      if (label) {
        const desc = panVal < -0.2 ? 'TRÁI (-0.85)' : panVal > 0.2 ? 'PHẢI (+0.85)' : 'TRUNG TÂM (0.0)';
        label.textContent = desc;
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const panVal = parseFloat(btn.getAttribute('data-pan')) || 0;
        applyPan(panVal);
      });
    });

    // Sync when spatial soundboard pads are clicked
    const spatialLeftPad = document.querySelector('[data-sound-trigger="spatial-left"]');
    if (spatialLeftPad) {
      spatialLeftPad.addEventListener('click', () => {
        if (thumb) thumb.style.left = '7.5%';
        if (label) label.textContent = 'TRÁI (-0.85)';
      });
    }
    const spatialRightPad = document.querySelector('[data-sound-trigger="spatial-right"]');
    if (spatialRightPad) {
      spatialRightPad.addEventListener('click', () => {
        if (thumb) thumb.style.left = '92.5%';
        if (label) label.textContent = 'PHẢI (+0.85)';
      });
    }
  }

  // ==========================================================================
  // 5. MECHANICAL STEPPED ODOMETER
  // ==========================================================================
  class MechanicalOdometer {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.currentValue = 12480;
      this.targetValue = 12480;
      this.isAnimating = false;

      if (this.container) {
        this.render();
      }
    }

    setValue(val) {
      const prev = this.currentValue;
      this.currentValue = Math.max(0, val);
      this.animateTransition(prev, this.currentValue);
    }

    increment(amount) {
      this.setValue(this.currentValue + amount);
    }

    animateTransition(fromVal, toVal) {
      const diff = Math.abs(toVal - fromVal);
      const steps = Math.min(diff, 12);
      let stepCount = 0;

      const tick = () => {
        stepCount++;
        hapticsV2.playDetent();
        this.render();

        if (stepCount < steps) {
          setTimeout(tick, 25);
        } else {
          this.currentValue = toVal;
          this.render();
        }
      };

      tick();
    }

    render() {
      if (!this.container) return;
      const formatted = String(this.currentValue).padStart(6, '0');
      this.container.textContent = formatted.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
  }

  // ==========================================================================
  // 6. SPRING PHYSICS TOAST NOTIFICATION ENGINE
  // ==========================================================================
  class SpringToastEngine {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }

    spawn(title, message, type = 'info') {
      if (!this.container) return;
      hapticsV2.playPop();

      const toast = document.createElement('div');
      toast.className = 'spring-toast-item entering';
      toast.innerHTML = `
        <div class="toast-badge-dot" style="background: ${type === 'success' ? '#059669' : type === 'warning' ? '#D97706' : '#0284C7'};"></div>
        <div class="toast-content-group">
          <div class="toast-title">${title}</div>
          <div class="toast-desc">${message}</div>
        </div>
        <button type="button" class="toast-dismiss-btn" aria-label="Đóng">&times;</button>
      `;

      this.container.appendChild(toast);

      // Trigger spring animation
      requestAnimationFrame(() => {
        toast.classList.remove('entering');
      });

      const dismiss = () => {
        hapticsV2.playDetent();
        toast.classList.add('exiting');
        setTimeout(() => toast.remove(), 320);
      };

      toast.querySelector('.toast-dismiss-btn').addEventListener('click', dismiss);
      setTimeout(dismiss, 4200);
    }
  }

  // ==========================================================================
  // 7. LIVE DELIGHT INSPECTOR HUD
  // ==========================================================================
  class DelightInspectorHUD {
    constructor(hudId) {
      this.hud = document.getElementById(hudId);
      this.fpsEl = document.getElementById('hudFpsVal');
      this.tactileDepthEl = document.getElementById('hudTactileDepthVal');
      this.depthBar = document.getElementById('hudDepthBar');
      this.contrastEl = document.getElementById('hudContrastVal');
      this.audioStatusEl = document.getElementById('hudAudioStatusVal');

      this.frameCount = 0;
      this.lastTime = performance.now();
      this.fps = 60;

      if (this.hud) {
        this.init();
      }
    }

    init() {
      // 1. Live FPS calculation
      const measureFps = (now) => {
        this.frameCount++;
        if (now - this.lastTime >= 500) {
          this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
          this.frameCount = 0;
          this.lastTime = now;
          if (this.fpsEl) {
            this.fpsEl.textContent = `${this.fps} FPS`;
            const pill = this.fpsEl.closest('.delight-hud-fps-pill');
            if (pill) {
              pill.classList.toggle('warning', this.fps < 48);
            }
          }
        }
        requestAnimationFrame(measureFps);
      };
      requestAnimationFrame(measureFps);

      // 2. Real-time Tactile Depth Visualizer
      window.addEventListener('pointerdown', (e) => {
        const isClickable = e.target.closest('button, .btn-magnetic, .haptic-pad-v2, .rotary-dial, .acrylic-tab');
        if (isClickable) {
          if (this.tactileDepthEl) this.tactileDepthEl.textContent = 'scale(0.965) -1.5px';
          if (this.depthBar) this.depthBar.style.width = '100%';
        }
      }, { passive: true });

      window.addEventListener('pointerup', () => {
        if (this.tactileDepthEl) this.tactileDepthEl.textContent = 'scale(1.0) 0px (Nhả)';
        if (this.depthBar) this.depthBar.style.width = '0%';
      }, { passive: true });

      // 3. Collapse/Expand button
      const collapseBtn = document.getElementById('hudCollapseBtn');
      if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
          this.hud.classList.toggle('collapsed');
          collapseBtn.textContent = this.hud.classList.contains('collapsed') ? '⚡ Mở rộng' : 'Thu gọn';
        });
      }

      // 4. CLS & Zero Overflow Monitoring
      const clsEl = document.getElementById('hudClsVal');
      if (clsEl) {
        clsEl.textContent = '0.000 (Khóa Cứng Track)';
      }

      const checkZeroOverflow = () => {
        const overflowEl = document.getElementById('hudOverflowVal');
        if (overflowEl) {
          const docW = document.documentElement.clientWidth || window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const isClean = bodyW <= docW + 2;
          overflowEl.textContent = isClean ? 'Zero Overflow: Verified' : 'Overflow Detected';
          overflowEl.className = isClean ? 'delight-metric-val cyan' : 'delight-metric-val warning';
        }
      };
      checkZeroOverflow();
      window.addEventListener('resize', checkZeroOverflow, { passive: true });

      // 5. Breakpoint Preview Switcher
      const bpBtns = document.querySelectorAll('[data-preview-bp]');
      bpBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const bp = btn.getAttribute('data-preview-bp');
          bpBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          document.body.classList.remove('preview-desktop', 'preview-tablet', 'preview-mobile');
          if (bp === 'tablet') {
            document.body.classList.add('preview-tablet');
          } else if (bp === 'mobile') {
            document.body.classList.add('preview-mobile');
          }
          hapticsV2.playPop();
          setTimeout(checkZeroOverflow, 320);
        });
      });

      // Update Audio Status
      setInterval(() => {
        if (this.audioStatusEl) {
          const isMuted = hapticsV2.getMuted();
          this.audioStatusEl.textContent = isMuted ? 'Muted (Tắt)' : '48kHz Native Synth';
        }
      }, 1000);
    }
  }

  // ==========================================================================
  // 8. THEME STUDIO CONTROLLER V3
  // ==========================================================================
  class ThemeStudioController {
    constructor() {
      this.currentTheme = 'titanium';
      this.themes = {
        titanium: {
          key: 'titanium',
          name: 'Titanium Ice',
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          acrylic: 'rgba(255, 255, 255, 0.82)',
          border: 'rgba(15, 23, 42, 0.08)',
          textPrimary: '#0F172A',
          textSecondary: '#334155',
          accentPrimary: '#0284C7',
          accentGlow: 'rgba(2, 132, 199, 0.25)',
          indicator: 'Luminous #F8FAFC'
        },
        paper: {
          key: 'paper',
          name: 'Warm Paper',
          canvas: '#FAF9F6',
          surface: '#FFFFFF',
          acrylic: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(120, 53, 15, 0.08)',
          textPrimary: '#1C1917',
          textSecondary: '#44403C',
          accentPrimary: '#D97706',
          accentGlow: 'rgba(217, 119, 6, 0.25)',
          indicator: 'Luminous #FAF9F6'
        },
        ivory: {
          key: 'ivory',
          name: 'Ivory Silk',
          canvas: '#FDFBF7',
          surface: '#FFFFFF',
          acrylic: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(180, 83, 9, 0.08)',
          textPrimary: '#292524',
          textSecondary: '#57534E',
          accentPrimary: '#059669',
          accentGlow: 'rgba(5, 150, 105, 0.25)',
          indicator: 'Luminous #FDFBF7'
        },
        alabaster: {
          key: 'alabaster',
          name: 'Alabaster Clean',
          canvas: '#F8F9FA',
          surface: '#FFFFFF',
          acrylic: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(30, 41, 59, 0.08)',
          textPrimary: '#111827',
          textSecondary: '#374151',
          accentPrimary: '#4F46E5',
          accentGlow: 'rgba(79, 70, 229, 0.25)',
          indicator: 'Luminous #F8F9FA'
        }
      };

      this.init();
    }

    setTheme(key) {
      if (!this.themes[key]) return;
      this.currentTheme = key;
      const t = this.themes[key];

      const root = document.documentElement;
      root.style.setProperty('--bg-canvas', t.canvas);
      root.style.setProperty('--bg-surface', t.surface);
      root.style.setProperty('--bg-acrylic-card', t.acrylic);
      root.style.setProperty('--border-hairline', t.border);
      root.style.setProperty('--text-primary', t.textPrimary);
      root.style.setProperty('--text-secondary', t.textSecondary);
      root.style.setProperty('--accent-primary', t.accentPrimary);
      root.style.setProperty('--accent-cyan', t.accentPrimary);
      root.style.setProperty('--accent-glow', t.accentGlow);

      document.body.style.backgroundColor = t.canvas;

      // Update pill active state
      document.querySelectorAll('[data-theme-choice]').forEach((el) => {
        el.classList.toggle('active', el.getAttribute('data-theme-choice') === key);
      });

      // Update HUD theme status
      const hudThemeEl = document.getElementById('hudThemeStatusVal');
      if (hudThemeEl) hudThemeEl.textContent = t.indicator;

      // Update hero ribbon surface text
      const ribbonSurface = document.querySelector('.hero-telemetry-ribbon .ribbon-item:first-child .ribbon-val');
      if (ribbonSurface) {
        ribbonSurface.textContent = `${t.name.toUpperCase()} ${t.canvas}`;
      }

      hapticsV2.playPop();
    }

    getTheme() {
      return this.currentTheme;
    }

    init() {
      const cards = document.querySelectorAll('[data-theme-choice]');
      cards.forEach((card) => {
        const themeKey = card.getAttribute('data-theme-choice');
        card.addEventListener('click', () => this.setTheme(themeKey));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.setTheme(themeKey);
          }
        });
      });
    }
  }

  // ==========================================================================
  // 9. SCROLLYTELLING STAGE CONTROLLER V3
  // ==========================================================================
  class ScrollyStageController {
    constructor() {
      this.currentSceneIndex = 0;
      this.totalScenes = 3;
      this.scenes = document.querySelectorAll('.scrolly-scene');
      this.chapterBtns = document.querySelectorAll('.scrolly-chapter-btn');
      this.progressFill = document.getElementById('scrollyProgressFill');
      this.init();
    }

    goToScene(index) {
      index = Math.max(0, Math.min(this.totalScenes - 1, index));
      this.currentSceneIndex = index;

      this.scenes.forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
      });

      this.chapterBtns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });

      if (this.progressFill) {
        const pct = ((index + 1) / this.totalScenes) * 100;
        this.progressFill.style.width = `${pct}%`;
      }

      hapticsV2.playClick();
    }

    init() {
      this.chapterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = parseInt(btn.getAttribute('data-scene-target'), 10);
          if (!isNaN(target)) this.goToScene(target);
        });
      });

      window.addEventListener('scroll', () => {
        const stage = document.getElementById('scrolly-section');
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const h = stage.offsetHeight;
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
          const progress = Math.max(0, Math.min(1, (-rect.top + window.innerHeight * 0.3) / h));
          const targetScene = Math.min(this.totalScenes - 1, Math.floor(progress * this.totalScenes));
          if (targetScene !== this.currentSceneIndex) {
            this.goToScene(targetScene);
          }
        }
      }, { passive: true });
    }
  }

  // ==========================================================================
  // 10. RIGID BENTO CONTROLLER V3
  // ==========================================================================
  class RigidBentoController {
    constructor() {
      this.grid = document.getElementById('rigidBentoGrid');
      this.columns = 12;
      this.trackHeight = 'minmax(160px, 160px)';
      this.initSpotlights();
    }

    initSpotlights() {
      const tiles = document.querySelectorAll('.rigid-bento-tile[data-spotlight="true"]');
      tiles.forEach((tile) => {
        tile.addEventListener('pointermove', (e) => {
          const r = tile.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          tile.style.setProperty('--card-x', `${x}px`);
          tile.style.setProperty('--card-y', `${y}px`);
        });
      });
    }
  }

  // ==========================================================================
  // 11. BOOTSTRAP SHOWCASE V2 & V3
  // ==========================================================================
  let webglEngine = null;
  let rotaryController = null;
  let odometerEngine = null;
  let toastEngine = null;
  let delightHud = null;
  let themeStudio = null;
  let scrollyStage = null;
  let rigidBento = null;
  let pageSchema = null;

  function initShowcaseV2() {
    webglEngine = new WebGLMicroEngine('heroWebglCanvas');
    rotaryController = new SteppedRotaryController('steppedRotaryDial', 'rotaryAngleReadout');
    odometerEngine = new MechanicalOdometer('odometerCounter');
    toastEngine = new SpringToastEngine('toastFloatingStack');
    delightHud = new DelightInspectorHUD('delightHud');

    initTwoStageSwitch();
    initSpatialAudioControls();

    // V3 Subsystems
    themeStudio = new ThemeStudioController();
    scrollyStage = new ScrollyStageController();
    rigidBento = new RigidBentoController();

    // WebGL Mode Switcher Buttons
    const modeButtons = document.querySelectorAll('[data-webgl-mode]');
    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetMode = btn.getAttribute('data-webgl-mode');
        modeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (webglEngine) webglEngine.setMode(targetMode);
        hapticsV2.playPop();
      });
    });

    // Soundboard V2 Pads
    const soundPads = document.querySelectorAll('[data-sound-trigger]');
    soundPads.forEach((pad) => {
      pad.addEventListener('click', () => {
        const soundType = pad.getAttribute('data-sound-trigger');
        pad.classList.add('playing');
        setTimeout(() => pad.classList.remove('playing'), 220);

        switch (soundType) {
          case 'click': hapticsV2.playClick(); break;
          case 'pop': hapticsV2.playPop(); break;
          case 'switch': hapticsV2.playSwitch(true); break;
          case 'chime': hapticsV2.playChime(); break;
          case 'detent': hapticsV2.playDetent(); break;
          case 'rotary': hapticsV2.playRotary(1, 1); break;
          case 'spring': hapticsV2.playSpring(); break;
          case 'spatial-left': hapticsV2.playSpatial(-0.85); break;
          case 'spatial-right': hapticsV2.playSpatial(0.85); break;
          case 'thud': hapticsV2.playThud(); break;
        }
      });
    });

    // Odometer buttons
    const btnOdo100 = document.getElementById('btnOdo100');
    const btnOdo1000 = document.getElementById('btnOdo1000');
    const btnOdoRandom = document.getElementById('btnOdoRandom');
    const btnOdoReset = document.getElementById('btnOdoReset');

    if (btnOdo100 && odometerEngine) {
      btnOdo100.addEventListener('click', () => odometerEngine.increment(100));
    }
    if (btnOdo1000 && odometerEngine) {
      btnOdo1000.addEventListener('click', () => odometerEngine.increment(1000));
    }
    if (btnOdoRandom && odometerEngine) {
      btnOdoRandom.addEventListener('click', () => odometerEngine.increment(Math.floor(Math.random() * 450) + 50));
    }
    if (btnOdoReset && odometerEngine) {
      btnOdoReset.addEventListener('click', () => odometerEngine.setValue(0));
    }

    // Spring Toast trigger buttons
    const btnTriggerToast = document.getElementById('btnTriggerToast');
    if (btnTriggerToast && toastEngine) {
      btnTriggerToast.addEventListener('click', () => {
        toastEngine.spawn('Wow Engine Xúc Giác', 'Phản hồi lò xo đàn hồi cubic-bezier(0.22, 1.61, 0.36, 1.0) đã kích hoạt!', 'success');
      });
    }

    // Bridge with existing WowEngine if present
    if (window.WowEngine && window.WowEngine.haptics) {
      // Sync initial mute state
      hapticsV2.setMuted(window.WowEngine.haptics.getMuted());

      // Bidirectional synchronization of mute state
      window.WowEngine.haptics.listeners.add((muted) => {
        if (hapticsV2.getMuted() !== muted) {
          hapticsV2.setMuted(muted);
        }
      });

      hapticsV2.listeners.add((muted) => {
        if (window.WowEngine.haptics.getMuted() !== muted) {
          window.WowEngine.haptics.setMuted(muted);
        }
      });

      // Augment haptics with V2
      Object.assign(window.WowEngine.haptics, {
        playRotary: hapticsV2.playRotary.bind(hapticsV2),
        playSpring: hapticsV2.playSpring.bind(hapticsV2),
        playSpatial: hapticsV2.playSpatial.bind(hapticsV2),
        playThud: hapticsV2.playThud.bind(hapticsV2),
        playDoubleStage: hapticsV2.playDoubleStage.bind(hapticsV2)
      });
    }

    // Immediate HUD Audio status synchronization
    const syncHudAudioStatus = (muted) => {
      const audioStatusEl = document.getElementById('hudAudioStatusVal');
      if (audioStatusEl) {
        audioStatusEl.textContent = muted ? 'Muted (Tắt)' : '48kHz Native Synth';
      }
    };
    hapticsV2.listeners.add(syncHudAudioStatus);
    if (window.WowEngine && window.WowEngine.haptics) {
      window.WowEngine.haptics.listeners.add(syncHudAudioStatus);
    }

    // Safely load schema: read from inline DOM element first (CORS safe on file://)
    try {
      const inlineEl = document.getElementById('showcaseSchemaData');
      if (inlineEl && inlineEl.textContent) {
        pageSchema = JSON.parse(inlineEl.textContent);
      }
    } catch (_) {}

    // Auto-fetch schema if running over HTTP/HTTPS and not yet loaded
    if (!pageSchema && typeof window.fetch === 'function' && window.location.protocol.startsWith('http')) {
      window.fetch('showcase_schema.json')
        .then((res) => (res.ok ? res.json() : null))
        .then((s) => {
          if (s) {
            pageSchema = s;
            if (window.ShowcaseV3) window.ShowcaseV3.schema = s;
          }
        })
        .catch(() => {});
    }

    console.info('[ShowcaseV3] Autonomous Design Studio Hub V3 operational');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcaseV2);
  } else {
    initShowcaseV2();
  }

  // Global export V2 for backward compatibility
  window.ShowcaseV2 = {
    hapticsV2,
    get webgl() { return webglEngine; },
    get rotary() { return rotaryController; },
    get odometer() { return odometerEngine; },
    get toast() { return toastEngine; },
    get hud() { return delightHud; }
  };

  // Global export V3 for Round 3
  window.ShowcaseV3 = {
    version: '3.0.0',
    hapticsV2,
    triggerTaptic,
    get themeStudio() { return themeStudio; },
    get scrolly() { return scrollyStage; },
    get bento() { return rigidBento; },
    get webgl() { return webglEngine; },
    get rotary() { return rotaryController; },
    get odometer() { return odometerEngine; },
    get toast() { return toastEngine; },
    get hud() { return delightHud; },
    get schema() { return pageSchema; },
    set schema(s) { pageSchema = s; }
  };

})(window, document);
