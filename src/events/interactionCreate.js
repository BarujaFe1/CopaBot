const { errorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try { await command.autocomplete(interaction); } catch (error) { console.error(error); }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[command:${interaction.commandName}]`, error);
      const payload = { embeds: [errorEmbed('Erro inesperado', 'Algo deu errado ao executar este comando. Verifique os logs do bot.')] };
      if (interaction.deferred || interaction.replied) await interaction.followUp({ ...payload, ephemeral: true });
      else await interaction.reply({ ...payload, ephemeral: true });
    }
  }
};
