const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('Tickets', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  creator: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  billingEmail: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  serverId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  creationDate: {
    type: Sequelize.DATE,
    allowNull: false,
    default: Date.now(),
  },
  resolvedDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});
