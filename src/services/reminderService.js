const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { allGames } = require('./jogosService');
const { getTransmission } = require('./transmissaoService');
const { getAllConfigs } = require('./configService');
const { baseEmbed } = require('../utils/embeds');
const { minutesUntil, formatDateBR } = require('../utils/date');
const { colors } = require('../config/theme');

const sentFilePath = path.join(__dirname, '..', 'data', 'lembretes-enviados.json');
const thresholds = [60, 30, 10];

function getSent() {
  return readJson(sentFilePath, {});
}

function markSent(key) {
  const sent = getSent();
  sent[key] = new Date().toISOString();
  writeJson(sentFilePath, sent);
}

function buildReminderEmbed(match, threshold) {
  const transmission = getTransmission(match.id);
  const fase = match.grupo ? `${match.fase} • ${match.grupo}` : match.fase;
  return baseEmbed('⏰ Lembrete da Cabine', `Faltam aproximadamente **${threshold} minutos** para a bola rolar.`, colors.gold)
    .addFields(
      { name: 'Confronto', value: `**${match.time1} x ${match.time2}**`, inline: false },
      { name: 'Data e horário', value: `${formatDateBR(match.data)} às ${match.hora}`, inline: true },
      { name: 'Fase', value: fase, inline: true },
      { name: 'Transmissão', value: transmission.text, inline: false }
    );
}

async function sendReminder(client, guildId, config, match, threshold) {
  const channelId = config.canais?.lembretes;
  if (!channelId) return;
  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;
  const roleId = config.cargos?.torcedores;
  const ping = roleId ? `<@&${roleId}> ` : '';
  await channel.send({ content: `${ping}📣 Partida chegando na Cabine!`, embeds: [buildReminderEmbed(match, threshold)] });
}

async function checkReminders(client) {
  const configs = getAllConfigs();
  const sent = getSent();
  const games = allGames();

  for (const [guildId, config] of Object.entries(configs)) {
    if (!config?.modulos?.lembretes || !config?.canais?.lembretes) continue;
    for (const match of games) {
      const diff = minutesUntil(match);
      if (diff <= 0 || diff > 61) continue;
      for (const threshold of thresholds) {
        const key = `${guildId}:${match.id}:${threshold}`;
        const inWindow = diff <= threshold && diff > threshold - 1.5;
        if (inWindow && !sent[key]) {
          try {
            await sendReminder(client, guildId, config, match, threshold);
            markSent(key);
          } catch (error) {
            console.error('[reminderService] Erro ao enviar lembrete:', error);
          }
        }
      }
    }
  }
}

function startReminderScheduler(client) {
  const seconds = Number(process.env.REMINDER_CHECK_SECONDS || 60);
  setInterval(() => checkReminders(client), Math.max(seconds, 15) * 1000);
  setTimeout(() => checkReminders(client), 5000);
  console.log(`[lembretes] Scheduler iniciado. Verificação a cada ${seconds}s.`);
}

module.exports = { startReminderScheduler, checkReminders, thresholds };
