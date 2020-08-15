const AccessLevel = require('../../../enums/AccessLevel');
const EmbedGenerator = require('../../../utils/EmbedGenerator');
const Ticket = require('../../../db/models/Ticket');

module.exports = {
  command: 'forceclose',
  accessLevel: AccessLevel.SUPPORT,
  description: 'Force closes a ticket',
  execute: async (message) => {
    const channel = await Ticket.findOne({ where: { id: message.channel.id } });

    if (channel) {
      message.channel.send(EmbedGenerator.generate(`This ticket has been force closed by ${message.author} and will be closed in 10 seconds`));
      channel.resolvedDate = Date.now();
      await channel.save();
      setTimeout(() => message.channel.delete(), 10000);
    }
  },
};
