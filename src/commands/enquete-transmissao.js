const { SlashCommandBuilder } = require('discord.js');
const { findMatch, autocompleteMatches } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { createReactionPoll } = require('../services/enqueteService');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enquete-transmissao')
    .setDescription('Cria enquete para escolher onde assistir a um jogo.')
    .addStringOption(opt => opt.setName('jogo').setDescription('Jogo').setRequired(true).setAutocomplete(true)),
  async autocomplete(interaction) { await interaction.respond(autocompleteMatches(interaction.options.getFocused())); },
  async execute(interaction) {
    const match = findMatch(interaction.options.getString('jogo'));
    if (!match) return interaction.reply({ embeds: [errorEmbed('Jogo não encontrado', 'Use o autocomplete para escolher um jogo válido.')], ephemeral: true });
    const t = getTransmission(match.id).list;
    const options = t.length && t[0] !== 'A definir' ? t : ['A definir', 'Vamos decidir no dia'];
    await createReactionPoll(interaction, `Qual transmissão vamos assistir? ${match.time1} x ${match.time2}`, options);
  }
};
