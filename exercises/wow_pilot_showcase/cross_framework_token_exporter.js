/**
 * ⚡ CROSS-FRAMEWORK TOKEN EXPORTER (UMD / Standalone Global Bundle)
 * =================================================================
 * Antigravity 2.0 Generative Studio Showcase V4
 * Exports Luminous Design Tokens to 5 Standard Framework Formats:
 *   1. Tailwind CSS v3 (module.exports = { theme: { extend: ... } })
 *   2. Tailwind CSS v4 (@theme { --color-... })
 *   3. Native CSS Custom Properties (:root { --... })
 *   4. DTCG (Design Tokens Community Group W3C Standard JSON)
 *   5. TypeScript Type Definitions (.d.ts)
 *
 * @license Apache-2.0
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exp = factory();
    global.CrossFrameworkTokenExporter = exp;
    global.exportTokens = exp.exportTokens;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const DEFAULT_TOKENS = {
    canvas: '#FAF9F6',
    surface: '#FFFFFF',
    acrylic: 'rgba(255, 255, 255, 0.82)',
    borderSpecular: 'rgba(255, 255, 255, 0.95)',
    borderHairline: 'rgba(226, 232, 240, 0.85)',
    borderStrong: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    accentPrimary: '#0284C7',
    accentBlue: '#2563EB',
    accentEmerald: '#059669',
    accentAmber: '#D97706',
    blurGlass: '20px',
    springTension: 180,
    springDamping: 12,
    tiltMaxDeg: 8,
    spotlightRadius: '500px'
  };

  function normalizeTokens(input = {}) {
    return Object.assign({}, DEFAULT_TOKENS, input);
  }

  /**
   * 1. Tailwind CSS v3 Config Exporter
   */
  function toTailwindV3(tokens) {
    const t = normalizeTokens(tokens);
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: '${t.canvas}',
        surface: '${t.surface}',
        acrylic: '${t.acrylic}',
        border: {
          specular: '${t.borderSpecular}',
          hairline: '${t.borderHairline}',
          strong: '${t.borderStrong}',
        },
        luminous: {
          primary: '${t.textPrimary}',
          secondary: '${t.textSecondary}',
          muted: '${t.textMuted}',
          accent: '${t.accentPrimary}',
          blue: '${t.accentBlue}',
          emerald: '${t.accentEmerald}',
          amber: '${t.accentAmber}'
        }
      },
      backdropBlur: {
        glass: '${t.blurGlass}'
      }
    }
  }
};`;
  }

  /**
   * 2. Tailwind CSS v4 @theme Exporter
   */
  function toTailwindV4(tokens) {
    const t = normalizeTokens(tokens);
    return `@theme {
  --color-canvas: ${t.canvas};
  --color-surface: ${t.surface};
  --color-acrylic: ${t.acrylic};
  --color-border-specular: ${t.borderSpecular};
  --color-border-hairline: ${t.borderHairline};
  --color-border-strong: ${t.borderStrong};
  --color-text-primary: ${t.textPrimary};
  --color-text-secondary: ${t.textSecondary};
  --color-text-muted: ${t.textMuted};
  --color-accent-primary: ${t.accentPrimary};
  --blur-glass: ${t.blurGlass};
  --spotlight-radius: ${t.spotlightRadius};
}`;
  }

  /**
   * 3. CSS Variables Exporter (:root)
   */
  function toCssVariables(tokens) {
    const t = normalizeTokens(tokens);
    return `:root {
  /* Luminous Multi-Layer Surfaces */
  --bg-canvas: ${t.canvas};
  --bg-surface: ${t.surface};
  --bg-acrylic: ${t.acrylic};
  --border-specular: ${t.borderSpecular};
  --border-hairline: ${t.borderHairline};
  --border-hairline-strong: ${t.borderStrong};

  /* Typography & Accents */
  --text-primary: ${t.textPrimary};
  --text-secondary: ${t.textSecondary};
  --text-muted: ${t.textMuted};
  --accent-primary: ${t.accentPrimary};

  /* Physics & Optics */
  --blur-glass: ${t.blurGlass};
  --spring-tension: ${t.springTension};
  --spring-damping: ${t.springDamping};
  --tilt-max-deg: ${t.tiltMaxDeg}deg;
  --spotlight-radius: ${t.spotlightRadius};
}`;
  }

  /**
   * 4. DTCG (Design Tokens Community Group W3C Standard JSON)
   */
  function toDtcgJson(tokens) {
    const t = normalizeTokens(tokens);
    const dtcg = {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      color: {
        canvas: {
          $value: t.canvas,
          $type: 'color',
          $description: 'Luminous light theme base canvas background'
        },
        surface: {
          $value: t.surface,
          $type: 'color',
          $description: 'Elevated luminous pure card surface'
        },
        acrylic: {
          $value: t.acrylic,
          $type: 'color',
          $description: 'Frosted acrylic glass panel surface'
        },
        border: {
          specular: {
            $value: t.borderSpecular,
            $type: 'color'
          },
          hairline: {
            $value: t.borderHairline,
            $type: 'color'
          },
          strong: {
            $value: t.borderStrong,
            $type: 'color'
          }
        },
        accent: {
          primary: {
            $value: t.accentPrimary,
            $type: 'color'
          }
        }
      },
      dimension: {
        blurGlass: {
          $value: t.blurGlass,
          $type: 'dimension'
        },
        spotlightRadius: {
          $value: t.spotlightRadius,
          $type: 'dimension'
        }
      },
      physics: {
        springTension: {
          $value: t.springTension,
          $type: 'number'
        },
        springDamping: {
          $value: t.springDamping,
          $type: 'number'
        },
        tiltMaxDeg: {
          $value: t.tiltMaxDeg,
          $type: 'number'
        }
      }
    };
    return JSON.stringify(dtcg, null, 2);
  }

  /**
   * 5. TypeScript .d.ts Exporter
   */
  function toTypeScriptDts(tokens) {
    const t = normalizeTokens(tokens);
    return `/**
 * Antigravity 2.0 // Luminous Light Design Tokens
 * Generated by CrossFrameworkTokenExporter v4.0.0
 */

