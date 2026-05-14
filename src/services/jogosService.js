const jogos = require('../data/jogos-copa-2026.json');
const grupos = require('../data/grupos-copa-2026.json');
const { normalizeText } = require('../utils/normalize');
const { todayISO, parseDateInput, matchDateTime, isFutureOrToday } = require('../utils/date');
const { buildMatchLabel } = require('../utils/ids');

function allGames() {
  return [...jogos].sort((a, b) => matchDateTime(a).toMillis() - matchDateTime(b).toMillis() || a.ordem - b.ordem);
}

function getByDate(dateISO) {
  return allGames().filter(game => game.data === dateISO);
}

function getTodayGames() {
  return getByDate(todayISO());
}

function getUpcoming(limit = 10) {
  return allGames().filter(isFutureOrToday).slice(0, limit);
}

function getByTeam(teamName, onlyUpcoming = true) {
  const needle = normalizeText(teamName);
  return allGames().filter(game => {
    const matches = normalizeText(game.time1).includes(needle) || normalizeText(game.time2).includes(needle);
    return matches && (!onlyUpcoming || isFutureOrToday(game));
  });
}

function getAllTeams() {
  const set = new Set();
  for (const game of allGames()) {
    if (!/^a definir$/i.test(game.time1) && !normalizeText(game.time1).includes('venc') && !normalizeText(game.time1).includes('º')) set.add(game.time1);
    if (!/^a definir$/i.test(game.time2) && !normalizeText(game.time2).includes('venc') && !normalizeText(game.time2).includes('º')) set.add(game.time2);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function getGroup(groupName) {
  const needle = normalizeText(groupName).replace(/^grupo\s+/, '');
  return grupos.find(group => normalizeText(group.nome).endsWith(needle) || normalizeText(group.nome) === `grupo ${needle}`) || null;
}

function getByGroup(groupName) {
  const group = getGroup(groupName);
  if (!group) return { group: null, games: [] };
  return { group, games: allGames().filter(game => normalizeText(game.grupo || '') === normalizeText(group.nome)) };
}

function normalizePhaseInput(input = '') {
  const n = normalizeText(input).replace(/\s+/g, '');
  if (['grupos', 'fasegrupos', 'fasedegrupos'].includes(n)) return 'grupos';
  if (['16avos', 'dezesseisavos', '16avosdefinal', '16'].includes(n)) return '16avos';
  if (['oitavas', 'oitavasdefinal'].includes(n)) return 'oitavas';
  if (['quartas', 'quartasdefinal'].includes(n)) return 'quartas';
  if (['semi', 'semifinal', 'semifinais'].includes(n)) return 'semifinais';
  if (['terceirolugar', '3lugar', '3ºlugar', 'disputade3lugar', 'disputade3ºlugar'].includes(n)) return 'terceiro-lugar';
  if (['final'].includes(n)) return 'final';
  return null;
}

function getByPhase(phaseName) {
  const phaseSlug = normalizePhaseInput(phaseName);
  if (!phaseSlug) return { phaseSlug: null, games: [] };
  return { phaseSlug, games: allGames().filter(game => game.faseSlug === phaseSlug) };
}

function findMatch(query) {
  if (!query) return null;
  const input = String(query).trim();
  const normalized = normalizeText(input);
  const exactId = allGames().find(game => normalizeText(game.id) === normalized);
  if (exactId) return exactId;

  const byLabel = allGames().find(game => normalizeText(buildMatchLabel(game)).includes(normalized));
  if (byLabel) return byLabel;

  const split = normalized.split(/\s+x\s+|\s+vs\s+|\s+versus\s+/).map(v => v.trim()).filter(Boolean);
  if (split.length >= 2) {
    const [a, b] = split;
    return allGames().find(game => {
      const t1 = normalizeText(game.time1);
      const t2 = normalizeText(game.time2);
      return (t1.includes(a) && t2.includes(b)) || (t1.includes(b) && t2.includes(a));
    }) || null;
  }

  return allGames().find(game => normalizeText(game.time1).includes(normalized) || normalizeText(game.time2).includes(normalized)) || null;
}

function autocompleteMatches(value, limit = 25) {
  const needle = normalizeText(value || '');
  return allGames()
    .filter(game => !needle || normalizeText(buildMatchLabel(game)).includes(needle) || normalizeText(game.id).includes(needle))
    .slice(0, limit)
    .map(game => ({ name: buildMatchLabel(game).slice(0, 100), value: game.id }));
}

function autocompleteTeams(value, limit = 25) {
  const needle = normalizeText(value || '');
  return getAllTeams()
    .filter(team => !needle || normalizeText(team).includes(needle))
    .slice(0, limit)
    .map(team => ({ name: team, value: team }));
}

module.exports = {
  allGames,
  getByDate,
  getTodayGames,
  getUpcoming,
  getByTeam,
  getAllTeams,
  getByGroup,
  getGroup,
  getByPhase,
  normalizePhaseInput,
  findMatch,
  parseDateInput,
  autocompleteMatches,
  autocompleteTeams
};
