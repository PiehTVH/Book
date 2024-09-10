"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.order, { foreignKey: "tran_order_id" });
      this.belongsTo(models.user, { foreignKey: "tran_user_id" });
    }
  }
  Transaction.init(
    {
      tran_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      tran_sid: {
        type: DataTypes.STRING,
        comment: "string id",
        primaryKey: true,
      },
      tran_order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "order_id",
        // Add foreign key association if needed
      },
      tran_user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "user_id",
        // Add foreign key association if needed
      },
      tran_status: {
        type: DataTypes.STRING,
        comment: "status of transaction",
      },
      tran_total: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total of transaction",
      },
      create_time: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "create_time",
      },
      update_time: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: "update_time",
      },
    },
    {
      sequelize,
      modelName: "transaction",
      tableName: "transaction",
      timestamps: false,
    }
  );

  return Transaction;
};
