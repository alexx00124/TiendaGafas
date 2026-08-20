const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const MIN_LINES = 10;

function getFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'test', 'coverage', 'dist', 'static', '.scannerwork'].includes(entry.name)) {
      results.push(...getFiles(full));
    } else if (entry.isFile() && /\.(js|jsx)$/.test(entry.name) && !entry.name.endsWith('.test.js') && !entry.name.endsWith('.test.jsx')) {
      results.push(full);
    }
  }
  return results;
}

function normalize(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function getFileLines(filePath) {
  return fs.readFileSync(filePath, 'utf-8').split('\n').map(l => normalize(l));
}

const files = getFiles(SRC_DIR);
const fileMap = {};

for (const f of files) {
  const rel = path.relative(SRC_DIR, f).replace(/\\/g, '/');
  fileMap[rel] = getFileLines(f);
}

const blocks = new Map();

for (const [file, lines] of Object.entries(fileMap)) {
  for (let i = 0; i <= lines.length - MIN_LINES; i++) {
    const key = lines.slice(i, i + MIN_LINES).join('\n');
    if (key.length < 30 || /^[\s;{}(),.]*$/.test(key)) continue;
    if (!blocks.has(key)) {
      blocks.set(key, []);
    }
    blocks.get(key).push({ file, line: i + 1 });
  }
}

const dupes = [];
for (const [key, locations] of blocks) {
  const uniqueFiles = [...new Set(locations.map(l => l.file))];
  if (uniqueFiles.length < 2) continue;
  dupes.push({ block: key, locations, uniqueFiles });
}

dupes.sort((a, b) => b.block.length - a.block.length);

let totalDupedLines = 0;
const reported = new Set();

for (const d of dupes) {
  const sig = d.locations.map(l => `${l.file}:${l.line}`).sort().join('|');
  if (reported.has(sig)) continue;
  reported.add(sig);

  const lines = d.block.split('\n').length;
  totalDupedLines += lines;

  console.log(`\n=== DUPLICADO (${lines} líneas) ===`);
  for (const loc of d.locations) {
    console.log(`  ${loc.file}:${loc.line}-${loc.line + lines - 1}`);
  }
  console.log(`  Preview: ${d.block.split('\n').slice(0, 3).join(' | ')}`);
}

const totalLines = Object.values(fileMap).reduce((s, l) => s + l.length, 0);
console.log(`\n\n=== RESUMEN ===`);
console.log(`Archivos analizados: ${files.length}`);
console.log(`Líneas totales: ${totalLines}`);
console.log(`Líneas duplicadas estimadas: ${totalDupedLines}`);
console.log(`% duplicación: ${(totalDupedLines / totalLines * 100).toFixed(2)}%`);
