import CrossFrameworkTokenExporter, {
  exportTailwindV3,
  exportTailwindV4,
  exportCssVariables,
  exportW3CDtcgJson,
  exportTypeScriptDeclarations,
  exportTokenBundle,
  sanitizeTokenKey,
  kebabToCamel,
  inferTokenType,
  extractCssVariablesMap,
} from './cross_token_exporter.js';

// Verify functions exist
const k: string = sanitizeTokenKey('--bg-canvas');
const c: string = kebabToCamel('bg-canvas');
const t: string = inferTokenType('bg-canvas', '#FAF9F6');
const vars: Record<string, string> = extractCssVariablesMap({ canvas: '#FAF9F6' });

const theme = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
  highlight: 'rgba(255,255,255,0.95)',
};

const tw3 = exportTailwindV3(theme);
const tw4 = exportTailwindV4(theme);
const css = exportCssVariables(theme);
const dtcg = exportW3CDtcgJson(theme);
const ts = exportTypeScriptDeclarations(theme);
const bundle = exportTokenBundle(theme);

console.log('TypeScript types verified cleanly:', {
  tw3Ready: !!tw3.rawString,
  tw4Ready: !!tw4,
  cssReady: !!css.rawCss,
  dtcgReady: !!dtcg.rawJson,
  tsReady: !!ts.rawTypeScript,
  bundleVersion: bundle.version,
});
