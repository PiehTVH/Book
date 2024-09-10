"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DiscountWallet extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.discount, { foreignKey: "dw_discount_id" });
      this.belongsTo(models.user, { foreignKey: "dw_user_id" });
    }
  }
  DiscountWallet.init(
    {
      dw_discount_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "discount id",
      },
      dw_user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: "user id",
      },
      dw_discount_status: {
        type: DataTypes.ENUM("active", "inactive", "outdate"),
        allowNull: false,
        defaultValue: "active",
        comment: "status: active, inactive, outdate",
      },
      dw_discount_quatity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "number of discount codes",
      },
      dw_discount_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "number of discount codes were used",
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
        defaultValue: null,
        onUpdate: DataTypes.NOW,
        comment: "update_time",
      },
    },
    {
      sequelize,
      modelName: "discount_wallet",
      tableName: "discount_wallet",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return DiscountWallet;
};
