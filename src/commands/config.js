const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, setChannel, setRole, setModule } = require('../services/configService');
const { successEmbed, baseEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configura canais, cargos e módulos do bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub => sub.setName('ver').setDescription('Mostra a configuração atual.'))
    .addSubcommand(sub => sub.setName('canal-jogos').setDescription('Define o canal padrão de jogos.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('canal-lembretes').setDescription('Define o canal de lembretes.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('canal-enquetes').setDescription('Define o canal de enquetes.').addChannelOption(opt => opt.setName('canal').setDescription('Canal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sub => sub.setName('cargo-torcedores').setDescription('Define o cargo marcado nos lembretes.').addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
    .addSubcommand(sub => sub.setName('modulo').setDescription('Liga ou desliga um módulo.').addStringOption(opt => opt.setName('nome').setDescription('jogos, lembretes, palpites, atividade, enquetes').setRequired(true)).addStringOption(opt => opt.setName('status').setDescription('on/off').setRequired(true).addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' }))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (sub === 'ver') {
      const c = getGuildConfig(guildId);
      const embed = baseEmbed('⚙️ Configuração da Cabine', 'Configuração atual deste servidor.')
        .addFields(
          { name: 'Canais', value: `Jogos: ${c.canais.jogos ? `<#${c.canais.jogos}>` : 'não definido'}\nLembretes: ${c.canais.lembretes ? `<#${c.canais.lembretes}>` : 'não definido'}\nEnquetes: ${c.canais.enquetes ? `<#${c.canais.enquetes}>` : 'não definido'}` },
          { name: 'Cargos', value: `Torcedores: ${c.cargos.torcedores ? `<@&${c.cargos.torcedores}>` : 'não definido'}` },
          { name: 'Módulos', value: Object.entries(c.modulos).map(([k, v]) => `${k}: ${v ? 'on' : 'off'}`).join('\n') },
          { name: 'Palpites', value: `Bloqueio: ${c.palpites.bloqueioMinutos} min antes do jogo` }
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (sub.startsWith('canal-')) {
      const channel = interaction.options.getChannel('canal');
      const key = sub.replace('canal-', '') === 'jogos' ? 'jogos' : sub.replace('canal-', '');
      setChannel(guildId, key, channel.id);
      return interaction.reply({ embeds: [successEmbed('Configuração salva', `Canal de ${key} definido como ${channel}.`)], ephemeral: true });
    }
    if (sub === 'cargo-torcedores') {
      const role = interaction.options.getRole('cargo');
      setRole(guildId, 'torcedores', role.id);
      return interaction.reply({ embeds: [successEmbed('Configuração salva', `Cargo de torcedores definido como ${role}.`)], ephemeral: true });
    }
    if (sub === 'modulo') {
      const moduleName = interaction.options.getString('nome');
      const status = interaction.options.getString('status') === 'on';
      const allowed = ['jogos', 'lembretes', 'palpites', 'atividade', 'enquetes'];
      if (!allowed.includes(moduleName)) return interaction.reply({ embeds: [errorEmbed('Módulo inválido', `Use: ${allowed.join(', ')}`)], ephemeral: true });
      setModule(guildId, moduleName, status);
      return interaction.reply({ embeds: [successEmbed('Módulo atualizado', `${moduleName}: ${status ? 'on' : 'off'}`)], ephemeral: true });
    }
  }
};
