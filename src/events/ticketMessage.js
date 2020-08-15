const Ticket = require('../db/models/Ticket');
const TicketMessage = require('../db/models/TicketMessage');

module.exports = {
  handle: async (client, message) => {
    const ticket = await Ticket.findOne({ where: { id: message.channel.id } });

    if (ticket) {
      await TicketMessage.create({
        id: message.id,
        author: message.author.id,
        content: message.embeds.length > 0 ? message.embeds[0].description : message.content,
        timestamp: Date.now(),
      });
    }
  },
};
