module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WikiResponses', {
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
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WikiResponses');
  },
};
