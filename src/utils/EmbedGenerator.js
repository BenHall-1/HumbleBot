const { MessageEmbed } = require('discord.js');
const { BOT_LOGO } = require('./config');

module.exports = {
  generate: (description, imageUrl = null, fields = null, color = null) => {
    const embed = new MessageEmbed({
      description,
      image: imageUrl,
      footer: { text: 'HumbleServers Bot | Designed & Created by Ben#2028', iconUrl: BOT_LOGO },
      fields,
    });
    embed.setColor(color);
    console.log(color);
    return embed;
  },
};
