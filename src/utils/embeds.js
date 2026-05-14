const { EmbedBuilder } = require('discord.js');
const { colors, footer } = require('../config/theme');
const { formatDateBR } = require('./date');

function baseEmbed(title, description = '', color = colors.gold) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description || null)
    .setFooter({ text: footer })
    .setTimestamp(new Date());
}

function errorEmbed(title, description) {
  return baseEmbed(`⚠️ ${title}`, description, colors.error);
}

function successEmbed(title, description) {
  return baseEmbed(`✅ ${title}`, description, colors.success);
}

function warningEmbed(title, description) {
  return baseEmbed(`📣 ${title}`, description, colors.warning);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function formatGameField(match, transmissaoText = 'Transmissão: a definir') {
  const fase = match.grupo ? `${match.fase} • ${match.grupo}` : match.fase;
  const codigo = match.jogo ? ` • ${match.jogo}` : '';
  return {
    name: `🕒 ${match.hora} — ${match.time1} x ${match.time2}`,
    value: `📅 ${formatDateBR(match.data)}\n🏆 ${fase}${codigo}\n📺 ${transmissaoText}`
  };
}

function gamesEmbeds(title, description, games, transmissaoResolver) {
  if (!games.length) return [warningEmbed(title, description || 'Nenhuma partida encontrada.')];
  const chunks = chunkArray(games, 10);
  return chunks.map((chunk, index) => {
    const embed = baseEmbed(index === 0 ? title : `${title} (${index + 1}/${chunks.length})`, description);
    embed.addFields(chunk.map(match => formatGameField(match, transmissaoResolver(match))));
    return embed;
  });
}

module.exports = { baseEmbed, errorEmbed, successEmbed, warningEmbed, gamesEmbeds, formatGameField };
