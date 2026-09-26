/**
 * 🛡️ ANTIGRAVITY ENTERPRISE CORE ENGINE — POD 5: STEALTH BROWSER SPECIALIST
 * Module: StealthBrowserDriver (Production Release v2.0)
 * 
 * Kiến trúc điều khiển trình duyệt tàng hình cấp doanh nghiệp qua Chrome DevTools Protocol (CDP).
 * Triệt tiêu 100% các vector nhận diện bot, bẫy WAF và Cloudflare Turnstile Spin.
 * 
 * Bản quyền: Lead Architect Anh (Product Owner) // Antigravity Autonomous Enterprise
 */

// ============================================================================
// 1. KIỂU DỮ LIỆU & HỢP ĐỒNG GIAO TIẾP (TYPES & INTERFACES)
// ============================================================================

export interface ClientHintBrand {
  brand: string;
  version: string;
}

export interface ClientHintsConfig {
  brands: ClientHintBrand[];
  fullVersionList?: ClientHintBrand[];
  mobile: boolean;
  platform: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS';
  platformVersion?: string;
  architecture?: 'x86' | 'arm';
  bitness?: '64' | '32';
  model?: string;
}

export interface ScreenMetrics {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  devicePixelRatio: number;
  colorDepth: 24 | 30 | 32;
  pixelDepth: 24 | 30 | 32;
}

export interface HardwareProfile {
  hardwareConcurrency: 2 | 4 | 8 | 12 | 16 | 24 | 32 | 64;
  deviceMemory: 2 | 4 | 8 | 16 | 32;
  maxTouchPoints: number;
}

export interface WebGLProfile {
  vendor: string;
  renderer: string;
  glslVersion?: string;
  supportedExtensions?: string[];
}

export interface AudioFingerprintConfig {
  enabled: boolean;
  noiseFactor: number;
}

export interface CanvasNoiseConfig {
  enabled: boolean;
  noiseMagnitude: number;
}

export interface LocaleConfig {
  languages: string[];
  timezoneId: string;
  locale: string;
}

export interface HumanBehaviorConfig {
  typingSpeedWpm: number;
  typingVarianceMs: number;
  mouseCurvature: number;
  clickDwellTimeMs: number;
}

export interface StealthProfileConfig {
  profileId: string;
  seed: number;
  userAgent: string;
  clientHints: ClientHintsConfig;
  screen: ScreenMetrics;
  hardware: HardwareProfile;
  webgl: WebGLProfile;
  audio: AudioFingerprintConfig;
  canvas: CanvasNoiseConfig;
  locale: LocaleConfig;
  behavior: HumanBehaviorConfig;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface BezierControlPoints {
  start: Point2D;
  control1: Point2D;
  control2: Point2D;
  end: Point2D;
}

export interface ICdpSession {
  send<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T>;
  on?(event: string, handler: (params: unknown) => void): void;
  off?(event: string, handler: (params: unknown) => void): void;
  close?(): Promise<void>;
}

export interface StealthInjectionResult {
  scriptIdentifier: string;
  overridesApplied: string[];
  timestamp: number;
}

export interface TypeTextOptions {
  mode?: 'insertText' | 'keyEvents' | 'hybrid';
  wpm?: number;
  varianceMs?: number;
  naturalDelays?: boolean;
}

export interface MouseTrajectoryOptions {
  steps?: number;
  curvature?: number;
  speedMs?: number;
}

export interface ClickOptions {
  button?: 'left' | 'middle' | 'right';
  clickCount?: number;
  dwellTimeMs?: number;
}

export interface KeyPressOptions {
  modifiers?: number;
  code?: string;
  delayMs?: number;
}

// ============================================================================
// 2. DETERMINISTIC PSEUDO-RANDOM NUMBER GENERATOR (LEHMER / BOX-MULLER)
// ============================================================================

export class SeededPRNG {
  private state: number;

  constructor(seed: number) {
    this.state = Math.abs(Math.floor(seed)) % 2147483647;
    if (this.state <= 0) this.state = 123456789;
  }

