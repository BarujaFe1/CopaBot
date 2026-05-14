const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { timezone } = require('../config/theme');

const filePath = path.join(__dirname, '..', 'data', 'guild-configs.json');

const defaultGuildConfig = {
  timezone,
  canais: {
    jogos: null,
    lembretes: null,
    enquetes: null
  },
  cargos: {
    torcedores: null
  },
  modulos: {
    jogos: true,
    lembretes: false,
    palpites: true,
    atividade: true,
    enquetes: true
  },
  palpites: {
    bloqueioMinutos: 10
  }
};

function getAllConfigs() {
  return readJson(filePath, {});
}

function getGuildConfig(guildId) {
  const all = getAllConfigs();
  return { ...defaultGuildConfig, ...(all[guildId] || {}), canais: { ...defaultGuildConfig.canais, ...((all[guildId] || {}).canais || {}) }, cargos: { ...defaultGuildConfig.cargos, ...((all[guildId] || {}).cargos || {}) }, modulos: { ...defaultGuildConfig.modulos, ...((all[guildId] || {}).modulos || {}) }, palpites: { ...defaultGuildConfig.palpites, ...((all[guildId] || {}).palpites || {}) } };
}

function saveGuildConfig(guildId, config) {
  const all = getAllConfigs();
  all[guildId] = config;
  writeJson(filePath, all);
  return config;
}

function updateGuildConfig(guildId, updater) {
  const current = getGuildConfig(guildId);
  const next = updater(current) || current;
  return saveGuildConfig(guildId, next);
}

function setChannel(guildId, key, channelId) {
  return updateGuildConfig(guildId, config => {
    config.canais[key] = channelId;
    return config;
  });
}

function setRole(guildId, key, roleId) {
  return updateGuildConfig(guildId, config => {
    config.cargos[key] = roleId;
    return config;
  });
}

function setModule(guildId, moduleName, enabled) {
  return updateGuildConfig(guildId, config => {
    config.modulos[moduleName] = Boolean(enabled);
    return config;
  });
}

module.exports = { defaultGuildConfig, getAllConfigs, getGuildConfig, saveGuildConfig, updateGuildConfig, setChannel, setRole, setModule };
