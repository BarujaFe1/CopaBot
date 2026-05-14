const { SlashCommandBuilder } = require('discord.js');
const { getUserActivity } = require('../services/atividadeService');
const { baseEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('atividade')
    .setDescription('Mostra atividade de um usuário.')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const data = getUserActivity(interaction.guildId, user.id);
    if (!data) return interaction.reply({ embeds: [warningEmbed('Sem atividade', `${user} ainda não possui atividade registrada.`)], ephemeral: true });
    const embed = baseEmbed('📈 Atividade da torcida', `${user}`)
      .addFields(
        { name: 'Pontos', value: String(data.points), inline: true },
        { name: 'Mensagens', value: String(data.messages), inline: true },
        { name: 'Reações', value: String(data.reactions), inline: true },
        { name: 'Voz', value: `${data.voiceMinutes} min`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
