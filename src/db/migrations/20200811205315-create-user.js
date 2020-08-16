module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
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
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
