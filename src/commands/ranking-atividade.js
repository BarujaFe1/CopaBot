const { SlashCommandBuilder } = require('discord.js');
const { getRanking } = require('../services/atividadeService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ranking-atividade').setDescription('Mostra o ranking de atividade da torcida.'),
  async execute(interaction) {
    const ranking = getRanking(interaction.guildId, 10);
    if (!ranking.length) return interaction.reply({ embeds: [warningEmbed('Ranking vazio', 'Ainda não há atividade registrada neste servidor.')], ephemeral: true });
    const description = ranking.map((u, i) => `**${i + 1}.** <@${u.userId}> — **${u.points} pts** (${u.messages} msg, ${u.reactions} reações, ${u.voiceMinutes} min voz)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('🔥 Atividade da torcida', description)] });
  }
};
