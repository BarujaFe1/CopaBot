const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function cloneDefault(defaultValue) {
  return JSON.parse(JSON.stringify(defaultValue));
}

function readJson(filePath, defaultValue = {}) {
  ensureDir(filePath);
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, defaultValue);
    return cloneDefault(defaultValue);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return cloneDefault(defaultValue);
    return JSON.parse(raw);
  } catch (error) {
    const backupPath = `${filePath}.${Date.now()}.bak`;
    try { fs.copyFileSync(filePath, backupPath); } catch (_) {}
    console.error(`[jsonStore] Falha ao ler ${filePath}. Backup: ${backupPath}`, error);
    writeJson(filePath, defaultValue);
    return cloneDefault(defaultValue);
  }
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function updateJson(filePath, defaultValue, updater) {
  const current = readJson(filePath, defaultValue);
  const next = updater(current) || current;
  writeJson(filePath, next);
  return next;
}

module.exports = { readJson, writeJson, updateJson };
