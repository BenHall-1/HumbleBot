const { SUPPORT_ROLE, BOT_ADMINS } = require('../utils/config');

module.exports = {
  EVERYONE: 0,
  SUPPORT: 1,
  ADMIN: 2,
  hasAccess: (member, accessLevel) => {
    switch (accessLevel) {
      case 0:
        return true;
      case 1:
        return member.roles.cache.find((role) => role.id === SUPPORT_ROLE) !== null;
      case 2:
        return BOT_ADMINS.includes(member.id);
      default:
        return false;
    }
  },
};