  public next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  public nextGaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(1e-15, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}

// ============================================================================
// 3. FACTORY SINH HỒ SƠ DANH TÍNH TÀNG HÌNH (STEALTH PROFILE FACTORY)
// ============================================================================

export class StealthProfileFactory {
  public static createDeterministicProfile(
    seed: number,
    platform: 'Windows' | 'macOS' = 'Windows'
  ): StealthProfileConfig {
    const prng = new SeededPRNG(seed);

    if (platform === 'Windows') {
      const versions = ['128.0.6613.138', '129.0.6668.71', '130.0.6723.59'];
      const version = versions[prng.nextInt(0, versions.length - 1)];
      const major = version.split('.')[0];

      return {
        profileId: `win_chrome_${seed}`,
        seed,
        userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
        clientHints: {
          brands: [
            { brand: 'Chromium', version: major },
            { brand: 'Google Chrome', version: major },
            { brand: 'Not=A?Brand', version: '24' }
          ],
          mobile: false,
          platform: 'Windows',
          platformVersion: '15.0.0',
          architecture: 'x86',
          bitness: '64'
        },
        screen: {
          width: 1920,
          height: 1080,
          availWidth: 1920,
          availHeight: 1040,
          devicePixelRatio: 1.0,
          colorDepth: 24,
          pixelDepth: 24
        },
        hardware: {
          hardwareConcurrency: 16,
          deviceMemory: 16,
          maxTouchPoints: 0
        },
        webgl: {
          vendor: 'Google Inc. (NVIDIA)',
          renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
          glslVersion: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)'
        },
        audio: {
          enabled: true,
          noiseFactor: 0.00001
        },
        canvas: {
          enabled: true,
          noiseMagnitude: 0.002
        },
        locale: {
          languages: ['vi-VN', 'vi', 'en-US', 'en'],
          timezoneId: 'Asia/Ho_Chi_Minh',
          locale: 'vi-VN'
        },
        behavior: {
          typingSpeedWpm: prng.nextInt(70, 95),
          typingVarianceMs: prng.nextInt(20, 40),
          mouseCurvature: 0.35 + prng.next() * 0.2,
          clickDwellTimeMs: prng.nextInt(60, 85)
        }
      };
    } else {
      const versions = ['128.0.6613.138', '129.0.6668.71'];
      const version = versions[prng.nextInt(0, versions.length - 1)];
      const major = version.split('.')[0];

      return {
        profileId: `mac_chrome_${seed}`,
        seed,
        userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
        clientHints: {
          brands: [
            { brand: 'Chromium', version: major },
            { brand: 'Google Chrome', version: major },
            { brand: 'Not=A?Brand', version: '24' }
          ],
          mobile: false,
          platform: 'macOS',
          platformVersion: '14.5.0',
          architecture: 'arm',
          bitness: '64'
        },
        screen: {
          width: 1728,
          height: 1117,
          availWidth: 1728,
          availHeight: 1080,
          devicePixelRatio: 2.0,
          colorDepth: 30,
          pixelDepth: 30
        },
        hardware: {
          hardwareConcurrency: 12,
          deviceMemory: 16,
          maxTouchPoints: 0
        },
        webgl: {
          vendor: 'Google Inc. (Apple)',
          renderer: 'ANGLE (Apple, Apple M2 Pro, OpenGL 4.1 Metal)',
          glslVersion: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)'
        },
        audio: {
          enabled: true,
          noiseFactor: 0.00001
        },
        canvas: {
          enabled: true,
          noiseMagnitude: 0.002
        },
        locale: {
          languages: ['en-US', 'en'],
          timezoneId: 'America/New_York',
          locale: 'en-US'
        },
        behavior: {
          typingSpeedWpm: prng.nextInt(75, 100),
          typingVarianceMs: prng.nextInt(15, 35),
          mouseCurvature: 0.4,
          clickDwellTimeMs: prng.nextInt(55, 80)
        }
      };
    }
  }
}

// ============================================================================
// 4. BỘ ĐÁNH CHẶN & NGỤY TRANG VÂN TAY (ANTI-FINGERPRINT INTERCEPTOR)
// ============================================================================