export interface LuminousColorTokens {
  canvas: '${t.canvas}' | string;
  surface: '${t.surface}' | string;
  acrylic: '${t.acrylic}' | string;
  borderSpecular: '${t.borderSpecular}' | string;
  borderHairline: '${t.borderHairline}' | string;
  borderStrong: '${t.borderStrong}' | string;
  textPrimary: '${t.textPrimary}' | string;
  textSecondary: '${t.textSecondary}' | string;
  textMuted: '${t.textMuted}' | string;
  accentPrimary: '${t.accentPrimary}' | string;
}

export interface LuminousPhysicsTokens {
  springTension: number;
  springDamping: number;
  tiltMaxDeg: number;
  spotlightRadius: string;
}

export interface LuminousDesignTokens {
  colors: LuminousColorTokens;
  physics: LuminousPhysicsTokens;
  blurGlass: string;
}

export declare const luminousTokens: LuminousDesignTokens;
export default luminousTokens;`;
  }

  /**
   * Main export dispatcher
   * @param {Object} tokens
   * @param {'tailwind-v3'|'tailwind-v4'|'css'|'dtcg'|'typescript'} format
   * @returns {string}
   */
  function exportTokens(tokens, format = 'css') {
    switch (format.toLowerCase()) {
      case 'tailwind-v3':
      case 'tailwind3':
      case 'tw3':
        return toTailwindV3(tokens);
      case 'tailwind-v4':
      case 'tailwind4':
      case 'tw4':
        return toTailwindV4(tokens);
      case 'css':
      case 'css-vars':
      case 'cssvariables':
        return toCssVariables(tokens);
      case 'dtcg':
      case 'json':
      case 'dtcg-json':
        return toDtcgJson(tokens);
      case 'typescript':
      case 'dts':
      case 'ts':
        return toTypeScriptDts(tokens);
      default:
        return toCssVariables(tokens);
    }
  }

  function exportAll(tokens) {
    return {
      tailwindV3: toTailwindV3(tokens),
      tailwindV4: toTailwindV4(tokens),
      cssVariables: toCssVariables(tokens),
      dtcgJson: toDtcgJson(tokens),
      typeScriptDts: toTypeScriptDts(tokens)
    };
  }

  const FORMATS = [
    { id: 'css', name: 'CSS Variables (:root)', mode: 'css' },
    { id: 'tailwind-v3', name: 'Tailwind CSS v3 (Config)', mode: 'javascript' },
    { id: 'tailwind-v4', name: 'Tailwind CSS v4 (@theme)', mode: 'css' },
    { id: 'dtcg', name: 'DTCG W3C JSON', mode: 'json' },
    { id: 'typescript', name: 'TypeScript (.d.ts)', mode: 'typescript' }
  ];

  const CrossFrameworkTokenExporter = {
    version: '4.0.0',
    exportTokens,
    exportAll,
    toTailwindV3,
    toTailwindV4,
    toCssVariables,
    toDtcgJson,
    toTypeScriptDts,
    FORMATS,
    DEFAULT_TOKENS
  };

  return CrossFrameworkTokenExporter;
});
