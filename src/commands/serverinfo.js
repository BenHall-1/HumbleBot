const axios = require('axios').default;

const { PTERODACTYL_API_URL } = require('../utils/config');

const AccessLevel = require('../enums/AccessLevel');
const EmbedGenerator = require('../utils/EmbedGenerator');
const User = require('../db/models/User');

function format(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = {
  command: 'serverinfo',
  accessLevel: AccessLevel.CLIENT,
  execute: async (message, args) => {
    if (args && args[0]) {
      const user = await User.findOne({ where: { id: message.author.id } });
      const serverId = args[0];
      try {
        const authHeaders = { headers: { Authorization: `Bearer ${user.pterodactylApiKey}` } };
        const { data: serverData } = await axios.get(`${PTERODACTYL_API_URL}/client/servers/${serverId}`, authHeaders);
        const { data: serverUtilisation } = await axios.get(`${PTERODACTYL_API_URL}/client/servers/${serverId}/utilization`, authHeaders);

        const serverInfo = serverData.attributes;
        const { name, limits } = serverInfo;
        const { memory: maxMemory, disk: maxDisk, cpu: maxCpu } = limits;

        const serverUtilInfo = serverUtilisation.attributes;
        const { current: currentMemory } = serverUtilInfo.memory;
        const { current: currentCpu } = serverUtilInfo.cpu;
        const { current: currentDisk } = serverUtilInfo.disk;

        const fields = [
          { name: 'Memory Usage', value: `${format(currentMemory)} MB / ${format(maxMemory)} MB`, inline: false },
          { name: 'CPU Usage', value: `${currentCpu}/${maxCpu}`, inline: false },
          { name: 'Disk Usage', value: `${format(currentDisk)} MB / ${format(maxDisk)} MB`, inline: false },
        ];
        message.channel.send(EmbedGenerator.generate(
          `Showing server information for ${name} *(${serverId})*`,
          null,
          fields,
        ));
      } catch (error) {
        console.error(error);
        const pterodactylError = await message.channel.send(EmbedGenerator.generate('Invalid server Id / you have not verified your account to access that server'));
        pterodactylError.delete({ timeout: 5000 });
      }
    } else {
      const invalidArgs = await message.channel.send(EmbedGenerator.generate('You must provide a server id'));
      invalidArgs.delete({ timeout: 5000 });
    }
  },
};
