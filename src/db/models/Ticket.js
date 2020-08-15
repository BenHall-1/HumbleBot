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
