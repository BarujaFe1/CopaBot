const { voiceJoin, voiceLeave } = require('../services/atividadeService');
const { getGuildConfig } = require('../services/configService');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const guildId = oldState.guild.id;
    const config = getGuildConfig(guildId);
    if (!config.modulos?.atividade) return;
    if (!oldState.channelId && newState.channelId) voiceJoin(guildId, newState.id);
    if (oldState.channelId && !newState.channelId) voiceLeave(guildId, oldState.id);
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      voiceLeave(guildId, oldState.id);
      voiceJoin(guildId, newState.id);
    }
  }
};
