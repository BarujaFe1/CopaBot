const { SlashCommandBuilder } = require('discord.js');
const { getUserBets } = require('../services/palpitesService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');
const { formatDateShort } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder().setName('meus-palpites').setDescription('Mostra seus palpites registrados.'),
  async execute(interaction) {
    const bets = getUserBets(interaction.guildId, interaction.user.id);
    if (!bets.length) return interaction.reply({ embeds: [warningEmbed('Sem palpites', 'Você ainda não registrou palpites.')], ephemeral: true });
    const embed = baseEmbed('🎯 Meus palpites', 'Seus palpites cadastrados na Cabine.');
    embed.addFields(bets.slice(0, 25).map(({ match, bet }) => ({
      name: `${formatDateShort(match.data)} ${match.hora} — ${match.time1} x ${match.time2}`,
      value: `Vencedor: **${bet.winner}** • Placar: **${bet.score ? `${bet.score.gols1}x${bet.score.gols2}` : 'não informado'}**`
    })));
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
