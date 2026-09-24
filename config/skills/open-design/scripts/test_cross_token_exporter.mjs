/**
 * 🧪 TEST SUITE FOR CROSS-FRAMEWORK TOKEN EXPORTER
 * ==================================================
 * Comprehensive tests for:
 * 1. Token normalization & AST construction (from LuminousThemeContract, PageAssemblySchema, CSS string, or raw schema)
 * 2. Key sanitization (sanitizeTailwindKey anti-regex prefix bug, toTokenId)
 * 3. Inverse token mapping & DTCG pointer resolution ({color.surface}, composite shadows)
 * 4. Export Target 1: Tailwind CSS v3 (theme.extend: colors, boxShadow, blur, borderRadius, animation, keyframes)
 * 5. Export Target 2: Tailwind CSS v4 (@theme CSS directives with --color-*, --shadow-*, and aliasTo inheritance)
 * 6. Export Target 3: CSS Custom Properties (:root stylesheet with 9 visual groupings matching tokens.css)
 * 7. Export Target 4: W3C DTCG Design Tokens JSON ($value, $type, hierarchical nesting)
 * 8. Export Target 5: TypeScript Declarations (.d.ts with union types & const token map)
 * 9. Master Export Bundle (5 targets simultaneously + SHA-256 checksum)
 * 10. Class-Based Engine Usage & Dynamic Token Updates
 * 11. UMD bundle sandbox execution (CommonJS require + window / globalThis integration)
 * 12. Complex composite tokens (multi-layer shadows, color-mix, custom keyframes)
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

import {
  CrossFrameworkTokenExporter,
  STANDARD_TOKEN_SCHEMA,
  CATEGORY_ORDER,
  DEFAULT_KEYFRAMES,
  DEFAULT_ANIMATIONS,
  fromLuminousThemeContract,
  parseCssToTokenContractAST,
  normalizeTokenContractAST,
  sanitizeTailwindKey,
  toTokenId,
  mapToTailwindV4VarName,
  buildInverseTokenMap,
  resolveDtcgPointer,
  exportTailwindV3,
  exportTailwindV4,
  exportCssVariables,
  exportW3CDtcgJson,
  exportTypeScriptDeclarations,
  exportTokenBundle,
} from './cross_token_exporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

console.log('\n======================================================');
console.log('⚡ STARTING CROSS-FRAMEWORK TOKEN EXPORTER TEST SUITE');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// 1. Key Sanitization & Helper Functions
// -----------------------------------------------------------------------------
console.log('--- 1. Key Sanitization & Regex Prefix Bug Prevention ---');
assert(sanitizeTailwindKey('--bg', 'colors') === 'bg', '--bg sanitizes to "bg" (not empty string)');
assert(sanitizeTailwindKey('--surface', 'colors') === 'surface', '--surface sanitizes to "surface" (not empty string)');
assert(sanitizeTailwindKey('--border', 'colors') === 'border', '--border sanitizes to "border" (not empty string)');
assert(sanitizeTailwindKey('--color-accent-solid', 'colors') === 'accent-solid', 'Sanitizes tailwind color key');
assert(sanitizeTailwindKey('--shadow-card', 'boxShadow') === 'card', 'Sanitizes tailwind shadow key');
assert(sanitizeTailwindKey('--elev-raised', 'boxShadow') === 'raised', 'Sanitizes elev- prefix to raised');
assert(sanitizeTailwindKey('--radius-lg', 'borderRadius') === 'lg', 'Sanitizes tailwind radius key');
assert(sanitizeTailwindKey('--radius-pill', 'borderRadius') === 'pill', 'Sanitizes radius-pill to pill');
assert(sanitizeTailwindKey('--space-4', 'spacing') === '4', 'Sanitizes space-4 to 4');
assert(toTokenId('--bg-canvas') === 'bgCanvas', 'Normalizes to camelCase token ID');
assert(toTokenId('border-luminous') === 'borderLuminous', 'Normalizes to camelCase token ID');
assert(mapToTailwindV4VarName({ name: '--bg', type: 'color' }) === '--color-bg', 'Maps --bg to --color-bg for v4');
assert(mapToTailwindV4VarName({ name: '--radius-lg', type: 'dimension' }) === '--radius-lg', 'Preserves radius prefix for v4');
assert(mapToTailwindV4VarName({ name: '--space-4', type: 'dimension' }) === '--spacing-4', 'Maps space to spacing for v4');

// -----------------------------------------------------------------------------
// 2. Token AST Normalization & Contract Adaptations
// -----------------------------------------------------------------------------
console.log('\n--- 2. Token AST Normalization & Contract Adaptations ---');
const sampleTheme = {
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.06)',
  highlight: 'rgba(255, 255, 255, 0.95)',
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
  },
  accent: {
    primary: '#2563EB',
    hover: '#1D4ED8',
    glow: 'rgba(37, 99, 235, 0.25)',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 12px rgba(0, 0, 0, 0.05)',
    lg: '0 12px 28px -4px rgba(0, 0, 0, 0.04)',
    ambient: '0 8px 32px rgba(0, 0, 0, 0.04)',
    key: '0 1px 3px rgba(0, 0, 0, 0.06)',
  },
  customTokens: {
    'custom-brand-badge': '#f59e0b',
  },
};

const astFromTheme = fromLuminousThemeContract(sampleTheme);
assert(astFromTheme && Array.isArray(astFromTheme.tokens), 'Creates token array in AST');
assert(astFromTheme.tokens.some((t) => t.name === '--bg' && t.value === '#FAF9F6'), 'Populates --bg canvas in AST');
assert(astFromTheme.tokens.some((t) => t.name === '--surface' && t.value === '#FFFFFF'), 'Populates --surface in AST');
assert(astFromTheme.tokens.some((t) => t.name === '--accent' && t.value === '#2563EB'), 'Populates --accent in AST');
assert(astFromTheme.tokens.some((t) => t.name === '--custom-brand-badge' && t.value === '#f59e0b'), 'Custom token preserved');

// Normalization from PageAssemblySchema
const pageSchema = {
  metadata: { title: 'Agentic Workflow' },
  theme: sampleTheme,
};
const astFromSchema = normalizeTokenContractAST(pageSchema);
assert(astFromSchema.meta.name === 'Agentic Workflow', 'Schema title propagated to AST meta');

// Normalization from raw CSS
const rawCssInput = `
  :root {
    --bg: #0b1020;
    --surface: #131b2f;
    --accent: #60a5fa;
  }
`;
const astFromCss = parseCssToTokenContractAST(rawCssInput);
assert(astFromCss.tokens.length === 3, 'Parsed 3 tokens from raw CSS string');

// Normalization from null
const defaultAst = normalizeTokenContractAST(null);
assert(defaultAst.tokens.length >= 40, 'Default AST contains standard token catalog');

// -----------------------------------------------------------------------------
// 3. Inverse Token Map & Pointer Resolution
// -----------------------------------------------------------------------------
console.log('\n--- 3. Inverse Token Map & DTCG Pointer Resolution ---');
const invMap = buildInverseTokenMap(astFromTheme.tokens);
assert(invMap.size > 0, 'Builds inverse token map for value references');
assert(invMap.get('--surface') === 'color.surface', 'Maps --surface to color.surface');
assert(invMap.get('--border') === 'color.border', 'Maps --border to color.border');

const resolvedPointer = resolveDtcgPointer('var(--bg)', invMap);
assert(resolvedPointer === '{color.bg}', 'Resolves var(--bg) to {color.bg}');

const resolvedComposite = resolveDtcgPointer('0 0 0 1px var(--border)', invMap);
assert(resolvedComposite === '0 0 0 1px {color.border}', 'Resolves composite pointer expression');

// -----------------------------------------------------------------------------
// 4. Target 1: Tailwind CSS v3 Export
// -----------------------------------------------------------------------------
console.log('\n--- 4. Target 1: Tailwind CSS v3 Export ---');
const tw3 = exportTailwindV3(astFromTheme, { format: 'cjs' });
assert(tw3 && tw3.theme && tw3.theme.extend, 'Generates valid theme.extend structure');
assert(tw3.theme.extend.colors.bg === 'var(--bg)', 'Tailwind v3 colors contains bg');
assert(tw3.theme.extend.colors.surface === 'var(--surface)', 'Tailwind v3 colors contains surface');
assert(tw3.theme.extend.boxShadow.md === 'var(--shadow-md)', 'Tailwind v3 boxShadow contains md');
assert(typeof tw3.theme.extend.borderRadius === 'object', 'Generates borderRadius map');
assert(tw3.theme.extend.blur.glass === '12px', 'Generates blur glass preset');
assert(typeof tw3.theme.extend.animation === 'object', 'Generates animation map');
assert(typeof tw3.theme.extend.keyframes === 'object', 'Generates keyframes map');
assert(tw3.rawString.includes('module.exports ='), 'Generates rawString with module.exports');

// Evaluate in VM
const vmSandbox = { module: { exports: {} } };
vm.createContext(vmSandbox);
vm.runInContext(tw3.rawString, vmSandbox);
assert(vmSandbox.module.exports.theme.extend.colors.bg === 'var(--bg)', 'CJS export string executes cleanly in Node VM');

// ESM format test
const tw3Esm = exportTailwindV3(astFromTheme, { format: 'esm' });
assert(tw3Esm.rawString.startsWith("/** @type {import('tailwindcss').Config} */\nexport default"), 'ESM export starts with export default');

