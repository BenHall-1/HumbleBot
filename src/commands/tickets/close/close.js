const AccessLevel = require('../../../enums/AccessLevel');
const EmbedGenerator = require('../../../utils/EmbedGenerator');
const Ticket = require('../../../db/models/Ticket');
const User = require('../../../db/models/User');

module.exports = {
  command: 'close',
  accessLevel: AccessLevel.EVERYONE,
  description: 'Closes a ticket',
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
          console.log(reactions.first());
          switch (reactions.first().emoji.name) {
            case '✅': {
              message.channel.send(EmbedGenerator.generate('Ticket closure confirmed, This channel will be deleted in 30 seconds'));
              setTimeout(async () => {
                const user = await User.findOne({ where: { id: channel.creator } });
                if (user.receivedTrustPilotLink !== true) {
                  const discordMember = await message.guild.members.cache.get(user.id.toString());
                  await discordMember.createDM().then(async (pmChannel) => {
                    await pmChannel.send(EmbedGenerator.generate(
                      'Hi There! I noticed that our Support Team recently helped you out in a ticket. \n\nIf you feel like it, we\'d love for you to review us on TrustPilot by going to https://www.trustpilot.com/review/www.humbleservers.com',
                      'https://share.trustpilot.com/images/company-rating?locale=en-US&businessUnitId=5b2e9a9cd34c990001a89301',
                    ));
                    user.receivedTrustPilotLink = true;
                    await user.save();
                  });
                }
                channel.resolvedDate = Date.now();
                await channel.save();
                message.channel.delete();
              }, 30000);
              break;
            }
            case '❌':
              closeMessage.delete();
              break;
            default:
              closeMessage.delete();
              break;
          }
        })
        .catch(() => closeMessage.delete());
    }
  },
};
