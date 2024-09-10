"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      // Define associations here
      //   Order.belongsTo(models.Address, { foreignKey: 'order_shipping' });
      this.belongsTo(models.user, { foreignKey: "order_user_id" });
    }
  }
  Order.init(
    {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      // order_shipping: {
      //   type: DataTypes.BIGINT.UNSIGNED,
      //   comment: 'address shipping',
      // },
      order_user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "user_id",
      },
      order_tracking_code: {
        type: DataTypes.STRING,
        comment: "shipping code",
      },
      order_discounts: {
        type: DataTypes.JSON,
        comment: "discounts used in order",
        defaultValue: JSON.stringify([]),
      },
      order_status: {
        type: DataTypes.ENUM(
          "Processing",
          "Completed",
          "Shipping",
          "Refunded",
          "Cancelled"
        ),
        comment: "status of order",
        defaultValue: "Processing",
      },
      order_payment: {
        type: DataTypes.ENUM("cod", "vnpay", "momo", "paypal", "other"),
        comment: "payment method",
      },
      order_num_books: {
        type: DataTypes.INTEGER,
        comment: "number of books in order",
      },
      order_old_total: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total order",
      },
      order_spe_total: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total order",
      },
      order_fee_service: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total order",
      },
      order_fee_shiping: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total order",
      },
      order_discount_amount: {
        type: DataTypes.DECIMAL(11, 2),
        comment: "total discount amount",
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
      modelName: "order",
      tableName: "order",
      timestamps: false, // Assuming timestamps are managed manually
    }
  );

  return Order;
};
