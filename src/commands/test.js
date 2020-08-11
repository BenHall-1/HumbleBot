const AccessLevel = require('../enums/AccessLevel');

module.exports = {
  command: 'test',
  accessLevel: AccessLevel.ADMIN,
  execute: async (message) => {
    console.log(message);
  },
};
