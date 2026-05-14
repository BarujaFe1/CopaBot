const { SlashCommandBuilder } = require('discord.js');
const { allGames } = require('../services/jogosService');
const { findTransmissionByTeams } = require('../services/transmissaoService');
const { baseEmbed, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transmissao')
    .setDescription('Mostra onde vai passar um confronto.')
    .addStringOption(option => option.setName('time1').setDescription('Primeiro time. Exemplo: Brasil').setRequired(true))
    .addStringOption(option => option.setName('time2').setDescription('Segundo time. Exemplo: Marrocos').setRequired(true)),
  async execute(interaction) {
    const time1 = interaction.options.getString('time1');
    const time2 = interaction.options.getString('time2');
    const found = findTransmissionByTeams(allGames(), time1, time2);
    if (!found) return interaction.reply({ embeds: [errorEmbed('Confronto não encontrado', 'Não encontrei esse jogo na tabela carregada.')], ephemeral: true });
    const { match, transmission } = found;
    const embed = baseEmbed('📺 Transmissão do confronto', `**${match.time1} x ${match.time2}**`)
      .addFields(
        { name: 'Data e horário', value: `${formatDateBR(match.data)} às ${match.hora}`, inline: true },
        { name: 'Fase', value: match.grupo ? `${match.fase} • ${match.grupo}` : match.fase, inline: true },
        { name: 'Onde vai passar', value: transmission.text, inline: false }
      );
    if (transmission.observacoes) embed.addFields({ name: 'Observações', value: transmission.observacoes });
    await interaction.reply({ embeds: [embed] });
  }
};
