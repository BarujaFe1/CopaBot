const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { registerResult } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resultado')
    .setDescription('Cadastra o resultado de um jogo e libera a pontuação do bolão.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true))
    .addIntegerOption(opt => opt.setName('gols1').setDescription('Gols do time 1').setRequired(true).setMinValue(0))
    .addIntegerOption(opt => opt.setName('gols2').setDescription('Gols do time 2').setRequired(true).setMinValue(0)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const result = registerResult({
      matchQuery: interaction.options.getString('jogo'),
      gols1: interaction.options.getInteger('gols1'),
      gols2: interaction.options.getInteger('gols2'),
      userId: interaction.user.id
    });
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Resultado não cadastrado', result.error)], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed('Resultado cadastrado', `**${result.match.time1} ${result.result.gols1} x ${result.result.gols2} ${result.match.time2}**\nResultado usado no cálculo do ranking do bolão.`)] });
  }
};
