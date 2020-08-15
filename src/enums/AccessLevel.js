const { CLIENT_ROLE, SUPPORT_ROLE, BOT_ADMINS } = require('../utils/config');

module.exports = {
  EVERYONE: 0,
  CLIENT: 1,
  SUPPORT: 2,
  ADMIN: 3,
  hasAccess: (member, accessLevel) => {
    switch (accessLevel) {
      case 0:
        return true;
      case 1:
        return member.roles.cache.find((role) => role.id === CLIENT_ROLE) !== undefined
        || member.roles.cache.find((role) => role.id === SUPPORT_ROLE) !== undefined
        || BOT_ADMINS.includes(member.id);
      case 2:
        return member.roles.cache.find((role) => role.id === SUPPORT_ROLE) !== undefined
        || BOT_ADMINS.includes(member.id);
      case 3:
        return BOT_ADMINS.includes(member.id);
      default:
        return false;
    }
  },
};
