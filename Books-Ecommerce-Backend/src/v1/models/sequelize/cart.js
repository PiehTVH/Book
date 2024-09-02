"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      // this.belongsTo(models.User, { foreignKey: 'cart_userid' });
    }
  }
  Cart.init(
    {
      cart_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      cart_count_products: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "num of products in cart",
      },
      cart_status: {
        type: DataTypes.ENUM("active", "completed", "failed", "pending"),
        allowNull: false,
        defaultValue: "active",
        comment: "status: active, completed, failed, pending",
      },
      cart_userid: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id user",
      },
      create_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "created timestamp",
      },
      update_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "updated timestamp",
      },
    },
    {
      sequelize,
      modelName: "cart",
      tableName: "cart",
      timestamps: false,
    }
  );

  return Cart;
};
