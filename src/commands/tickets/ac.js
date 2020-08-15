const AccessLevel = require('../../enums/AccessLevel');
const EmbedGenerator = require('../../utils/EmbedGenerator');
const Ticket = require('../../db/models/Ticket');

module.exports = {
  command: 'ac',
  accessLevel: AccessLevel.SUPPORT,
  execute: async (message) => {
    const channel = await Ticket.findOne({ where: { id: message.channel.id } });

    if (channel) {
      message.channel.send(EmbedGenerator.generate('Is there anything else we can help you with today?'));
    }
  },
};
