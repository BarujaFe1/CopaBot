const { SlashCommandBuilder } = require('discord.js');
const { getByTeam } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('argentina').setDescription('Mostra os próximos jogos da Argentina.'),
  async execute(interaction) {
    const games = getByTeam('Argentina', true);
    await interaction.reply({ embeds: gamesEmbeds('Próximos jogos da Argentina', 'Agenda da Argentina na Copa 2026.', games, match => getTransmission(match.id).text) });
  }
};
