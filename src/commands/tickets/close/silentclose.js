const AccessLevel = require('../../../enums/AccessLevel');
const Ticket = require('../../../db/models/Ticket');

module.exports = {
  command: 'silentclose',
  accessLevel: AccessLevel.SUPPORT,
  execute: async (message) => {
    const channel = await Ticket.findOne({ where: { id: message.channel.id } });

    if (channel) {
      channel.resolvedDate = Date.now();
      await channel.save();
      message.channel.delete();
    }
  },
};
