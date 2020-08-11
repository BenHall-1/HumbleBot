const discord = require('discord.js');

const fs = require('fs');
const path = require('path');
const { DISCORD_TOKEN } = require('./utils/config');

const client = new discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new discord.Collection();

function registerCommands(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      registerCommands(fullPath);
    } else {
      // eslint-disable-next-line import/no-dynamic-require
      const command = require(`../${fullPath}`);
      client.commands.set(command.command, command);
    }
  });
}

client.on('message', (message) => require('./events/base/message').handle(client, message));

registerCommands('src/commands');

// client.on('message', (msg) => {
//   if (msg.author.id === client.user.id) return;
//   msg.channel.send(EmbedGenerator.generate('Test Embed', null, [
//     { name: 'Test1', value: 'xd', inline: true },
//     { name: 'Test2', value: 'xd', inline: true },
//     { name: 'Test3', value: 'xd', inline: false },
//   ], '#0069ff'));
// });

client
  .login(DISCORD_TOKEN)
  .then(() => {
    console.log(`${client.user.username}#${client.user.discriminator} is now online`);
    console.log(`Invite Url: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
  });