// -----------------------------------------------------------------------------
// 5. Target 2: Tailwind CSS v4 Export & Alias Preservation
// -----------------------------------------------------------------------------
console.log('\n--- 5. Target 2: Tailwind CSS v4 Export & Alias Preservation ---');
const aliasAst = normalizeTokenContractAST({
  tokens: [
    { name: '--surface', value: '#131b2f', category: 'surfaces', type: 'color' },
    { name: '--surface-warm', value: '', aliasTo: 'var(--surface)', category: 'surfaces', type: 'color' },
    { name: '--fg', value: '#f8fafc', category: 'foregrounds', type: 'color' },
    { name: '--fg-2', value: '', aliasTo: 'var(--fg)', category: 'foregrounds', type: 'color' },
    { name: '--border', value: '#293653', category: 'borders', type: 'color' },
    { name: '--border-soft', value: '', aliasTo: 'var(--border)', category: 'borders', type: 'color' },
    { name: '--accent', value: '#60a5fa', category: 'accents', type: 'color' },
    { name: '--accent-hover', value: 'color-mix(in oklab, var(--accent), black 8%)', category: 'accents', type: 'color' },
    { name: '--elev-ring', value: '0 0 0 1px var(--border)', category: 'elevation', type: 'shadow' },
    { name: '--elev-raised', value: '0 24px 72px rgba(0, 0, 0, 0.36)', category: 'elevation', type: 'shadow' },
    { name: '--radius-md', value: '12px', category: 'elevation', type: 'dimension' },
    { name: '--space-4', value: '16px', category: 'spacing', type: 'dimension' },
  ],
});

