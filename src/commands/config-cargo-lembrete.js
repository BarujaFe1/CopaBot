const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setRole } = require('../services/configService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-cargo-lembrete')
    .setDescription('Define o cargo marcado nos lembretes.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo a mencionar').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('cargo');
    setRole(interaction.guildId, 'torcedores', role.id);
    await interaction.reply({ embeds: [successEmbed('Cargo configurado', `Lembretes poderão marcar ${role}.`)], ephemeral: true });
  }
};
