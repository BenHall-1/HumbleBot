const Sequelize = require('sequelize');

const dbConfig = require('../../config/database.json').db;

module.exports = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.loggingEnabled === true ? console.log : false,
  define: {
    charset: dbConfig.charset,
    timestamps: false,
  },
});