const tw4 = exportTailwindV4(aliasAst);
assert(tw4 && typeof tw4.rawCss === 'string', 'Generates rawCss for Tailwind v4');
assert(tw4.rawCss.includes('@theme {'), 'Contains @theme CSS block');
assert(tw4.themeVariables['--color-surface'] === '#131b2f', '--surface mapped to --color-surface');
assert(tw4.themeVariables['--color-surface-warm'] === 'var(--color-surface)', 'aliasTo var(--surface) rewritten to var(--color-surface)');
assert(tw4.themeVariables['--color-fg-2'] === 'var(--color-fg)', 'aliasTo var(--fg) rewritten to var(--color-fg)');
assert(tw4.themeVariables['--color-border-soft'] === 'var(--color-border)', 'aliasTo var(--border) rewritten to var(--color-border)');
assert(
  tw4.themeVariables['--color-accent-hover'] === 'color-mix(in oklab, var(--color-accent), black 8%)',
  'color-mix internal var(--accent) rewritten to var(--color-accent)'
);
assert(tw4.themeVariables['--shadow-ring'] === '0 0 0 1px var(--color-border)', 'Composite shadow var(--border) rewritten to var(--color-border)');
assert(tw4.themeVariables['--shadow-raised'] === '0 24px 72px rgba(0, 0, 0, 0.36)', '--elev-raised mapped to --shadow-raised');
assert(tw4.themeVariables['--radius-md'] === '12px', '--radius-md preserved');
assert(tw4.themeVariables['--spacing-4'] === '16px', '--space-4 mapped to --spacing-4');
assert(tw4.rawCss.includes('--ease-standard: cubic-bezier(0.2, 0, 0, 1);'), 'Includes standard easing curve in @theme');

