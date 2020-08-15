const Sequelize = require('sequelize');
const database = require('../database');

module.exports = database.define('WikiResponses', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  trigger: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  response: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
