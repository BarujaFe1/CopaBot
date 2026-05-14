const { SlashCommandBuilder } = require('discord.js');
const { createReactionPoll } = require('../services/enqueteService');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enquete')
    .setDescription('Cria uma enquete rápida com reações.')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta da enquete').setRequired(true))
    .addStringOption(opt => opt.setName('op1').setDescription('Opção 1').setRequired(true))
    .addStringOption(opt => opt.setName('op2').setDescription('Opção 2').setRequired(true))
    .addStringOption(opt => opt.setName('op3').setDescription('Opção 3').setRequired(false))
    .addStringOption(opt => opt.setName('op4').setDescription('Opção 4').setRequired(false))
    .addStringOption(opt => opt.setName('op5').setDescription('Opção 5').setRequired(false)),
  async execute(interaction) {
    const question = interaction.options.getString('pergunta');
    const options = ['op1', 'op2', 'op3', 'op4', 'op5'].map(name => interaction.options.getString(name)).filter(Boolean);
    if (options.length < 2) return interaction.reply({ embeds: [errorEmbed('Enquete inválida', 'Informe pelo menos duas opções.')], ephemeral: true });
    await createReactionPoll(interaction, question, options);
  }
};