// -----------------------------------------------------------------------------
// 6. Target 3: CSS Custom Properties Export (tokens.css standard)
// -----------------------------------------------------------------------------
console.log('\n--- 6. Target 3: CSS Custom Properties (:root) Export ---');
const cssVars = exportCssVariables(astFromTheme, { brandName: 'Agentic' });
assert(cssVars && typeof cssVars.rawCss === 'string', 'Generates rawCss string');
assert(cssVars.rawCss.includes(':root {'), 'Wraps variables in :root');
assert(cssVars.rawCss.includes('/* design-systems/agentic/tokens.css'), 'Includes standard file header');
for (const cat of ['Surfaces', 'Foregrounds', 'Borders', 'Accents', 'Semantics', 'Typography', 'Spacing', 'Elevation', 'Motion']) {
  assert(cssVars.rawCss.includes(`/* ─── ${cat}`), `Groups variables into ${cat} section`);
}
assert(cssVars.rawCss.includes('--bg: #FAF9F6;'), 'Contains --bg variable definition');
assert(typeof cssVars.rootVariables === 'object', 'Returns flat rootVariables map');

// -----------------------------------------------------------------------------
// 7. Target 4: W3C DTCG Design Tokens JSON Export
// -----------------------------------------------------------------------------
console.log('\n--- 7. Target 4: W3C DTCG Design Tokens JSON Export ---');
const dtcg = exportW3CDtcgJson(aliasAst);
assert(dtcg && typeof dtcg.tokens === 'object', 'Generates tokens object');
assert(dtcg.tokens.color && dtcg.tokens.color.surface, 'Nests tokens into color.surface hierarchy');
assert(dtcg.tokens.color.surface.$value === '#131b2f', 'Sets $value to #131b2f');
assert(dtcg.tokens.color.surface.$type === 'color', 'Sets $type to color');
assert(dtcg.tokens.color.surfaceWarm.$value === '{color.surface}', 'Resolves alias pointer {color.surface}');
assert(dtcg.tokens.color.fg2.$value === '{color.fg}', 'Resolves alias pointer {color.fg}');
assert(dtcg.tokens.color.borderSoft.$value === '{color.border}', 'Resolves alias pointer {color.border}');
assert(dtcg.tokens.spacing.space4.$value === '16px', 'Sets dimension for spacing.space4');
assert(dtcg.tokens.shadow.raised.$type === 'shadow', 'Sets shadow type for shadow.raised');

const dtcgJsonParsed = JSON.parse(dtcg.rawJson);
assert(dtcgJsonParsed.color.surfaceWarm.$value === '{color.surface}', 'rawJson is valid parseable JSON');

