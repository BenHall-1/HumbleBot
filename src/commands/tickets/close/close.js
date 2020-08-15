const AccessLevel = require('../../../enums/AccessLevel');
const EmbedGenerator = require('../../../utils/EmbedGenerator');
const Ticket = require('../../../db/models/Ticket');

module.exports = {
  command: 'close',
  accessLevel: AccessLevel.EVERYONE,
  execute: async (message) => {
    const channel = await Ticket.findOne({ where: { id: message.channel.id } });

    if (channel) {
      const closeString = 'Are you sure you want to close this ticket? Once this action has been taken, it cannot be reversed\n\n'
      + 'If you are sure you want to close this ticket, please react with a ✅, else react with an ❌\n\n'
      + 'This will timeout in 30 seconds';

      const closeMessage = await message.channel.send(EmbedGenerator.generate(closeString));

      closeMessage.react('✅')
        .then(() => closeMessage.react('❌'));

      const options = { max: 1, time: 30000, errors: ['time'] };
      const filter = (react, user) => ['✅', '❌'].includes(react.emoji.name) && user.id === message.author.id;

      await closeMessage.awaitReactions(filter, options)
        .then(async (reactions) => {
          switch (reactions.first()) {
            case '✅':
              message.channel.send(EmbedGenerator.generate('Ticket closure confirmed. This channel will be deleted in 30 seconds'));
              setTimeout(() => message.channel.delete(), 30000);
              break;
            case '❌':
              closeMessage.delete();
              break;
            default:
              closeMessage.delete();
          }
        })
        .catch(() => closeMessage.delete());
    }
  },
};
