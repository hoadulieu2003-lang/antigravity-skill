import LuminousPaletteEngine, {
  generateLuminousPalette,
  getCssVariables,
  resolveAccessibleTextColor,
  hexToOklch,
  oklchToHex,
  getContrastRatio,
  getApcaContrast,
  LuminousPalette,
  PaletteOptions,
} from './luminous_palette_engine.js';

// Type checks
const options: PaletteOptions = {
  canvasPreset: 'warm-paper',
  targetRatio: 4.5,
  amberTargetHue: 68.5,
  bendHue: true,
  insetOpacity: 0.92,
  prefix: 'luminous-',
};

const palette: LuminousPalette = generateLuminousPalette('#E4FF00', options);

const canvasHex: string = palette.surfaces.canvas;
const cardHex: string = palette.surfaces.card;
const solidHex: string = palette.accent.solid;
const textHex: string = palette.accent.text;
const crCanvas: number = palette.accent.textContrastOnCanvas;
const crCard: number = palette.accent.textContrastOnCard;
const borderDeltaL: number = palette.surfaces.borderDeltaL;

const cssString: string = getCssVariables(palette) as string;
const cssObj: Record<string, string> = getCssVariables(palette, { asObject: true }) as Record<string, string>;

const resolvedText: string = resolveAccessibleTextColor(canvasHex, { targetRatio: 4.5 });
const resolvedDarkBgText: string = resolveAccessibleTextColor('#000000', { targetRatio: 4.5, polarity: 'light' });
const parsedRgb = LuminousPaletteEngine.parseColor('rgb(255, 122, 0)');
const oklch = hexToOklch('#FF7A00');
const backHex = oklchToHex(oklch.l, oklch.c, oklch.h);
const ratio = getContrastRatio('#0F172A', '#FAF9F6');
const apca = getApcaContrast('#0F172A', '#FAF9F6');

console.log('TypeScript AST contracts verified successfully!', {
  canvasHex,
  cardHex,
  solidHex,
  textHex,
  crCanvas,
  crCard,
  borderDeltaL,
  cssStringLength: cssString.length,
  cssObjKeys: Object.keys(cssObj).length,
  resolvedText,
  resolvedDarkBgText,
  parsedRgb,
  backHex,
  ratio,
  apca,
  version: LuminousPaletteEngine.version,
});