// -----------------------------------------------------------------------------
// 8. Target 5: TypeScript Declarations Export
// -----------------------------------------------------------------------------
console.log('\n--- 8. Target 5: TypeScript Declarations Export ---');
const tsTokens = exportTypeScriptDeclarations(astFromTheme);
assert(tsTokens && typeof tsTokens.rawTypeScript === 'string', 'Generates rawTypeScript string');
assert(tsTokens.rawTypeScript.includes('export type DesignTokenCssVariable ='), 'Includes DesignTokenCssVariable union');
assert(tsTokens.rawTypeScript.includes("'--bg'"), 'DesignTokenCssVariable contains --bg');
assert(tsTokens.rawTypeScript.includes('export type DesignTokenId ='), 'Includes DesignTokenId union');
assert(tsTokens.rawTypeScript.includes("'bg'"), 'DesignTokenId contains bg');
assert(tsTokens.rawTypeScript.includes('export type ColorTokenVariable ='), 'Includes ColorTokenVariable union');
assert(tsTokens.rawTypeScript.includes("'--accent'"), 'ColorTokenVariable contains --accent');
assert(tsTokens.rawTypeScript.includes('DESIGN_TOKENS'), 'Includes DESIGN_TOKENS constant map');
assert(tsTokens.rawTypeScript.includes('CSS_VARIABLES'), 'Includes CSS_VARIABLES map');

// -----------------------------------------------------------------------------
// 9. Master Bundle Export
// -----------------------------------------------------------------------------
console.log('\n--- 9. Master Token Export Bundle ---');
const bundle = exportTokenBundle(astFromTheme);
assert(bundle.version === '4.0.0', 'Bundle version is 4.0.0');
assert(typeof bundle.exportedAt === 'string', 'Has exportedAt timestamp');
assert(typeof bundle.checksum === 'string', 'Computes checksum');
assert(bundle.tailwindConfig && bundle.tailwindConfig.theme, 'Contains tailwindConfig');
assert(bundle.tailwindV4 && bundle.tailwindV4.rawCss, 'Contains tailwindV4');
assert(bundle.cssVariables && bundle.cssVariables.rawCss, 'Contains cssVariables');
assert(bundle.dtcgJson && bundle.dtcgJson.rawJson, 'Contains dtcgJson');
assert(bundle.typescriptTokens && bundle.typescriptTokens.rawTypeScript, 'Contains typescriptTokens');

// -----------------------------------------------------------------------------
// 10. Class-Based Engine Usage & Dynamic Updates
// -----------------------------------------------------------------------------
console.log('\n--- 10. Class-Based Engine Usage & Dynamic Updates ---');
const exporter = new CrossFrameworkTokenExporter({ '--bg': '#ffffff' });
assert(exporter.exportTailwindV3().theme.extend.colors.bg === 'var(--bg)', 'Class exportTailwindV3 works');

exporter.setTokens(astFromTheme);
assert(exporter.exportTailwindV4().rawCss.includes('@theme'), 'Class updates dynamically via setTokens');
const classBundle = exporter.exportBundle();
assert(classBundle.version === '4.0.0', 'Class exportBundle produces valid bundle');

// -----------------------------------------------------------------------------
// 11. UMD Bundle Execution (CommonJS + Browser Global)
// -----------------------------------------------------------------------------
console.log('\n--- 11. UMD Global Sandbox Execution ---');
const umdPath = path.join(__dirname, 'cross_token_exporter.umd.js');
const umdCode = fs.readFileSync(umdPath, 'utf8');

// 11.1 CommonJS simulation
const cjsModule = { exports: {} };
const cjsSandbox = { module: cjsModule, exports: cjsModule.exports };
vm.createContext(cjsSandbox);
vm.runInContext(umdCode, cjsSandbox);

assert(typeof cjsModule.exports.CrossFrameworkTokenExporter === 'function', 'UMD exports CrossFrameworkTokenExporter in CJS');
assert(typeof cjsModule.exports.exportTailwindV4 === 'function', 'UMD exports exportTailwindV4 in CJS');
assert(typeof cjsModule.exports.exportTokenBundle === 'function', 'UMD exports exportTokenBundle in CJS');

// 11.2 Window Global simulation
const browserSandbox = {};
browserSandbox.window = browserSandbox;
browserSandbox.globalThis = browserSandbox;
browserSandbox.self = browserSandbox;
vm.createContext(browserSandbox);
vm.runInContext(umdCode, browserSandbox);

