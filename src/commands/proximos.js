const { SlashCommandBuilder } = require('discord.js');
const { getUpcoming } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('proximos')
    .setDescription('Mostra os próximos jogos da tabela.')
    .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade de jogos, até 20.').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    const limit = interaction.options.getInteger('quantidade') || 10;
    const games = getUpcoming(limit);
    await interaction.reply({ embeds: gamesEmbeds('Próximos jogos da Copa 2026', `Mostrando até ${limit} partidas.`, games, match => getTransmission(match.id).text) });
  }
};
