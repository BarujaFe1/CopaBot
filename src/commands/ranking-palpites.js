const { SlashCommandBuilder } = require('discord.js');
const { calculateRanking } = require('../services/palpitesService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('ranking-palpites').setDescription('Mostra o ranking do bolão.'),
  async execute(interaction) {
    const ranking = calculateRanking(interaction.guildId).slice(0, 10);
    if (!ranking.length) return interaction.reply({ embeds: [warningEmbed('Ranking vazio', 'Ainda não há jogos apurados com palpites pontuados.')], ephemeral: true });
    const description = ranking.map((item, index) => `**${index + 1}.** <@${item.userId}> — **${item.points} pts** (${item.bets} jogos, ${item.exact} placares exatos)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('🏆 Ranking do bolão', description)] });
  }
};
