const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  Ticket.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    creator: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    billingEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serverId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      default: Date.now(),
    },
    resolvedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
