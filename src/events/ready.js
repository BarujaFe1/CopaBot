const { startReminderScheduler } = require('../services/reminderService');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Cabine do Glória FC online como ${client.user.tag}`);
    startReminderScheduler(client);
  }
};