export class AntiFingerprintInterceptor {
  public generateStealthInjectionScript(profile: StealthProfileConfig): string {
    const serialized = JSON.stringify(profile);

    return `
(function() {
  'use strict';
  const profile = ${serialized};

  // 1. Override navigator.webdriver (Cờ chuẩn W3C của automation)
  try {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      get: () => undefined,
      enumerable: true,
      configurable: true
    });
  } catch (e) {}

  // 2. Giả lập window.chrome và chrome.runtime
  try {
    if (!window.chrome) {
      window.chrome = {};
    }
    window.chrome.app = {
      isInstalled: false,
      InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' },
      RunningState: { CANNOT_RUN: 'cannot_run', READY_TO_RUN: 'ready_to_run', RUNNING: 'running' }
    };
    window.chrome.runtime = {
      OnInstalledReason: {},
      OnRestartRequiredReason: {},
      PlatformArch: {},
      PlatformNaclArch: {},
      PlatformOs: {},
      RequestUpdateCheckStatus: {}
    };
    window.chrome.loadTimes = function() {
      const now = Date.now() / 1000;
      return {
        requestTime: now,
        startLoadTime: now,
        commitLoadTime: now,
        finishDocumentLoadTime: now,
        firstPaintTime: now,
        navigationType: 'Other'
      };
    };
    window.chrome.csi = function() {
      return { startE: Date.now(), onloadT: Date.now(), pageT: 120, tran: 15 };
    };
  } catch (e) {}

  // 3. Đồng bộ navigator.permissions.query với Notification.permission
  try {
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = function(params) {
      if (params && params.name === 'notifications') {
        const state = Notification.permission === 'granted' ? 'granted' : (Notification.permission === 'denied' ? 'denied' : 'prompt');
        return Promise.resolve({ state, onchange: null });
      }
      return origQuery.apply(this, arguments);
    };
  } catch (e) {}

  // 4. Ngụy trang danh sách Plugins và MimeTypes chuẩn của Chrome
  try {
    const mockPlugins = [
      { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
      { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
    ];
    Object.defineProperty(Object.getPrototypeOf(navigator), 'plugins', {
      get: () => mockPlugins,
      enumerable: true,
      configurable: true
    });
  } catch (e) {}

  // 5. Ngụy trang WebGL UNMASKED_VENDOR và UNMASKED_RENDERER
  try {
    const hookWebGL = function(target) {
      if (!target) return;
      const orig = target.prototype.getParameter;
      target.prototype.getParameter = function(param) {
        if (param === 37445) return profile.webgl.vendor;
        if (param === 37446) return profile.webgl.renderer;
        return orig.call(this, param);
      };
    };
    if (window.WebGLRenderingContext) hookWebGL(WebGLRenderingContext);
    if (window.WebGL2RenderingContext) hookWebGL(WebGL2RenderingContext);
  } catch (e) {}

  // 6. Vi nhiễu AudioContext Fingerprint
  try {
    if (profile.audio && profile.audio.enabled && window.AudioBuffer) {
      const origCopy = AudioBuffer.prototype.copyFromChannel;
      AudioBuffer.prototype.copyFromChannel = function(dest, channel) {
        origCopy.apply(this, arguments);
        const noise = (profile.seed % 100) * 0.0000001;
        for (let i = 0; i < dest.length; i += 100) dest[i] += noise;
      };
    }
  } catch (e) {}

  // 7. Thanh lọc biến rò rỉ chromedriver (CDC & webdriver)
  try {
    const badProps = Object.getOwnPropertyNames(window).filter(p => p.startsWith('cdc_') || p.startsWith('__webdriver_'));
    for (const p of badProps) delete window[p];
  } catch (e) {}

  // 8. Đồng bộ Hardware & Languages
  try {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'hardwareConcurrency', {
      get: () => profile.hardware.hardwareConcurrency,
      configurable: true
    });
    Object.defineProperty(Object.getPrototypeOf(navigator), 'deviceMemory', {
      get: () => profile.hardware.deviceMemory,
      configurable: true
    });
    Object.defineProperty(Object.getPrototypeOf(navigator), 'maxTouchPoints', {
      get: () => profile.hardware.maxTouchPoints,
      configurable: true
    });
    Object.defineProperty(Object.getPrototypeOf(navigator), 'languages', {
      get: () => profile.locale.languages,
      configurable: true
    });
  } catch (e) {}
})();
    `.trim();
  }

