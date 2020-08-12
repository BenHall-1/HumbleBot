const AccessLevel = require('../enums/AccessLevel');
const { TICKET_CATEGORY } = require('../utils/config');
const EmbedGenerator = require('../utils/EmbedGenerator');

const Ticket = require('../db/models/Ticket');

module.exports = {
  command: 'new',
  accessLevel: AccessLevel.EVERYONE,
  execute: async (message) => {
    const newTicketMessage = await message.channel.send(EmbedGenerator.generate('Your ticket is being created...'));

    const count = await Ticket.count();
    const newTicketId = count + 1;
    message.guild.channels.create(`ticket-${newTicketId}`, {
      type: 'text',
      parent: TICKET_CATEGORY,
      permissionOverwrites: [
        { id: message.guild.roles.everyone.id, deny: ['VIEW_CHANNEL'] },
        { id: message.author.id, allow: ['VIEW_CHANNEL'] },
      ],
    }).then(async (ticketChannel) => {
      await Ticket.create({
        id: ticketChannel.id,
        creator: message.author.id,
        creationDate: Date.now(),
      });

      const ticketOptions = { category: 'General', email: '', serverId: '' };

      const mainMessage = await ticketChannel.send(EmbedGenerator.generate('Thank you for opening a ticket, please answer the questions below'));

      await newTicketMessage.edit(EmbedGenerator.generate(`Your ticket has been opened here: ${ticketChannel}`));
      newTicketMessage.delete({ timeout: 10000 });

      const ticketCategoryString = ''
        + 'Please react with the area that your ticket is about\n\n'
        + '\n🖥️ - Server Support'
        + '\n💳 - Billing Support'
        + '\n🌐 - Website Support'
        + '\n❓ - General Queries';

      const ticketCategoryMessage = await ticketChannel.send(
        EmbedGenerator.generate(ticketCategoryString),
      );

      ticketCategoryMessage.react('🖥️')
        .then(() => ticketCategoryMessage.react('💳'))
        .then(() => ticketCategoryMessage.react('🌐'))
        .then(() => ticketCategoryMessage.react('❓'));

      const options = { max: 1, time: 60000, errors: ['time'] };
      const ticketCategoryFilter = (react, user) => ['🖥️', '💳', '🌐', '❓'].includes(react.emoji.name) && user.id === message.author.id;

      await ticketCategoryMessage.awaitReactions(ticketCategoryFilter, options)
        .then(async (ticketCategoryCollected) => {
          const reaction = ticketCategoryCollected.first();
          switch (reaction) {
            case '🖥️':
              ticketOptions.category = 'Server Support';
              return;
            case '💳':
              ticketOptions.category = 'Billing Support';
              return;
            case '🌐':
              ticketOptions.category = 'Website Support';
              return;
            default:
              ticketOptions.category = 'General Enquiries';
          }
          ticketCategoryMessage.delete();

          const billingEmailMessage = await ticketChannel.send(EmbedGenerator.generate('Please reply with your Billing Email *(Put N/A if you do not have an account)*'));

          const messageFilter = (m) => m.author.id === message.author.id;
          await ticketChannel.awaitMessages(messageFilter, options)
            .then(async (billingEmailCollected) => {
              ticketOptions.email = billingEmailCollected.first();
              billingEmailMessage.delete();

              const serverIdMessage = await ticketChannel.send(EmbedGenerator.generate('Please reply with your Server Id *(Put N/A if you do not have a server)*'));
              await ticketChannel.awaitMessages(messageFilter, options)
                .then(async (serverIdCollected) => {
                  ticketOptions.serverId = serverIdCollected.first();
                  serverIdMessage.delete();
                  mainMessage.edit(EmbedGenerator.generate('Thank you for opening a ticket', null, [
                    { name: 'Category', value: ticketOptions.category, inline: false },
                    { name: 'Billing Email', value: ticketOptions.email, inline: false },
                    { name: 'Server Id', value: ticketOptions.serverId, inline: false }
                  ]));
                });
            });
        });
    });
  },
};
