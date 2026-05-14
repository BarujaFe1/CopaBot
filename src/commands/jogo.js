const { SlashCommandBuilder } = require('discord.js');
const { getByTeam, autocompleteTeams } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jogo')
    .setDescription('Mostra os próximos jogos de uma seleção.')
    .addStringOption(option => option.setName('time').setDescription('Nome da seleção. Exemplo: Brasil').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) {
    await interaction.respond(autocompleteTeams(interaction.options.getFocused()));
  },
  async execute(interaction) {
    const team = interaction.options.getString('time');
    const games = getByTeam(team, true);
    if (!games.length) return interaction.reply({ embeds: [errorEmbed('Time não encontrado', `Não encontrei próximos jogos para “${team}”.`)], ephemeral: true });
    const embeds = gamesEmbeds(`Próximos jogos de ${team}`, 'Consulta sem depender de acentos ou letras maiúsculas.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};
