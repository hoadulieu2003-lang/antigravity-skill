import StrictSanitizer, {
  SafeStyleSanitizer,
  SafeDOMAssembler,
  SafeSchemaMerger,
  ContractFreezer,
  SAFE_CSS_PROPERTIES,
  isSafeCssProperty,
  clampZIndex,
  sanitizeStyleValue,
  sanitizeStyleObject,
  applySafeStyles,
  scopeIdentifier,
  unscopeIdentifier,
  sanitizeHtml,
  parseHtmlToElements,
  createSafeElement,
  mountInShadowRoot,
  safeMerge,
  safeDeepMerge,
  deepFreeze,
  isBrowser,
  isPlainObject,
  isDomNode,
  isWindow,
  toKebabCase,
  escapeHtml,
  sanitizeUrl,
} from './strict_sanitizer.js';

// Type checks
const props: ReadonlySet<string> = SAFE_CSS_PROPERTIES;
const safeProp: boolean = isSafeCssProperty('width');
const clampedZ: string = clampZIndex(999999);
const safeVal: string | null = sanitizeStyleValue('color', '#FAF9F6');
const styleMap: Record<string, string> = sanitizeStyleObject({ color: '#FAF9F6' });
const scopedId: string = scopeIdentifier('main');
const unscopedId: string = unscopeIdentifier('gvs_cmp_main');
const cleanHtml: string = sanitizeHtml('<script>alert(1)</script>');
const nodes: any[] = parseHtmlToElements('<div>Hello</div>');
const safeEl: any = createSafeElement('div');
const shadowResult = mountInShadowRoot(safeEl, '<p>Content</p>', { styles: ':host { color: red; }' });

const mergedObj: Record<string, any> = safeMerge({ a: 1 }, { b: 2 });
const deepMergedObj: Record<string, any> = safeDeepMerge({ a: 1 }, { b: 2 });
const frozen = deepFreeze({ key: 'val' });

console.log('TypeScript strict_sanitizer types verified successfully.');
