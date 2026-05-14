const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { normalizeText } = require('../utils/normalize');

const filePath = path.join(__dirname, '..', 'data', 'atividade.json');
const messageCooldownMs = 30_000;
const reactionCooldownMs = 20_000;

function getData() { return readJson(filePath, {}); }
function saveData(data) { writeJson(filePath, data); }

function ensureUser(data, guildId, userId) {
  data[guildId] ||= { users: {} };
  data[guildId].users[userId] ||= {
    userId,
    points: 0,
    messages: 0,
    reactions: 0,
    voiceMinutes: 0,
    lastMessageAt: null,
    lastMessageKey: null,
    lastReactionAt: null,
    voiceJoinAt: null
  };
  return data[guildId].users[userId];
}

function addMessage(message) {
  if (!message.guild || message.author.bot) return;
  const content = normalizeText(message.content || '');
  if (content.length < 4) return;
  const now = Date.now();
  const data = getData();
  const user = ensureUser(data, message.guild.id, message.author.id);
  const lastMessageAt = user.lastMessageAt ? Date.parse(user.lastMessageAt) : 0;
  if (now - lastMessageAt < messageCooldownMs) return;
  if (user.lastMessageKey === content && now - lastMessageAt < 5 * 60_000) return;
  user.messages += 1;
  user.points += 1;
  user.lastMessageAt = new Date(now).toISOString();
  user.lastMessageKey = content;
  saveData(data);
}

function addReaction(reaction, userObj) {
  const guildId = reaction.message.guildId;
  if (!guildId || userObj.bot) return;
  const now = Date.now();
  const data = getData();
  const user = ensureUser(data, guildId, userObj.id);
  const lastReactionAt = user.lastReactionAt ? Date.parse(user.lastReactionAt) : 0;
  if (now - lastReactionAt < reactionCooldownMs) return;
  user.reactions += 1;
  user.points += 1;
  user.lastReactionAt = new Date(now).toISOString();
  saveData(data);
}

function voiceJoin(guildId, userId) {
  const data = getData();
  const user = ensureUser(data, guildId, userId);
  user.voiceJoinAt = new Date().toISOString();
  saveData(data);
}

function voiceLeave(guildId, userId) {
  const data = getData();
  const user = ensureUser(data, guildId, userId);
  if (!user.voiceJoinAt) return;
  const minutes = Math.floor((Date.now() - Date.parse(user.voiceJoinAt)) / 60000);
  if (minutes >= 5) {
    const points = Math.min(Math.floor(minutes / 5), 12);
    user.voiceMinutes += minutes;
    user.points += points;
  }
  user.voiceJoinAt = null;
  saveData(data);
}

function getRanking(guildId, limit = 10) {
  const users = Object.values(getData()[guildId]?.users || {});
  return users.sort((a, b) => b.points - a.points).slice(0, limit);
}

function getUserActivity(guildId, userId) {
  const data = getData();
  return data[guildId]?.users?.[userId] || null;
}

function resetActivity(guildId) {
  const data = getData();
  data[guildId] = { users: {} };
  saveData(data);
}

module.exports = { addMessage, addReaction, voiceJoin, voiceLeave, getRanking, getUserActivity, resetActivity };
