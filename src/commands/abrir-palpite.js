const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setBetLock } = require('../services/palpitesService');
const { autocompleteMatches } = require('../services/jogosService');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abrir-palpite')
    .setDescription('Abre manualmente os palpites de um jogo.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const result = setBetLock(interaction.guildId, interaction.options.getString('jogo'), 'open');
    if (!result.ok) return interaction.reply({ embeds: [errorEmbed('Erro', result.error)], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed('Palpites abertos', `${result.match.time1} x ${result.match.time2}`)], ephemeral: true });
  }
};
