const axios = require('axios').default;

const AccessLevel = require('../../enums/AccessLevel');

const Ticket = require('../../db/models/Ticket');
const TicketMessage = require('../../db/models/TicketMessage');
const User = require('../../db/models/User');

const EmbedGenerator = require('../../utils/EmbedGenerator');
const { SUPPORT_ROLE, TICKET_CATEGORY } = require('../../utils/config');

module.exports = {
  command: 'new',
  accessLevel: AccessLevel.EVERYONE,
  description: 'Creates a new ticket',
  execute: async (message) => {
    const channelCreatingMessage = await message.channel.send(EmbedGenerator.generate('Your ticket is being created...'));

    const ticketCount = await Ticket.count();
    const newTicketId = ticketCount + 1;

    message.guild.channels.create(`ticket-${newTicketId}`, {
      type: 'text',
      parent: TICKET_CATEGORY,
      permissionOverwrites: [
        { id: message.guild.roles.everyone.id, deny: ['VIEW_CHANNEL'] },
        { id: message.author.id, allow: ['VIEW_CHANNEL'] },
        { id: SUPPORT_ROLE, allow: ['VIEW_CHANNEL'] },
      ],
    }).then(async (ticketChannel) => {
      channelCreatingMessage.edit(EmbedGenerator.generate(`Your ticket has been created ${ticketChannel}`));
      const user = await User.findOne({ where: { id: message.author.id } });
      const accountVerified = user.pterodactylApiKey !== null;

      let servers = null;

      if (accountVerified) {
        await axios.get('https://panel.humbleservers.com/api/client', { headers: { Authorization: `Bearer ${user.pterodactylApiKey}` } })
          .then((response) => { servers = response.data.data; })
          .catch((error) => console.error(error));
      }

      const introMessage = `Welcome ${message.author},\n\n`
          + 'Thank you for opening a Support Ticket.\n\n'
          + '__Please explain the issue that you\'re having and a member of our team will get back to you__\n';

      const fields = [];

      if (servers) {
        fields.push({ name: 'Billing Email', value: user.billingEmail, inline: false });
        fields.push({ name: 'Servers', value: servers.map((server) => (`\`${server.attributes.identifier}\` - ${server.attributes.name}`)), inline: false });
      } else {
        fields.push({ name: 'Servers', value: '❌ You have not verified yourself so we cannot pull a list of your servers', inline: false });
      }

      ticketChannel.send(EmbedGenerator.generate(introMessage, null, fields));
      ticketChannel.send(`${message.author}`).then((m) => m.delete());
      const ticket = await Ticket.create({
        id: ticketChannel.id,
        creator: message.author.id,
        creationDate: Date.now(),
      });
      setTimeout(async () => {
        const responses = await TicketMessage.count({
          where: {
            author: message.author.id,
            ticket: ticketChannel.id,
          },
        });

        if (responses === 0) {
          ticket.resolvedDate = Date.now();
          await ticket.save();
          ticketChannel.delete();
        }
      }, 30 * 60 * 1000);
    });
  },
};
