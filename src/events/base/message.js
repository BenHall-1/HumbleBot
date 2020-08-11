const { PREFIX } = require('../../utils/config');
const AccessLevel = require('../../enums/AccessLevel');
const EmbedGenerator = require('../../utils/EmbedGenerator');

module.exports = {
  handle: (client, message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    if (AccessLevel.hasAccess(message.member, command.accessLevel)) {
      command.execute(message, args);
    } else {
      message.channel.send(EmbedGenerator.generate('Access Denied', null, null, '#B12000'))
        .then((m) => m.delete({ timeout: 5000 }));
    }
  },
};
