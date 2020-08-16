const AccessLevel = require('../../../enums/AccessLevel');
const EmbedGenerator = require('../../../utils/EmbedGenerator');
const Ticket = require('../../../db/models/Ticket');
const User = require('../../../db/models/User');

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
      await setTimeout(async () => {
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
        message.channel.delete();
      }, 10000);
    }
  },
};
