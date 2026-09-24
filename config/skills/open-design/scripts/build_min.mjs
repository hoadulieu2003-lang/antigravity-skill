import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function minifyShader(glsl) {
  const lines = glsl.split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    if (line.startsWith('//')) continue;
    if (line.startsWith('#')) {
      out.push(line);
    } else {
      if (out.length > 0 && !out[out.length - 1].startsWith('#')) {
        out[out.length - 1] += ' ' + line;
      } else {
        out.push(line);
      }
    }
  }
  return out.join('\n').replace(/\s*([{};,:?+\-*\/=><!|&()])\s*/g, '$1');
}

export function minify(src) {
  let s = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n\r]*/g, '$1');

  const tokens = [];
  s = s.replace(/`[\s\S]*?`/g, (m) => {
    tokens.push(m);
    return `___TOKEN_${tokens.length - 1}___`;
  });

  s = s
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:?+\-*\/=><!|&()])\s*/g, '$1')
    .replace(/;\}/g, '}');

  s = s.replace(/___TOKEN_(\d+)___/g, (_, i) => {
    const lit = tokens[Number(i)];
    if (lit.includes('void main') || lit.includes('attribute vec2')) {
      const inner = lit.slice(1, -1);
      return '`' + minifyShader(inner) + '`';
    }
    return lit.replace(/\s+/g, ' ');
  });

  return s.trim();
}

const esmPath = path.join(__dirname, 'webgl_micro_engine.js');
const esmSrc = fs.readFileSync(esmPath, 'utf8');
const minEsm = minify(esmSrc);
const minEsmPath = path.join(__dirname, 'webgl_micro_engine.min.js');
fs.writeFileSync(minEsmPath, minEsm, 'utf8');
const gzEsm = zlib.gzipSync(Buffer.from(minEsm));

const umdPath = path.join(__dirname, 'webgl_micro_engine.umd.js');
const umdSrc = fs.readFileSync(umdPath, 'utf8');
const minUmd = minify(umdSrc);
const minUmdPath = path.join(__dirname, 'webgl_micro_engine.umd.min.js');
fs.writeFileSync(minUmdPath, minUmd, 'utf8');
const gzUmd = zlib.gzipSync(Buffer.from(minUmd));

console.log(`ESM: ${esmSrc.length} raw -> ${minEsm.length} min -> ${gzEsm.length} gzip`);
console.log(`UMD: ${umdSrc.length} raw -> ${minUmd.length} min -> ${gzUmd.length} gzip`);
