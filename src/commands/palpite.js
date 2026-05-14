const { SlashCommandBuilder } = require('discord.js');
const { placeBet } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('palpite')
    .setDescription('Registra seu palpite para um jogo.')
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo. Use o autocomplete.').setRequired(true).setAutocomplete(true))
    .addStringOption(opt => opt.setName('vencedor').setDescription('Time vencedor ou Empate').setRequired(true))
    .addStringOption(opt => opt.setName('placar').setDescription('Opcional. Exemplo: 2x0').setRequired(false)),
  async autocomplete(interaction) {
    await interaction.respond(autocompleteMatches(interaction.options.getFocused()));
  },
  async execute(interaction) {
    const result = placeBet({
      guildId: interaction.guildId,
      userId: interaction.user.id,
      matchQuery: interaction.options.getString('jogo'),
      winner: interaction.options.getString('vencedor'),
      score: interaction.options.getString('placar')
    });
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Palpite não registrado', result.error)], ephemeral: true });
    const score = result.bet.score ? `${result.bet.score.gols1}x${result.bet.score.gols2}` : 'sem placar exato';
    const embed = successEmbed('Palpite registrado', `**${result.match.time1} x ${result.match.time2}**\n📅 ${formatDateBR(result.match.data)} às ${result.match.hora}\n🏁 Vencedor: **${result.bet.winner}**\n🎯 Placar: **${score}**`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
