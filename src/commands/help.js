const AccessLevel = require('../enums/AccessLevel');
const EmbedGenerator = require('../utils/EmbedGenerator');

module.exports = {
  command: 'help',
  accessLevel: AccessLevel.EVERYONE,
  description: 'Sends the help message',
  execute: async (message) => {
    const allCmds = message.client.commands;
    const filtered = allCmds.filter((c) => AccessLevel.hasAccess(message.member, c.accessLevel));
    const parsedCommands = filtered.map((command) => `\`${command.command}\` - ${command.description}`);
    message.channel.send(EmbedGenerator.generate(
      `Commands: \n${
        parsedCommands.join('\n')}`,
    ));
  },
};
