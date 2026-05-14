const path = require('path');
const { readJson, writeJson } = require('../storage/jsonStore');
const { baseEmbed } = require('../utils/embeds');
const { colors } = require('../config/theme');

const filePath = path.join(__dirname, '..', 'data', 'enquetes.json');
const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

function getPolls() { return readJson(filePath, {}); }
function savePolls(data) { writeJson(filePath, data); }

function buildPollEmbed(question, options, authorTag) {
  const description = options.map((option, index) => `${emojis[index]} ${option}`).join('\n');
  return baseEmbed('📊 Enquete no ar', `**${question}**\n\n${description}`, colors.gold)
    .addFields({ name: 'Como votar', value: 'Clique na reação correspondente à sua escolha.', inline: false })
    .setFooter({ text: `Cabine do Glória FC • criada por ${authorTag}` });
}

async function createReactionPoll(interaction, question, options) {
  const embed = buildPollEmbed(question, options, interaction.user.tag);
  await interaction.reply({ embeds: [embed], fetchReply: true });
  const message = await interaction.fetchReply();
  for (let i = 0; i < options.length; i += 1) {
    await message.react(emojis[i]).catch(() => null);
  }
  const data = getPolls();
  data[message.id] = {
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    messageId: message.id,
    question,
    options,
    emojis: emojis.slice(0, options.length),
    createdBy: interaction.user.id,
    createdAt: new Date().toISOString()
  };
  savePolls(data);
  return message;
}

module.exports = { createReactionPoll, buildPollEmbed, emojis };
