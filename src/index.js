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

const dbConnection = require('./db/database');

dbConnection.authenticate()
  .then(() => console.log('Connection has been established to the database'))
  .catch((err) => console.error('Unable to connect to the database', err));

client
  .login(DISCORD_TOKEN)
  .then(() => {
    console.log(`${client.user.username}#${client.user.discriminator} is now online`);
    console.log(`Invite Url: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
  });
