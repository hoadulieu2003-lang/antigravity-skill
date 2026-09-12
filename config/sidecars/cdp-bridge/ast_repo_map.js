/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPT FACTORY PRO — AST REPO MAP ENGINE (Aider-Inspired Architecture Map)
 * Fast, lightweight syntax tree extractor & codebase symbol indexer.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'exports', 'raw_clips',
  '.system_generated', '.gemini', 'coverage', '.antigravity-ide',
  '.vscode', '.idea', 'tmp', 'temp'
]);

const SUPPORTED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.py'
]);

/**
 * Bóc tách các định nghĩa cấu trúc chính (Classes, Functions, Interfaces, Types, Routes)
 */
function extractFileSymbols(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const lines = content.split('\n');
  const symbols = [];

  if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx' || ext === '.cjs' || ext === '.mjs') {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNum = index + 1;

      // 1. Interface & Type definitions
      const interfaceMatch = trimmed.match(/^export\s+(interface|type)\s+([A-Za-z0-9_]+)(.*)/);
      if (interfaceMatch) {
        symbols.push({ type: interfaceMatch[1], name: interfaceMatch[2], signature: `${interfaceMatch[1]} ${interfaceMatch[2]}${interfaceMatch[3].slice(0, 80)}`, line: lineNum });
        return;
      }

      // 2. Class definitions
      const classMatch = trimmed.match(/^(?:export\s+)?(?:default\s+)?class\s+([A-Za-z0-9_]+)(?:\s+extends\s+[A-Za-z0-9_]+)?(?:\s+implements\s+[A-Za-z0-9_,\s]+)?/);
      if (classMatch) {
        symbols.push({ type: 'class', name: classMatch[1], signature: trimmed.replace(/\{$/, '').trim(), line: lineNum });
        return;
      }

      // 3. Exported functions & Async functions
      const funcMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?::\s*([^{]+))?/);
      if (funcMatch) {
        const retType = funcMatch[3] ? `: ${funcMatch[3].trim()}` : '';
        symbols.push({ type: 'function', name: funcMatch[1], signature: `function ${funcMatch[1]}(${funcMatch[2].trim()})${retType}`, line: lineNum });
        return;
      }

      // 4. Arrow functions & Const exports (e.g. export const handleSomething = async (...) => ...)
      const constMatch = trimmed.match(/^(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)(?::\s*([^{=>]+))?\s*=>/);
      if (constMatch) {
        const retType = constMatch[3] ? `: ${constMatch[3].trim()}` : '';
        symbols.push({ type: 'arrow-function', name: constMatch[1], signature: `const ${constMatch[1]} = (${constMatch[2].trim()})${retType}`, line: lineNum });
        return;
      }

      // 5. Express/HTTP Route Handlers
      const routeMatch = trimmed.match(/^(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (routeMatch) {
        symbols.push({ type: 'route', name: `${routeMatch[1].toUpperCase()} ${routeMatch[2]}`, signature: `${routeMatch[1].toUpperCase()} ${routeMatch[2]}`, line: lineNum });
        return;
      }

      // 6. Class methods (indented methods)
      const methodMatch = trimmed.match(/^(?:public\s+|private\s+|protected\s+|static\s+|async\s+)*([A-Za-z0-9_]+)\s*\(([^)]*)\)(?::\s*([^{]+))?\s*\{/);
      if (methodMatch && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('while') && !trimmed.startsWith('switch') && !trimmed.startsWith('catch')) {
        const retType = methodMatch[3] ? `: ${methodMatch[3].trim()}` : '';
        symbols.push({ type: 'method', name: methodMatch[1], signature: `  ${methodMatch[1]}(${methodMatch[2].trim()})${retType}`, line: lineNum });
      }
    });
  } else if (ext === '.py') {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNum = index + 1;

      // 1. Python Classes
      const classMatch = trimmed.match(/^class\s+([A-Za-z0-9_]+)(?:\(([^)]*)\))?:/);
      if (classMatch) {
        symbols.push({ type: 'class', name: classMatch[1], signature: trimmed.replace(/:$/, ''), line: lineNum });
        return;
      }

      // 2. Python Functions/Methods
      const defMatch = trimmed.match(/^(?:async\s+)?def\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?:\s*->\s*([^:]+))?:/);
      if (defMatch) {
        const isIndented = line.startsWith('    ') || line.startsWith('\t');
        const retType = defMatch[3] ? ` -> ${defMatch[3].trim()}` : '';
        const prefix = isIndented ? '  def ' : 'def ';
        symbols.push({ type: isIndented ? 'method' : 'function', name: defMatch[1], signature: `${prefix}${defMatch[1]}(${defMatch[2].trim()})${retType}`, line: lineNum });
      }
    });
  }

  return symbols;
}

