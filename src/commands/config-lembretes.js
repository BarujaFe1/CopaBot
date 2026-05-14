const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('../services/configService');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-lembretes')
    .setDescription('Define o canal de lembretes automáticos.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(opt => opt.setName('canal').setDescription('Canal de lembretes').addChannelTypes(ChannelType.GuildText).setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    setChannel(interaction.guildId, 'lembretes', channel.id);
    await interaction.reply({ embeds: [successEmbed('Canal configurado', `Lembretes serão enviados em ${channel}.`)], ephemeral: true });
  }
};
