const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const output = path.join(root, 'CODIGO_COMPLETO.md');
const ignore = new Set(['node_modules', '.git', 'CODIGO_COMPLETO.md']);
const exts = new Set(['.js', '.json', '.md', '.example', '']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (ignore.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

const parts = ['# Código completo — Cabine do Glória FC\n'];
for (const file of walk(root).sort()) {
  const rel = path.relative(root, file);
  const ext = path.extname(file);
  if (!exts.has(ext) && !rel.endsWith('.env.example')) continue;
  const lang = ext === '.js' ? 'javascript' : ext === '.json' ? 'json' : '';
  parts.push(`\n## ${rel}\n\n\`\`\`${lang}\n${fs.readFileSync(file, 'utf8')}\n\`\`\`\n`);
}
fs.writeFileSync(output, parts.join('\n'));
console.log(`Gerado: ${output}`);