/**
 * Quét đệ quy thư mục và thu thập tất cả file hỗ trợ
 */
function scanDirectory(dirPath, maxDepth = 4, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  let results = [];

  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    return [];
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        results = results.concat(scanDirectory(fullPath, maxDepth, currentDepth + 1));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * TẠO BẢN ĐỒ REPO MAP NÉN
 */
function generateRepoMap(targetDir, options = {}) {
  const maxDepth = options.maxDepth || 4;
  const includeSignatures = options.includeSignatures !== false;
  const files = scanDirectory(targetDir, maxDepth);

  const fileMap = {};
  let totalSymbols = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const symbols = extractFileSymbols(file, content);
      const relPath = path.relative(targetDir, file).replace(/\\/g, '/');

      fileMap[relPath] = {
        absolutePath: file,
        symbols: symbols,
        loc: content.split('\n').length
      };
      totalSymbols += symbols.length;
    } catch (e) {
      // Ignore unreadable files
    }
  }

  // Xây dựng chuỗi hiển thị dạng cây nén
  let output = `# 🗺️ AST CODEBASE REPO MAP\n`;
  output += `> Root: \`${targetDir}\` | Files Indexed: **${files.length}** | Symbols: **${totalSymbols}**\n\n`;

  const sortedFiles = Object.keys(fileMap).sort();

  for (const relFile of sortedFiles) {
    const item = fileMap[relFile];
    if (item.symbols.length === 0 && !includeSignatures) continue;

    output += `### 📄 \`${relFile}\` (${item.loc} lines)\n`;
    if (includeSignatures && item.symbols.length > 0) {
      output += '```typescript\n';
      item.symbols.forEach(s => {
        output += `${s.signature} // L${s.line}\n`;
      });
      output += '```\n\n';
    } else {
      output += `\n`;
    }
  }

  return {
    raw: output,
    fileCount: files.length,
    symbolCount: totalSymbols,
    fileMap
  };
}

/**
 * TÌM KIẾM BIỂU TƯỢNG (SYMBOL SEARCH)
 */
function findSymbolInRepo(targetDir, symbolName) {
  const { fileMap } = generateRepoMap(targetDir, { maxDepth: 5 });
  const matches = [];
  const query = symbolName.toLowerCase().trim();

  for (const [relPath, data] of Object.entries(fileMap)) {
    for (const sym of data.symbols) {
      if (sym.name.toLowerCase().includes(query) || sym.signature.toLowerCase().includes(query)) {
        matches.push({
          file: relPath,
          absolutePath: data.absolutePath,
          line: sym.line,
          type: sym.type,
          name: sym.name,
          signature: sym.signature
        });
      }
    }
  }

  return matches;
}

module.exports = {
  generateRepoMap,
  findSymbolInRepo,
  extractFileSymbols
};

// If run directly via CLI
if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  console.log(`Đang phân tích AST Repo Map cho: ${target}...`);
  const result = generateRepoMap(target);
  const outPath = path.join(target, 'CODEBASE_REPO_MAP.md');
  fs.writeFileSync(outPath, result.raw);
  console.log(`✓ Đã xuất bản đồ thành công: ${outPath} (${result.fileCount} files, ${result.symbolCount} symbols)`);
}
