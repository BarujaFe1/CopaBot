const { SlashCommandBuilder } = require('discord.js');
const { getByTeam, autocompleteTeams } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Consulta próximos jogos por seleção.')
    .addStringOption(option => option.setName('nome').setDescription('Nome da seleção. Exemplo: Brasil').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteTeams(interaction.options.getFocused())); },
  async execute(interaction) {
    const team = interaction.options.getString('nome');
    const games = getByTeam(team, true);
    if (!games.length) return interaction.reply({ embeds: [errorEmbed('Time não encontrado', `Não encontrei próximos jogos para “${team}”.`)], ephemeral: true });
    const embeds = gamesEmbeds(`Próximos jogos de ${team}`, 'Busca normalizada: ignora acentos e maiúsculas.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};
