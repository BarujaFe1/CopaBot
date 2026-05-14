const { SlashCommandBuilder } = require('discord.js');
const { getByTeam } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('brasil').setDescription('Mostra os próximos jogos do Brasil.'),
  async execute(interaction) {
    const games = getByTeam('Brasil', true);
    await interaction.reply({ embeds: gamesEmbeds('Próximo compromisso do Brasil', 'Agenda da Seleção Brasileira na Copa 2026.', games, match => getTransmission(match.id).text) });
  }
};
