const { SlashCommandBuilder } = require('discord.js');
const { getByGroup } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('grupo')
    .setDescription('Mostra informações e jogos de um grupo.')
    .addStringOption(option => option.setName('nome').setDescription('Letra do grupo. Exemplo: C').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('nome');
    const { group, games } = getByGroup(name);
    if (!group) return interaction.reply({ embeds: [errorEmbed('Grupo não encontrado', 'Use uma letra de A a L. Exemplo: /grupo nome:C')], ephemeral: true });
    const embeds = gamesEmbeds(`${group.nome} — Copa 2026`, `Seleções: **${group.times.join(', ')}**`, games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};
