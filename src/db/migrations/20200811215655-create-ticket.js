module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
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
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tickets');
  },
};
