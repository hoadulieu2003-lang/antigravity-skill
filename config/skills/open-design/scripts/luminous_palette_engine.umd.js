/**
 * ⚡ LUMINOUS PALETTE ENGINE (UMD / Standalone Global Bundle)
 * ===========================================================
 * Universal standalone UMD/Global build of LuminousPaletteEngine for direct <script src="..."> tags,
 * CommonJS require(), AMD define(), legacy browsers, Electron, and local file:// protocols.
 *
 * Core Modules:
 *  - generateLuminousPalette(seedHex, options)
 *  - getCssVariables(palette, options)
 *  - resolveAccessibleTextColor(bgHex, options)
 *  - hexToOklch, oklchToHex, getContrastRatio, getApcaContrast
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.LuminousPaletteEngine = exports;
    global.generateLuminousPalette = exports.generateLuminousPalette;
    global.getCssVariables = exports.getCssVariables;
    global.resolveAccessibleTextColor = exports.resolveAccessibleTextColor;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // M1: Linear sRGB -> LMS cone response
  const M1 = [
    [0.4122214708, 0.5363325363, 0.0514459929],
    [0.2119034982, 0.6806995451, 0.1073969566],
    [0.0883024619, 0.2817188376, 0.6299787005],
  ];

  // M2: Non-linear LMS (cube root) -> Oklab (L, a, b)
  const M2 = [
    [0.2104542553, 0.793617785, -0.0040720468],
    [1.9779984951, -2.428592205, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.808675766],
  ];

  // Inverse M2: Oklab (L, a, b) -> Non-linear LMS
  const M2_INV = [
    [1.0, +0.3963377774, +0.2158037573],
    [1.0, -0.1055613458, -0.0638541728],
    [1.0, -0.0894841775, -1.291485548],
  ];

  // Inverse M1: LMS (cubed) -> Linear sRGB
  const M1_INV = [
    [+4.0767416621, -3.3077115913, +0.2309699292],
    [-1.2684380046, +2.6097574011, -0.3413193965],
    [-0.0041960863, -0.7034186147, +1.707614701],
  ];

  // WCAG 2.1 relative luminance weights
  const LUMA_R = 0.2126;
  const LUMA_G = 0.7152;
  const LUMA_B = 0.0722;

  const DEG_TO_RAD = Math.PI / 180;
  const RAD_TO_DEG = 180 / Math.PI;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function parseHex(hex) {
    if (typeof hex !== 'string') {
      return [0.31, 0.27, 0.9];
    }
    let str = hex.trim();

    // Named colors
    const lower = str.toLowerCase();
    if (lower === 'white') return [1, 1, 1];
    if (lower === 'black') return [0, 0, 0];

    // CSS rgb() / rgba()
    const rgbMatch = str.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/i);
    if (rgbMatch) {
      return [
        clamp(parseFloat(rgbMatch[1]) / 255, 0, 1),
        clamp(parseFloat(rgbMatch[2]) / 255, 0, 1),
        clamp(parseFloat(rgbMatch[3]) / 255, 0, 1),
      ];
    }

    // CSS hsl() / hsla()
    const hslMatch = str.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*[\d.]+\s*)?\)$/i);
    if (hslMatch) {
      const h = ((parseFloat(hslMatch[1]) % 360) + 360) % 360;
      const s = clamp(parseFloat(hslMatch[2]) / 100, 0, 1);
      const l = clamp(parseFloat(hslMatch[3]) / 100, 0, 1);
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r1 = 0, g1 = 0, b1 = 0;
      if (h < 60) { r1 = c; g1 = x; }
      else if (h < 120) { r1 = x; g1 = c; }
      else if (h < 180) { g1 = c; b1 = x; }
      else if (h < 240) { g1 = x; b1 = c; }
      else if (h < 300) { r1 = x; b1 = c; }
      else { r1 = c; b1 = x; }
      return [clamp(r1 + m, 0, 1), clamp(g1 + m, 0, 1), clamp(b1 + m, 0, 1)];
    }

    str = str.replace(/^#/, '');
    if (str.length === 3 || str.length === 4) {
      str = str
        .slice(0, 3)
        .split('')
        .map((c) => c + c)
        .join('');
    } else if (str.length === 8) {
      str = str.slice(0, 6);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(str)) {
      return [0.31, 0.27, 0.9];
    }
    const num = parseInt(str, 16);
    return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
  }

  const parseColor = parseHex;

  function rgbToHex(r, g, b) {
    const r8 = clamp(Math.round(r * 255), 0, 255);
    const g8 = clamp(Math.round(g * 255), 0, 255);
    const b8 = clamp(Math.round(b * 255), 0, 255);
    return (
      '#' +
      r8.toString(16).padStart(2, '0') +
      g8.toString(16).padStart(2, '0') +
      b8.toString(16).padStart(2, '0')
    );
  }

  function srgbToLinear(c) {
    const v = clamp(c, 0, 1);
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function linearToSrgb(cLin) {
    const v = Math.max(0, cLin);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1.0 / 2.4) - 0.055;
  }

  function getLinearLuminance(rLin, gLin, bLin) {
    return LUMA_R * rLin + LUMA_G * gLin + LUMA_B * bLin;
  }

  function hexToRelativeLuminance(hex) {
    const [r, g, b] = parseHex(hex);
    return getLinearLuminance(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
  }

  function getContrastRatio(colorA, colorB) {
    const yA = typeof colorA === 'number' ? colorA : hexToRelativeLuminance(colorA);
    const yB = typeof colorB === 'number' ? colorB : hexToRelativeLuminance(colorB);
    const l1 = Math.max(yA, yB);
    const l2 = Math.min(yA, yB);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  function getApcaContrast(textHex, bgHex) {
    const yText = hexToRelativeLuminance(textHex);
    const yBg = hexToRelativeLuminance(bgHex);
    if (Math.abs(yBg - yText) < 0.0005) return 0;
    if (yBg > yText) {
      const sapc = (Math.pow(yBg, 0.56) - Math.pow(yText, 0.62)) * 1.14;
      return sapc < 0.1 ? 0 : Math.round(sapc * 1000) / 10;
    } else {
      const sapc = (Math.pow(yBg, 0.57) - Math.pow(yText, 0.65)) * 1.14;
      return Math.abs(sapc) < 0.1 ? 0 : Math.round(Math.abs(sapc) * 1000) / 10;
    }
  }

  function linearRgbToOklab(rLin, gLin, bLin) {
    const l = M1[0][0] * rLin + M1[0][1] * gLin + M1[0][2] * bLin;
    const m = M1[1][0] * rLin + M1[1][1] * gLin + M1[1][2] * bLin;
    const s = M1[2][0] * rLin + M1[2][1] * gLin + M1[2][2] * bLin;
    const l_ = Math.cbrt(Math.max(0, l));
    const m_ = Math.cbrt(Math.max(0, m));
    const s_ = Math.cbrt(Math.max(0, s));
    const L = M2[0][0] * l_ + M2[0][1] * m_ + M2[0][2] * s_;
    const a = M2[1][0] * l_ + M2[1][1] * m_ + M2[1][2] * s_;
    const b = M2[2][0] * l_ + M2[2][1] * m_ + M2[2][2] * s_;
    return [L, a, b];
  }

  function oklabToLinearRgb(L, a, b) {
    const l_ = M2_INV[0][0] * L + M2_INV[0][1] * a + M2_INV[0][2] * b;
    const m_ = M2_INV[1][0] * L + M2_INV[1][1] * a + M2_INV[1][2] * b;
    const s_ = M2_INV[2][0] * L + M2_INV[2][1] * a + M2_INV[2][2] * b;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    const rLin = M1_INV[0][0] * l + M1_INV[0][1] * m + M1_INV[0][2] * s;
    const gLin = M1_INV[1][0] * l + M1_INV[1][1] * m + M1_INV[1][2] * s;
    const bLin = M1_INV[2][0] * l + M1_INV[2][1] * m + M1_INV[2][2] * s;
    return [rLin, gLin, bLin];
  }

  function oklabToOklch(L, a, b) {
    const C = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * RAD_TO_DEG;
    if (h < 0) h += 360;
    if (isNaN(h)) h = 0;
    return { l: L, c: C, h };
  }

  function oklchToOklab(l, c, h) {
    const rad = h * DEG_TO_RAD;
    return [l, c * Math.cos(rad), c * Math.sin(rad)];
  }

  function isInSrgbGamut(rLin, gLin, bLin, eps = 1e-4) {
    return (
      rLin >= -eps &&
      rLin <= 1 + eps &&
      gLin >= -eps &&
      gLin <= 1 + eps &&
      bLin >= -eps &&
      bLin <= 1 + eps
    );
  }

  function hexToOklch(hex) {
    const [r, g, b] = parseHex(hex);
    const [L, a, b_ok] = linearRgbToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
    return oklabToOklch(L, a, b_ok);
  }

  function gamutMapOklch(L, C, h, maxIterations = 24) {
    if (C <= 0.0001) return { l: L, c: 0, h };
    const rad = h * DEG_TO_RAD;
    const cosH = Math.cos(rad);
    const sinH = Math.sin(rad);

    const [testRLin, testGLin, testBLin] = oklabToLinearRgb(L, C * cosH, C * sinH);
    if (isInSrgbGamut(testRLin, testGLin, testBLin)) {
      return { l: L, c: C, h };
    }

    let low = 0;
    let high = C;
    for (let i = 0; i < maxIterations; i++) {
      const mid = (low + high) / 2;
      const [rL, gL, bL] = oklabToLinearRgb(L, mid * cosH, mid * sinH);
      if (isInSrgbGamut(rL, gL, bL)) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return { l: L, c: low, h };
  }

  function oklchToHex(l, c, h, options = {}) {
    const L = clamp(l, 0, 1);
    const C = Math.max(0, c);
    const mapped = gamutMapOklch(L, C, h, options.gamutIterations || 24);
    const [L_ok, a_ok, b_ok] = oklchToOklab(mapped.l, mapped.c, mapped.h);
    const [rLin, gLin, bLin] = oklabToLinearRgb(L_ok, a_ok, b_ok);
    return rgbToHex(
      clamp(linearToSrgb(rLin), 0, 1),
      clamp(linearToSrgb(gLin), 0, 1),
      clamp(linearToSrgb(bLin), 0, 1)
    );
  }

  function bendPerceptualHue(L, h, options = {}) {
    if (options.bendHue === false) return h;
    let normH = ((h % 360) + 360) % 360;
    if (normH >= 80 && normH <= 128) {
      const targetAmberHue = options.amberTargetHue ?? 68.5;
      const highThreshold = 0.82;
      const lowThreshold = 0.58;
      let w_L = 0;
      if (L <= lowThreshold) {
        w_L = 1.0;
      } else if (L < highThreshold) {
        const t = (highThreshold - L) / (highThreshold - lowThreshold);
        w_L = t * t * (3 - 2 * t);
      }
      if (w_L <= 0) return normH;

      let w_h = 1.0;
      if (normH < 90) {
        const u = (normH - 80) / 10;
        w_h = u * u * (3 - 2 * u);
      } else if (normH > 118) {
        const u = (128 - normH) / 10;
        w_h = u * u * (3 - 2 * u);
      }
      const totalWeight = w_L * w_h;
      return normH + (targetAmberHue - normH) * totalWeight;
    }
    return normH;
  }

  function findAccessibleLightness(bgLuminances, baseChroma, baseHue, options = {}) {
    const targetRatio = options.targetRatio ?? 4.5;
    const safetyBuffer = options.safetyBuffer ?? 0.05;
    const effectiveTarget = targetRatio + safetyBuffer;
    const maxIterations = options.bisectionIterations ?? 28;

    const avgBgY = bgLuminances.reduce((acc, y) => acc + y, 0) / Math.max(1, bgLuminances.length);
    const maxContrastWithWhite = (1.0 + 0.05) / (avgBgY + 0.05);
    const maxContrastWithBlack = (avgBgY + 0.05) / 0.05;

    let isLightText;
    if (options.polarity === 'light' || options.mode === 'light') {
      isLightText = true;
    } else if (options.polarity === 'dark' || options.mode === 'dark') {
      isLightText = false;
    } else {
      isLightText = maxContrastWithWhite > maxContrastWithBlack;
    }

    if (isLightText) {
      let lowL = Math.max(0.15, avgBgY);
      let highL = 0.99;
      for (let i = 0; i < maxIterations; i++) {
        const midL = (lowL + highL) / 2;
        const midH = bendPerceptualHue(midL, baseHue, options);
        const hex = oklchToHex(midL, baseChroma, midH, options);
        const yMid = hexToRelativeLuminance(hex);
        let satisfiesAll = true;
        for (const bgY of bgLuminances) {
          const cr = (Math.max(bgY, yMid) + 0.05) / (Math.min(bgY, yMid) + 0.05);
          if (cr < effectiveTarget) {
            satisfiesAll = false;
            break;
          }
        }
        if (satisfiesAll) {
          highL = midL;
        } else {
          lowL = midL;
        }
      }

      let finalL = highL;
      let finalH = bendPerceptualHue(finalL, baseHue, options);
      let finalHex = oklchToHex(finalL, baseChroma, finalH, options);

      for (let step = 0; step < 8; step++) {
        let minCr = Infinity;
        const yHex = hexToRelativeLuminance(finalHex);
        for (const bgY of bgLuminances) {
          const cr = (Math.max(bgY, yHex) + 0.05) / (Math.min(bgY, yHex) + 0.05);
          if (cr < minCr) minCr = cr;
        }
        if (minCr >= targetRatio) break;
        finalL = Math.min(0.99, finalL + 0.015);
        finalH = bendPerceptualHue(finalL, baseHue, options);
        finalHex = oklchToHex(finalL, baseChroma, finalH, options);
      }

      return { l: finalL, h: finalH, hex: finalHex };
    } else {
      let lowL = 0.02;
      let highL = Math.min(0.85, Math.max(0.05, avgBgY));
      for (let i = 0; i < maxIterations; i++) {
        const midL = (lowL + highL) / 2;
        const midH = bendPerceptualHue(midL, baseHue, options);
        const hex = oklchToHex(midL, baseChroma, midH, options);
        const yMid = hexToRelativeLuminance(hex);
        let satisfiesAll = true;
        for (const bgY of bgLuminances) {
          const cr = (Math.max(bgY, yMid) + 0.05) / (Math.min(bgY, yMid) + 0.05);
          if (cr < effectiveTarget) {
            satisfiesAll = false;
            break;
          }
        }
        if (satisfiesAll) {
          lowL = midL;
        } else {
          highL = midL;
        }
      }

      let finalL = lowL;
      let finalH = bendPerceptualHue(finalL, baseHue, options);
      let finalHex = oklchToHex(finalL, baseChroma, finalH, options);

      for (let step = 0; step < 8; step++) {
        let minCr = Infinity;
        const yHex = hexToRelativeLuminance(finalHex);
        for (const bgY of bgLuminances) {
          const cr = (Math.max(bgY, yHex) + 0.05) / (Math.min(bgY, yHex) + 0.05);
          if (cr < minCr) minCr = cr;
        }
        if (minCr >= targetRatio) break;
        finalL = Math.max(0.02, finalL - 0.015);
        finalH = bendPerceptualHue(finalL, baseHue, options);
        finalHex = oklchToHex(finalL, baseChroma, finalH, options);
      }

      return { l: finalL, h: finalH, hex: finalHex };
    }
  }

  function resolveAccessibleTextColor(bgHex, options = {}) {
    const bgY = hexToRelativeLuminance(bgHex);
    const targetRatio = options.targetRatio ?? 4.5;
    const defaultSeed = bgY < 0.179 ? '#F8FAFC' : '#0F172A';
    const seedHex = options.seedHex || defaultSeed;
    const seedOklch = hexToOklch(seedHex);
    return findAccessibleLightness([bgY], seedOklch.c, seedOklch.h, { targetRatio, ...options }).hex;
  }

  function generateLuminousSurfaces(seedOklch, options = {}) {
    const h = seedOklch.h;
    let canvasHex = '#FAF9F6';
    if (options.canvasHex) {
      canvasHex = options.canvasHex;
    } else if (options.canvasPreset) {
      switch (options.canvasPreset) {
        case 'warm-paper':
        case 'warm_paper':
          canvasHex = '#FAF9F6';
          break;
        case 'ivory':
          canvasHex = '#FDFBF7';
          break;
        case 'alabaster':
          canvasHex = '#F8F9FA';
          break;
        case 'titanium-ice':
        case 'titanium_ice':
          canvasHex = '#F8FAFC';
          break;
        default:
          canvasHex = '#FAF9F6';
      }
    } else {
      if (h >= 25 && h < 85) canvasHex = '#FAF9F6';
      else if (h >= 85 && h < 140) canvasHex = '#FDFBF7';
      else if (h >= 170 && h < 270) canvasHex = '#F8FAFC';
      else canvasHex = '#F8F9FA';
    }

    const canvasOklch = hexToOklch(canvasHex);
    const canvasY = hexToRelativeLuminance(canvasHex);
    const baseCanvasL = Math.max(0.965, canvasOklch.l);

    const cardHex = '#FFFFFF';
    const cardAcrylic = 'rgba(255, 255, 255, 0.85)';
    const cardBackdrop = 'blur(16px) saturate(180%)';
    const cardY = 1.0;

    const subSurfaceL = Math.max(0.942, baseCanvasL - 0.032);
    const subSurfaceC = Math.min(0.008, Math.max(0.003, seedOklch.c * 0.08));
    const subSurfaceHex = oklchToHex(subSurfaceL, subSurfaceC, h, options);

    const borderL = Math.max(0.84, baseCanvasL - 0.112);
    const borderC = Math.min(0.012, Math.max(0.004, seedOklch.c * 0.1));
    const borderSolidHex = oklchToHex(borderL, borderC, h, options);
    const borderTranslucent = 'rgba(15, 23, 42, 0.085)';
    const borderTranslucentOklch = `oklch(0.25 ${Math.round(seedOklch.c * 0.05 * 1000) / 1000} ${Math.round(h)} / 0.085)`;

    const insetHighlightOpacity = clamp(options.insetOpacity ?? 0.92, 0.9, 0.95);
    const insetHighlight = `rgba(255, 255, 255, ${insetHighlightOpacity})`;
    const boxShadowInset = `inset 0 1px 0 ${insetHighlight}`;
    const shadowAmbient = '0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.04)';
    const shadowKey = '0 12px 28px -4px rgba(0, 0, 0, 0.05)';
    const shadowCard = `${boxShadowInset}, ${shadowAmbient}, ${shadowKey}`;

    return {
      canvas: canvasHex,
      canvasOklch: { l: baseCanvasL, c: canvasOklch.c, h: canvasOklch.h },
      canvasY,
      card: cardHex,
      cardAcrylic,
      cardBackdrop,
      cardY,
      subSurface: subSurfaceHex,
      subSurfaceOklch: { l: subSurfaceL, c: subSurfaceC, h },
      border: borderSolidHex,
      borderTranslucent,
      borderTranslucentOklch,
      borderDeltaL: baseCanvasL - borderL,
      insetHighlight,
      boxShadowInset,
      shadowAmbient,
      shadowKey,
      shadowCard,
    };
  }

  function generateLuminousAccent(seedHex, surfaces, options = {}) {
    const seedOklch = hexToOklch(seedHex);
    const mappedSeed = gamutMapOklch(seedOklch.l, seedOklch.c, seedOklch.h);
    const solidHex = oklchToHex(mappedSeed.l, mappedSeed.c, mappedSeed.h, options);

    const contrastAgainstDark = getContrastRatio(solidHex, '#0F172A');
    const contrastAgainstWhite = getContrastRatio(solidHex, '#FFFFFF');
    const solidFg = contrastAgainstDark >= contrastAgainstWhite ? '#0F172A' : '#FFFFFF';
    const solidFgContrast = Math.max(contrastAgainstDark, contrastAgainstWhite);

    const hoverShiftL = mappedSeed.l > 0.6 ? -0.05 : +0.06;
    const activeShiftL = mappedSeed.l > 0.6 ? -0.09 : +0.1;
    const solidHover = oklchToHex(clamp(mappedSeed.l + hoverShiftL, 0.05, 0.95), mappedSeed.c, mappedSeed.h, options);
    const solidActive = oklchToHex(clamp(mappedSeed.l + activeShiftL, 0.05, 0.95), mappedSeed.c, mappedSeed.h, options);

    const bgLuminances = [surfaces.canvasY, surfaces.cardY];
    const textAA = findAccessibleLightness(bgLuminances, mappedSeed.c, mappedSeed.h, { targetRatio: 4.5, ...options });
    const textAAA = findAccessibleLightness(bgLuminances, mappedSeed.c, mappedSeed.h, { targetRatio: 7.0, ...options });

    const subtleL = 0.952;
    const subtleC = Math.min(0.045, Math.max(0.02, mappedSeed.c * 0.28));
    const subtleHex = oklchToHex(subtleL, subtleC, mappedSeed.h, options);
    const subtleBorder = oklchToHex(0.885, subtleC * 1.3, mappedSeed.h, options);
    const subtleFgResult = findAccessibleLightness([hexToRelativeLuminance(subtleHex)], mappedSeed.c, mappedSeed.h, { targetRatio: 4.5, ...options });

    return {
      solid: solidHex,
      solidFg,
      solidFgContrast,
      solidHover,
      solidActive,
      text: textAA.hex,
      textOklch: { l: textAA.l, c: mappedSeed.c, h: textAA.h },
      textContrastOnCanvas: getContrastRatio(textAA.hex, surfaces.canvas),
      textContrastOnCard: getContrastRatio(textAA.hex, surfaces.card),
      textApcaOnCanvas: getApcaContrast(textAA.hex, surfaces.canvas),
      textApcaOnCard: getApcaContrast(textAA.hex, surfaces.card),
      textAAA: textAAA.hex,
      textAAAContrastOnCanvas: getContrastRatio(textAAA.hex, surfaces.canvas),
      textAAAContrastOnCard: getContrastRatio(textAAA.hex, surfaces.card),
      subtle: subtleHex,
      subtleBorder,
      subtleFg: subtleFgResult.hex,
    };
  }

  function generateLuminousNeutrals(seedOklch, surfaces, options = {}) {
    const h = seedOklch.h;
    const subtleNeutralC = Math.min(0.015, seedOklch.c * 0.08);

    const textPrimary = oklchToHex(0.2, subtleNeutralC, h, options);
    const textSecondary = oklchToHex(0.42, subtleNeutralC, h, options);
    const textMuted = oklchToHex(0.56, subtleNeutralC * 0.8, h, options);
    const borderMuted = oklchToHex(0.915, subtleNeutralC * 0.5, h, options);

    return {
      textPrimary,
      textSecondary,
      textMuted,
      borderMuted,
      textPrimaryContrastOnCanvas: getContrastRatio(textPrimary, surfaces.canvas),
      textSecondaryContrastOnCanvas: getContrastRatio(textSecondary, surfaces.canvas),
      textMutedContrastOnCanvas: getContrastRatio(textMuted, surfaces.canvas),
    };
  }

  function getCssVariablesMap(palette, options = {}) {
    const prefix = options.prefix ?? 'luminous-';
    const p = (name) => `--${prefix}${name}`;
    return {
      [p('seed')]: palette.seed.hex,
      [p('canvas')]: palette.surfaces.canvas,
      [p('card')]: palette.surfaces.card,
      [p('card-acrylic')]: palette.surfaces.cardAcrylic,
      [p('card-backdrop')]: palette.surfaces.cardBackdrop,
      [p('sub-surface')]: palette.surfaces.subSurface,
      [p('border')]: palette.surfaces.border,
      [p('border-translucent')]: palette.surfaces.borderTranslucent,
      [p('inset-highlight')]: palette.surfaces.insetHighlight,
      [p('box-shadow-card')]: palette.surfaces.shadowCard,
      [p('accent-solid')]: palette.accent.solid,
      [p('accent-solid-fg')]: palette.accent.solidFg,
      [p('accent-solid-hover')]: palette.accent.solidHover,
      [p('accent-solid-active')]: palette.accent.solidActive,
      [p('accent-text')]: palette.accent.text,
      [p('accent-text-aaa')]: palette.accent.textAAA,
      [p('accent-subtle')]: palette.accent.subtle,
      [p('accent-subtle-fg')]: palette.accent.subtleFg,
      [p('accent-subtle-border')]: palette.accent.subtleBorder,
      [p('text-primary')]: palette.neutrals.textPrimary,
      [p('text-secondary')]: palette.neutrals.textSecondary,
      [p('text-muted')]: palette.neutrals.textMuted,
      [p('border-muted')]: palette.neutrals.borderMuted,
    };
  }

  function generateLuminousPalette(seedHex, options = {}) {
    const [r, g, b] = parseHex(seedHex);
    const normalizedSeedHex = rgbToHex(r, g, b);
    const seedOklch = hexToOklch(normalizedSeedHex);
    const seedLuminance = hexToRelativeLuminance(normalizedSeedHex);

    const surfaces = generateLuminousSurfaces(seedOklch, options);
    const accent = generateLuminousAccent(normalizedSeedHex, surfaces, options);
    const neutrals = generateLuminousNeutrals(seedOklch, surfaces, options);

    const palette = {
      seed: {
        hex: normalizedSeedHex,
        rgb: { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) },
        oklch: seedOklch,
        luminance: seedLuminance,
      },
      surfaces,
      accent,
      neutrals,
      metrics: {
        canvasLuminance: surfaces.canvasY,
        cardLuminance: surfaces.cardY,
        solidContrastFg: accent.solidFgContrast,
        textContrastOnCanvas: accent.textContrastOnCanvas,
        textContrastOnCard: accent.textContrastOnCard,
        textApcaOnCanvas: accent.textApcaOnCanvas,
        textApcaOnCard: accent.textApcaOnCard,
        textAAAContrastOnCanvas: accent.textAAAContrastOnCanvas,
        textAAAContrastOnCard: accent.textAAAContrastOnCard,
        borderDeltaL: surfaces.borderDeltaL,
      },
    };

    palette.cssVariables = getCssVariablesMap(palette, options);
    return palette;
  }

  function getCssVariables(palette, options = {}) {
    const map =
      options && (options.prefix !== undefined || !palette.cssVariables)
        ? getCssVariablesMap(palette, options)
        : palette.cssVariables || getCssVariablesMap(palette, options);
    if (options.asObject) return map;
    const selector = options.selector ?? ':root';
    const lines = Object.entries(map).map(([k, v]) => `  ${k}: ${v};`);
    return `${selector} {\n${lines.join('\n')}\n}`;
  }

  return {
    version: '2.0.0',
    generateLuminousPalette,
    getCssVariables,
    resolveAccessibleTextColor,
    hexToOklch,
    oklchToHex,
    hexToRelativeLuminance,
    getContrastRatio,
    getApcaContrast,
    gamutMapOklch,
    bendPerceptualHue,
    findAccessibleLightness,
    generateLuminousSurfaces,
    generateLuminousAccent,
    generateLuminousNeutrals,
    parseHex,
    parseColor,
    rgbToHex,
    srgbToLinear,
    linearToSrgb,
    linearRgbToOklab,
    oklabToLinearRgb,
    oklabToOklch,
    oklchToOklab,
  };
});
