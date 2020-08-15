const config = require('../../config/config.json');

module.exports = {
  BOT_ADMINS: config.serverProperties.botAdmins,
  BOT_LOGO: config.botSettings.botLogo,
  CLIENT_ROLE: config.serverProperties.clientRole,
  DISCORD_TOKEN: config.botSettings.token,
  PREFIX: config.botSettings.prefix,
  SUPPORT_ROLE: config.serverProperties.supportRole,
  TICKET_CATEGORY: config.serverProperties.ticketCategory,
  PTERODACTYL_API_URL: config.pterodactylSettings.apiUrl,
};