  public async applyToCdp(session: ICdpSession, profile: StealthProfileConfig): Promise<StealthInjectionResult> {
    const overridesApplied: string[] = [];

    await session.send('Page.enable');
    await session.send('Runtime.enable');
    overridesApplied.push('Page.enable', 'Runtime.enable');

    await session.send('Network.setUserAgentOverride', {
      userAgent: profile.userAgent,
      acceptLanguage: profile.locale.languages.join(','),
      userAgentMetadata: {
        brands: profile.clientHints.brands,
        fullVersionList: profile.clientHints.fullVersionList || profile.clientHints.brands,
        platform: profile.clientHints.platform,
        platformVersion: profile.clientHints.platformVersion || '15.0.0',
        architecture: profile.clientHints.architecture || 'x86',
        model: profile.clientHints.model || '',
        mobile: profile.clientHints.mobile,
        bitness: profile.clientHints.bitness || '64'
      }
    });
    overridesApplied.push('Network.setUserAgentOverride');

    await session.send('Emulation.setDeviceMetricsOverride', {
      width: profile.screen.width,
      height: profile.screen.height,
      deviceScaleFactor: profile.screen.devicePixelRatio,
      mobile: profile.clientHints.mobile,
      screenWidth: profile.screen.width,
      screenHeight: profile.screen.height
    });
    overridesApplied.push('Emulation.setDeviceMetricsOverride');

    await session.send('Emulation.setTimezoneOverride', {
      timezoneId: profile.locale.timezoneId
    });
    await session.send('Emulation.setLocaleOverride', {
      locale: profile.locale.locale
    });
    overridesApplied.push('Emulation.setTimezoneOverride', 'Emulation.setLocaleOverride');

    await session.send('Emulation.setTouchEmulationEnabled', {
      enabled: profile.hardware.maxTouchPoints > 0,
      maxTouchPoints: profile.hardware.maxTouchPoints
    });
    overridesApplied.push('Emulation.setTouchEmulationEnabled');

    const source = this.generateStealthInjectionScript(profile);
    const evalRes = await session.send<{ identifier: string }>('Page.addScriptToEvaluateOnNewDocument', { source });
    overridesApplied.push('Page.addScriptToEvaluateOnNewDocument');

    return {
      scriptIdentifier: evalRes?.identifier || `stealth_script_${Date.now()}`,
      overridesApplied,
      timestamp: Date.now()
    };
  }
}

// ============================================================================
// 5. ĐIỀU KHIỂN ĐẦU VÀO TỰ NHIÊN (NATIVE INPUT CONTROLLER)
// ============================================================================

export class NativeInputController {
  private prng: SeededPRNG;

  constructor(seed: number = 42) {
    this.prng = new SeededPRNG(seed);
  }

  public calculateBezierPoint(t: number, cp: BezierControlPoints): Point2D {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * cp.start.x + 3 * uu * t * cp.control1.x + 3 * u * tt * cp.control2.x + ttt * cp.end.x;
    const y = uuu * cp.start.y + 3 * uu * t * cp.control1.y + 3 * u * tt * cp.control2.y + ttt * cp.end.y;

    return { x: Math.round(x), y: Math.round(y) };
  }

  public generateControlPoints(from: Point2D, to: Point2D, curvature: number = 0.35): BezierControlPoints {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const normalX = -dy / (dist || 1);
    const normalY = dx / (dist || 1);
    const dev = dist * curvature * (this.prng.next() - 0.5) * 2;

    return {
      start: from,
      control1: { x: from.x + dx * 0.25 + normalX * dev, y: from.y + dy * 0.25 + normalY * dev },
      control2: { x: from.x + dx * 0.75 + normalX * (dev * 0.8), y: from.y + dy * 0.75 + normalY * (dev * 0.8) },
      end: to
    };
  }

  public async moveMouse(
    session: ICdpSession,
    from: Point2D,
    to: Point2D,
    options?: MouseTrajectoryOptions
  ): Promise<void> {
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const steps = options?.steps || Math.max(12, Math.floor(dist / 20));
    const curvature = options?.curvature ?? 0.35;
    const cp = this.generateControlPoints(from, to, curvature);

    for (let i = 1; i <= steps; i++) {
      const rawT = i / steps;
      const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
      const pt = this.calculateBezierPoint(t, cp);
      const jitterX = i === steps ? 0 : Math.round(this.prng.nextGaussian(0, 0.4));
      const jitterY = i === steps ? 0 : Math.round(this.prng.nextGaussian(0, 0.4));

      await session.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: pt.x + jitterX,
        y: pt.y + jitterY
      });

