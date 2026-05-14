const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { findMatch } = require('./jogosService');
const { getGuildConfig } = require('./configService');
const { matchDateTime, nowBR } = require('../utils/date');
const { normalizeText } = require('../utils/normalize');

const palpitesPath = path.join(__dirname, '..', 'data', 'palpites.json');
const resultadosPath = path.join(__dirname, '..', 'data', 'resultados.json');
const locksPath = path.join(__dirname, '..', 'data', 'palpite-locks.json');

function getPalpites() { return readJson(palpitesPath, {}); }
function savePalpites(data) { writeJson(palpitesPath, data); }
function getResultados() { return readJson(resultadosPath, {}); }
function saveResultados(data) { writeJson(resultadosPath, data); }
function getLocks() { return readJson(locksPath, {}); }
function saveLocks(data) { writeJson(locksPath, data); }

function parseScore(score) {
  if (!score) return null;
  const match = String(score).trim().match(/^(\d{1,2})\s*[xX-]\s*(\d{1,2})$/);
  if (!match) return null;
  return { gols1: Number(match[1]), gols2: Number(match[2]) };
}

function getOutcomeFromScore(match, gols1, gols2) {
  if (gols1 === gols2) return 'Empate';
  return gols1 > gols2 ? match.time1 : match.time2;
}

function normalizeWinner(match, winner) {
  const n = normalizeText(winner);
  if (['empate', 'x', 'draw'].includes(n)) return 'Empate';
  if (normalizeText(match.time1).includes(n) || n.includes(normalizeText(match.time1))) return match.time1;
  if (normalizeText(match.time2).includes(n) || n.includes(normalizeText(match.time2))) return match.time2;
  return null;
}

function isBetOpen(guildId, match) {
  const locks = getLocks();
  const lock = locks[guildId]?.[match.id];
  if (lock === 'closed') return { open: false, reason: 'Os palpites foram fechados manualmente para este jogo.' };
  if (lock === 'open') return { open: true };
  const config = getGuildConfig(guildId);
  const minutes = Number(config.palpites?.bloqueioMinutos ?? 10);
  const limit = matchDateTime(match).minus({ minutes });
  if (nowBR() >= limit) return { open: false, reason: `O prazo de palpites encerrou ${minutes} minutos antes da partida.` };
  return { open: true };
}

function placeBet({ guildId, userId, matchQuery, winner, score }) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado. Tente usar o autocomplete ou escreva “Brasil x Marrocos”.' };
  const open = isBetOpen(guildId, match);
  if (!open.open) return { ok: false, error: open.reason, match };
  const normalizedWinner = normalizeWinner(match, winner);
  if (!normalizedWinner) return { ok: false, error: `Vencedor inválido. Use “${match.time1}”, “${match.time2}” ou “Empate”.`, match };
  const parsedScore = score ? parseScore(score) : null;
  if (score && !parsedScore) return { ok: false, error: 'Placar inválido. Use o formato 2x0, 1x1 etc.', match };

  const data = getPalpites();
  data[guildId] ||= {};
  data[guildId][match.id] ||= {};
  data[guildId][match.id][userId] = {
    winner: normalizedWinner,
    score: parsedScore,
    createdAt: data[guildId][match.id][userId]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  savePalpites(data);
  return { ok: true, match, bet: data[guildId][match.id][userId] };
}

function registerResult({ matchQuery, gols1, gols2, userId }) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado.' };
  const result = {
    matchId: match.id,
    gols1: Number(gols1),
    gols2: Number(gols2),
    outcome: getOutcomeFromScore(match, Number(gols1), Number(gols2)),
    registeredBy: userId,
    updatedAt: new Date().toISOString()
  };
  const data = getResultados();
  data[match.id] = result;
  saveResultados(data);
  return { ok: true, match, result };
}

function scoreBet(match, bet, result) {
  let points = 0;
  const details = [];
  if (normalizeText(bet.winner) === normalizeText(result.outcome)) {
    points += 3;
    details.push('+3 vencedor/empate');
  }
  if (bet.score) {
    const exact = bet.score.gols1 === result.gols1 && bet.score.gols2 === result.gols2;
    const betDiff = bet.score.gols1 - bet.score.gols2;
    const resultDiff = result.gols1 - result.gols2;
    if (exact) {
      points += 5;
      details.push('+5 placar exato');
    } else if (betDiff === resultDiff) {
      points += 1;
      details.push('+1 saldo correto');
    }
  }
  return { points, details };
}

function calculateRanking(guildId) {
  const palpites = getPalpites()[guildId] || {};
  const resultados = getResultados();
  const ranking = {};
  for (const [matchId, users] of Object.entries(palpites)) {
    const result = resultados[matchId];
    const match = findMatch(matchId);
    if (!result || !match) continue;
    for (const [userId, bet] of Object.entries(users)) {
      const scored = scoreBet(match, bet, result);
      ranking[userId] ||= { userId, points: 0, bets: 0, exact: 0 };
      ranking[userId].points += scored.points;
      ranking[userId].bets += 1;
      if (bet.score?.gols1 === result.gols1 && bet.score?.gols2 === result.gols2) ranking[userId].exact += 1;
    }
  }
  return Object.values(ranking).sort((a, b) => b.points - a.points || b.exact - a.exact || b.bets - a.bets);
}

function getUserBets(guildId, userId) {
  const palpites = getPalpites()[guildId] || {};
  const list = [];
  for (const [matchId, users] of Object.entries(palpites)) {
    if (users[userId]) {
      const match = findMatch(matchId);
      if (match) list.push({ match, bet: users[userId] });
    }
  }
  return list.sort((a, b) => matchDateTime(a.match).toMillis() - matchDateTime(b.match).toMillis());
}

function setBetLock(guildId, matchQuery, status) {
  const match = findMatch(matchQuery);
  if (!match) return { ok: false, error: 'Jogo não encontrado.' };
  const locks = getLocks();
  locks[guildId] ||= {};
  locks[guildId][match.id] = status;
  saveLocks(locks);
  return { ok: true, match, status };
}

module.exports = {
  placeBet,
  registerResult,
  calculateRanking,
  getUserBets,
  setBetLock,
  parseScore,
  getResultados,
  scoreBet,
  isBetOpen
};
