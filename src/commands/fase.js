const { SlashCommandBuilder } = require('discord.js');
const { getByPhase } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fase')
    .setDescription('Mostra jogos por fase.')
    .addStringOption(option => option.setName('nome').setDescription('grupos, 16avos, oitavas, quartas, semifinal, final').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('nome');
    const { phaseSlug, games } = getByPhase(name);
    if (!phaseSlug) return interaction.reply({ embeds: [errorEmbed('Fase não encontrada', 'Use: grupos, 16avos, oitavas, quartas, semifinal, final.')], ephemeral: true });
    await interaction.reply({ embeds: gamesEmbeds(`Fase: ${name}`, 'Jogos encontrados para a fase selecionada.', games, match => getTransmission(match.id).text) });
  }
};
