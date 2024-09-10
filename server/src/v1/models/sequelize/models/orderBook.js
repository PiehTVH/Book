"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderBook extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.order, { foreignKey: "ob_order_id" });
      this.belongsTo(models.book, { foreignKey: "ob_book_id" });
    }
  }
  OrderBook.init(
    {
      ob_order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "order id",
        primaryKey: true,
      },
      ob_book_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "book id",
        primaryKey: true,
      },
      ob_quantity: {
        type: DataTypes.INTEGER,
        comment: "quantity",
      },
      ob_total_price: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total price",
      },
      ob_status: {
        type: DataTypes.ENUM(
          "PendingConfirmation",
          "PendingDelivery",
          "Delivered",
          "Refunded",
          "Cancelled"
        ),
        comment: "status of order book",
        defaultValue: "PendingConfirmation",
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
      modelName: "order_book",
      tableName: "order_book",
      timestamps: false,
    }
  );

  return OrderBook;
};
