const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('Users', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  discriminator: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  billingEmail: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pterodactylApiKey: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  receivedTrustPilotLink: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
});
