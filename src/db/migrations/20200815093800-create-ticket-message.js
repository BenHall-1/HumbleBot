module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TicketMessages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      ticket: {
        type: Sequelize.BIGINT,
        allowNull: false,
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
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TicketMessages');
  },
};
