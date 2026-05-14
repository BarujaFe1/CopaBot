const { SlashCommandBuilder } = require('discord.js');
const { parseDateInput, getByDate } = require('../services/jogosService');
const { getTransmission } = require('../services/transmissaoService');
const { gamesEmbeds, errorEmbed } = require('../utils/embeds');
const { formatDateBR } = require('../utils/date');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jogos')
    .setDescription('Mostra os jogos do dia ou de uma data específica.')
    .addStringOption(option => option.setName('data').setDescription('Data no formato DD/MM. Exemplo: 13/06').setRequired(false)),
  async execute(interaction) {
    const input = interaction.options.getString('data');
    const parsed = parseDateInput(input);
    if (!parsed.ok) return interaction.reply({ embeds: [errorEmbed('Data inválida', parsed.error)], ephemeral: true });
    const games = getByDate(parsed.value);
    const title = input ? `Jogos de ${formatDateBR(parsed.value)} na Cabine` : 'Jogos de hoje na Cabine do Glória FC';
    const embeds = gamesEmbeds(title, games.length ? 'Agenda oficial da tabela carregada para a Copa 2026.' : 'Nenhuma partida encontrada para esta data.', games, match => getTransmission(match.id).text);
    await interaction.reply({ embeds });
  }
};
