const { addReaction } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    if (reaction.partial) await reaction.fetch().catch(() => null);
    if (!reaction.message?.guildId || user.bot) return;
    const config = getGuildConfig(reaction.message.guildId);
    if (!config.modulos?.atividade) return;
    addReaction(reaction, user);
  }
};
