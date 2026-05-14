const { DateTime } = require('luxon');
const { timezone } = require('../config/theme');

function nowBR() {
  return DateTime.now().setZone(timezone);
}

function todayISO() {
  return nowBR().toISODate();
}

function parseDateInput(input) {
  if (!input) return { ok: true, value: todayISO() };
  const raw = String(input).trim();
  let match = raw.match(/^(\d{2})\/(\d{2})(?:\/(\d{4}))?$/);
  if (match) {
    const [, dd, mm, yyyy = '2026'] = match;
    const dt = DateTime.fromObject({ year: Number(yyyy), month: Number(mm), day: Number(dd) }, { zone: timezone });
    if (!dt.isValid) return { ok: false, error: 'Data inválida. Use o formato DD/MM, por exemplo: 13/06.' };
    return { ok: true, value: dt.toISODate() };
  }
  match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const dt = DateTime.fromISO(raw, { zone: timezone });
    if (!dt.isValid) return { ok: false, error: 'Data inválida. Use DD/MM ou AAAA-MM-DD.' };
    return { ok: true, value: dt.toISODate() };
  }
  return { ok: false, error: 'Formato de data inválido. Use DD/MM, por exemplo: 13/06.' };
}

function formatDateBR(isoDate) {
  const dt = DateTime.fromISO(isoDate, { zone: timezone });
  return dt.isValid ? dt.toFormat('dd/LL/yyyy') : isoDate;
}

function formatDateShort(isoDate) {
  const dt = DateTime.fromISO(isoDate, { zone: timezone });
  return dt.isValid ? dt.toFormat('dd/LL') : isoDate;
}

function matchDateTime(match) {
  return DateTime.fromISO(`${match.data}T${match.hora}:00`, { zone: timezone });
}

function isFutureOrToday(match) {
  return matchDateTime(match) >= nowBR().startOf('day');
}

function minutesUntil(match) {
  return matchDateTime(match).diff(nowBR(), 'minutes').minutes;
}

module.exports = { nowBR, todayISO, parseDateInput, formatDateBR, formatDateShort, matchDateTime, isFutureOrToday, minutesUntil };
