const { compactKey } = require('./normalize');

function buildMatchLabel(match) {
  const fase = match.grupo || match.fase;
  const codigo = match.jogo ? `${match.jogo} • ` : '';
  return `${match.data} ${match.hora} • ${codigo}${match.time1} x ${match.time2} • ${fase}`;
}

function readableMatch(match) {
  return `${match.time1} x ${match.time2}`;
}

function simpleMatchKey(time1, time2) {
  return `${compactKey(time1)}-x-${compactKey(time2)}`;
}

module.exports = { buildMatchLabel, readableMatch, simpleMatchKey };