assert(typeof browserSandbox.CrossFrameworkTokenExporter === 'function', 'UMD exposes CrossFrameworkTokenExporter on window');
assert(typeof browserSandbox.exportTailwindV3 === 'function', 'UMD exposes exportTailwindV3 on window');
assert(typeof browserSandbox.exportW3CDtcgJson === 'function', 'UMD exposes exportW3CDtcgJson on window');

// -----------------------------------------------------------------------------
// 12. Complex Composite Tokens & Keyframes
// -----------------------------------------------------------------------------
console.log('\n--- 12. Complex Composite Tokens & Stress Scenarios ---');
const complexAST = {
  tokens: [
    {
      name: '--shadow-composite-luminous',
      value: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.90)',
      category: 'elevation',
      type: 'shadow',
    },
    {
      name: '--accent-glass',
      value: 'color-mix(in oklab, var(--accent) 75%, transparent)',
      category: 'accents',
      type: 'color',
    },
  ],
  keyframes: {
    'elastic-bounce': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.08)' },
      '100%': { transform: 'scale(1)' },
    },
  },
};

const complexExporter = new CrossFrameworkTokenExporter(complexAST);
const complexBundle = complexExporter.exportBundle();

assert(
  complexBundle.tailwindConfig.theme.extend.boxShadow['composite-luminous'] === 'var(--shadow-composite-luminous)',
  'Composite shadow key cleanly sanitized without losing name'
);
assert(
  complexBundle.tailwindConfig.theme.extend.keyframes['elastic-bounce'] !== undefined,
  'Custom keyframe elastic-bounce cleanly exported to Tailwind v3'
);
assert(
  complexBundle.tailwindV4.themeVariables['--shadow-composite-luminous'].includes('inset 0 1px 0 rgba(255, 255, 255, 0.90)'),
  'Tailwind v4 preserved composite shadow value'
);
assert(
  complexBundle.dtcgJson.tokens.shadow.compositeLuminous.$type === 'shadow',
  'DTCG JSON categorizes composite shadow correctly'
);

// -----------------------------------------------------------------------------
// 13. Base Name Prefix Edge Cases (Anti --shadow-shadow / --radius-radius bug)
// -----------------------------------------------------------------------------
console.log('\n--- 13. Base Name Prefix Bug Prevention & Mapping ---');
assert(mapToTailwindV4VarName({ name: '--shadow', type: 'shadow' }) === '--shadow', '--shadow maps to --shadow (NOT --shadow-shadow)');
assert(mapToTailwindV4VarName({ name: '--radius', type: 'dimension', category: 'elevation' }) === '--radius', '--radius maps to --radius (NOT --radius-radius)');
assert(mapToTailwindV4VarName({ name: '--blur', type: 'dimension' }) === '--blur', '--blur maps to --blur (NOT --blur-blur)');
assert(mapToTailwindV4VarName({ name: '--space', category: 'spacing' }) === '--spacing', '--space maps to --spacing');
assert(mapToTailwindV4VarName({ name: '--spacing', category: 'spacing' }) === '--spacing', '--spacing maps to --spacing');
assert(mapToTailwindV4VarName({ name: '--sans', type: 'fontFamily' }) === '--font-sans', 'fontFamily maps to --font-* prefix');
assert(mapToTailwindV4VarName({ name: '--fast', category: 'motion' }) === '--animate-fast', 'motion category maps to --animate-* prefix');

// -----------------------------------------------------------------------------
// 14. Typography Scale in Tailwind v3 (fontSize, lineHeight, letterSpacing)
// -----------------------------------------------------------------------------
console.log('\n--- 14. Typography Scale in Tailwind v3 ---');
const standardBundle = exportTailwindV3(null);
assert(standardBundle.theme.extend.fontSize !== undefined, 'Tailwind v3 theme.extend contains fontSize map');
assert(standardBundle.theme.extend.fontSize.xs === 'var(--text-xs)', 'fontSize.xs maps to var(--text-xs)');
assert(standardBundle.theme.extend.fontSize.base === 'var(--text-base)', 'fontSize.base maps to var(--text-base)');
assert(standardBundle.theme.extend.fontSize['4xl'] === 'var(--text-4xl)', 'fontSize.4xl maps to var(--text-4xl)');
assert(standardBundle.theme.extend.lineHeight.body === 'var(--leading-body)', 'lineHeight.body maps to var(--leading-body)');
assert(standardBundle.theme.extend.lineHeight.tight === 'var(--leading-tight)', 'lineHeight.tight maps to var(--leading-tight)');
assert(standardBundle.theme.extend.letterSpacing.display === 'var(--tracking-display)', 'letterSpacing.display maps to var(--tracking-display)');

