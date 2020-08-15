const AccessLevel = require('../../enums/AccessLevel');
const EmbedGenerator = require('../../utils/EmbedGenerator');
const Ticket = require('../../db/models/Ticket');

module.exports = {
  command: 'hi',
  accessLevel: AccessLevel.SUPPORT,
  execute: async (message) => {
    const channel = await Ticket.findOne({ where: { id: message.channel.id } });

    if (channel) {
      message.channel.send(EmbedGenerator.generate(`Hello, ${message.author} will be assisting you today. How can we help?`));
    }
  },
};
