const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, setModule } = require('../services/configService');
const { baseEmbed, successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lembretes')
    .setDescription('Gerencia lembretes automáticos.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub.setName('status').setDescription('Mostra o status dos lembretes.'))
    .addSubcommand(sub => sub.setName('ligar').setDescription('Ativa lembretes.'))
    .addSubcommand(sub => sub.setName('desligar').setDescription('Desativa lembretes.')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'ligar') {
      setModule(interaction.guildId, 'lembretes', true);
      return interaction.reply({ embeds: [successEmbed('Lembretes ligados', 'A Cabine vai avisar 1h, 30min e 10min antes das partidas.')], ephemeral: true });
    }
    if (sub === 'desligar') {
      setModule(interaction.guildId, 'lembretes', false);
      return interaction.reply({ embeds: [successEmbed('Lembretes desligados', 'Os avisos automáticos foram pausados.')], ephemeral: true });
    }
    const config = getGuildConfig(interaction.guildId);
    const embed = baseEmbed('⏰ Status dos lembretes', config.modulos.lembretes ? 'Lembretes ativos.' : 'Lembretes desativados.')
      .addFields(
        { name: 'Canal', value: config.canais.lembretes ? `<#${config.canais.lembretes}>` : 'Não definido', inline: true },
        { name: 'Cargo', value: config.cargos.torcedores ? `<@&${config.cargos.torcedores}>` : 'Não definido', inline: true },
        { name: 'Avisos', value: '60, 30 e 10 minutos antes do jogo', inline: false }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