// -----------------------------------------------------------------------------
// 15. Custom dtcgPath and v4Prefix Preservation
// -----------------------------------------------------------------------------
console.log('\n--- 15. Custom dtcgPath and v4Prefix Preservation ---');
const customMetadataAST = normalizeTokenContractAST({
  tokens: [
    {
      name: '--brand-special',
      value: '#6366f1',
      category: 'accents',
      type: 'color',
      dtcgPath: 'brand.primary.special',
      v4Prefix: '--color-brand-special-hero',
    },
  ],
});

assert(customMetadataAST.tokens[0].dtcgPath === 'brand.primary.special', 'Custom dtcgPath preserved in AST');
assert(customMetadataAST.tokens[0].v4Prefix === '--color-brand-special-hero', 'Custom v4Prefix preserved in AST');

const customDtcg = exportW3CDtcgJson(customMetadataAST);
assert(customDtcg.tokens.brand?.primary?.special?.$value === '#6366f1', 'Custom dtcgPath honored in exportW3CDtcgJson');

const customTw4 = exportTailwindV4(customMetadataAST);
assert(customTw4.themeVariables['--color-brand-special-hero'] === '#6366f1', 'Custom v4Prefix honored in exportTailwindV4');

// -----------------------------------------------------------------------------
// 16. Tailwind v4 @keyframes Emission & Partial AST Alias Resolution
// -----------------------------------------------------------------------------
console.log('\n--- 16. Tailwind v4 @keyframes Emission & Partial AST Alias Resolution ---');
assert(complexBundle.tailwindV4.rawCss.includes('@keyframes elastic-bounce'), 'Tailwind v4 rawCss contains @keyframes elastic-bounce');
assert(complexBundle.tailwindV4.rawCss.includes('@keyframes fade-up'), 'Tailwind v4 rawCss contains default @keyframes fade-up');
assert(complexBundle.tailwindV4.rawCss.includes('@keyframes scale-in'), 'Tailwind v4 rawCss contains default @keyframes scale-in');

// Partial AST with standard variable reference
const partialAst = normalizeTokenContractAST({
  tokens: [
    { name: '--panel-bg', value: 'var(--surface)' },
    { name: '--panel-border', value: 'var(--border)' },
  ],
});
const partialTw4 = exportTailwindV4(partialAst);
assert(partialTw4.themeVariables['--color-panel-bg'] === 'var(--color-surface)', 'Partial AST resolves standard var(--surface) to var(--color-surface)');
assert(partialTw4.themeVariables['--color-panel-border'] === 'var(--color-border)', 'Partial AST resolves standard var(--border) to var(--color-border)');

// TypeScript declarations deduplication
const duplicateTokensAst = {
  tokens: [
    { name: '--bg', value: '#fff', category: 'surfaces', type: 'color' },
    { name: '--bg', value: '#fafafa', category: 'surfaces', type: 'color' },
  ],
};
const dedupeTs = exportTypeScriptDeclarations(duplicateTokensAst);
const cssVarSection = dedupeTs.rawTypeScript.split('export type DesignTokenCssVariable')[1]?.split('export type')[0] || '';
const countBgInCssVar = (cssVarSection.match(/'--bg'/g) || []).length;
assert(countBgInCssVar === 1, 'TypeScript declarations deduplicate union members cleanly');

console.log('\n================================================================');
console.log(`TOTAL: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS)`);
console.log('================================================================\n');
