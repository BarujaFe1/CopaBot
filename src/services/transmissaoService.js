const path = require('path');
const { readJson } = require('../storage/jsonStore');
const { normalizeText } = require('../utils/normalize');

const filePath = path.join(__dirname, '..', 'data', 'transmissoes.json');

function allTransmissoes() {
  return readJson(filePath, []);
}

function getTransmissionRecord(matchId) {
  return allTransmissoes().find(item => item.matchId === matchId) || null;
}

function getTransmission(matchId) {
  const record = getTransmissionRecord(matchId);
  if (!record || !Array.isArray(record.transmissao) || record.transmissao.length === 0) {
    return { list: ['A definir'], text: 'Transmissão: a definir', observacoes: '' };
  }
  return {
    list: record.transmissao,
    text: record.transmissao.join(', '),
    observacoes: record.observacoes || ''
  };
}

function findTransmissionByTeams(games, time1, time2) {
  const n1 = normalizeText(time1);
  const n2 = normalizeText(time2);
  const match = games.find(game => {
    const g1 = normalizeText(game.time1);
    const g2 = normalizeText(game.time2);
    return (g1.includes(n1) && g2.includes(n2)) || (g1.includes(n2) && g2.includes(n1));
  });
  if (!match) return null;
  return { match, transmission: getTransmission(match.id) };
}

module.exports = { allTransmissoes, getTransmissionRecord, getTransmission, findTransmissionByTeams };
