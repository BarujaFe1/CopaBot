const { addMessage } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (!message.guild || message.author.bot) return;
    const config = getGuildConfig(message.guild.id);
    if (!config.modulos?.atividade) return;
    addMessage(message);
  }
};
