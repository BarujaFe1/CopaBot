const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resetActivity } = require('../services/atividadeService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-atividade')
    .setDescription('Zera o ranking de atividade deste servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    resetActivity(interaction.guildId);
    await interaction.reply({ embeds: [successEmbed('Atividade zerada', 'O ranking de atividade foi reiniciado para este servidor.')], ephemeral: true });
  }
};
