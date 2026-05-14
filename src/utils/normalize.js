function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9º\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesNormalized(source, query) {
  return normalizeText(source).includes(normalizeText(query));
}

function equalNormalized(a, b) {
  return normalizeText(a) === normalizeText(b);
}

function compactKey(value = '') {
  return normalizeText(value).replace(/\s+/g, '-');
}

module.exports = { normalizeText, includesNormalized, equalNormalized, compactKey };