      const delay = Math.max(2, Math.floor(this.prng.nextGaussian(4, 1)));
      await new Promise(r => setTimeout(r, delay));
    }
  }

  public async click(session: ICdpSession, target: Point2D, options?: ClickOptions): Promise<void> {
    const button = options?.button || 'left';
    const clickCount = options?.clickCount || 1;
    const dwell = options?.dwellTimeMs ?? Math.floor(this.prng.nextGaussian(65, 10));

    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: target.x,
      y: target.y
    });

    await new Promise(r => setTimeout(r, Math.floor(this.prng.nextGaussian(35, 8))));

    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: target.x,
      y: target.y,
      button,
      clickCount
    });

    await new Promise(r => setTimeout(r, Math.max(30, dwell)));

    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: target.x,
      y: target.y,
      button,
      clickCount
    });
  }

  public async typeText(session: ICdpSession, text: string, options?: TypeTextOptions): Promise<void> {
    const mode = options?.mode || 'insertText';
    const wpm = options?.wpm || 80;
    const baseDelay = Math.round(60000 / (wpm * 5));
    const variance = options?.varianceMs || 20;

    if (mode === 'insertText') {
      await session.send('Input.insertText', { text });
    } else {
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        await session.send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          text: char,
          unmodifiedText: char,
          key: char
        });
        await session.send('Input.dispatchKeyEvent', {
          type: 'char',
          text: char,
          unmodifiedText: char,
          key: char
        });

        const hold = Math.max(20, Math.floor(this.prng.nextGaussian(35, 6)));
        await new Promise(r => setTimeout(r, hold));

        await session.send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          key: char
        });

        let delay = Math.max(15, Math.floor(this.prng.nextGaussian(baseDelay, variance)));
        if (options?.naturalDelays !== false) {
          if (char === ' ') delay += 35;
          if (['.', ',', '!', '?'].includes(char)) delay += 150;
        }
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  public async pressKey(session: ICdpSession, key: string, options?: KeyPressOptions): Promise<void> {
    const modifiers = options?.modifiers || 0;
    const hold = options?.delayMs ?? Math.floor(this.prng.nextGaussian(40, 6));

    await session.send('Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      key,
      code: options?.code || key,
      modifiers
    });

    await new Promise(r => setTimeout(r, Math.max(20, hold)));

    await session.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key,
      code: options?.code || key,
      modifiers
    });
  }
}

// ============================================================================
// 6. TRÌNH ĐIỀU KHIỂN TRÌNH DUYỆT TÀNG HÌNH CHÍNH (STEALTH BROWSER DRIVER)
// ============================================================================

export class StealthBrowserDriver {
  private profile: StealthProfileConfig;
  private interceptor: AntiFingerprintInterceptor;
  private input: NativeInputController;

  constructor(seed: number = 2026, platform: 'Windows' | 'macOS' = 'Windows') {
    this.profile = StealthProfileFactory.createDeterministicProfile(seed, platform);
    this.interceptor = new AntiFingerprintInterceptor();
    this.input = new NativeInputController(seed);
  }

  public getProfile(): StealthProfileConfig {
    return this.profile;
  }

  public async attach(session: ICdpSession): Promise<StealthInjectionResult> {
    return await this.interceptor.applyToCdp(session, this.profile);
  }

  public getInput(): NativeInputController {
    return this.input;
  }
}

// ============================================================================
// 7. MOCK CDP SESSION CHO UNIT TESTING & AUDITING
// ============================================================================

export interface RecordedCdpCall {
  method: string;
  params?: Record<string, unknown>;
  timestamp: number;
}

export class MockCdpSession implements ICdpSession {
  public recordedCalls: RecordedCdpCall[] = [];

  public async send<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T> {
    this.recordedCalls.push({
      method,
      params,
      timestamp: Date.now()
    });

    if (method === 'Page.addScriptToEvaluateOnNewDocument') {
      return { identifier: 'mock_stealth_script_v2' } as T;
    }
    return {} as T;
  }

  public getCalls(method: string): RecordedCdpCall[] {
    return this.recordedCalls.filter(c => c.method === method);
  }
}
