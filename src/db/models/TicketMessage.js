const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('TicketMessages', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  author: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});
