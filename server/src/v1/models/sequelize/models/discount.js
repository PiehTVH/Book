"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      // this.belongsTo(models.Supplier, { foreignKey: 'discount_supplierId' });
    }
  }
  Discount.init(
    {
      discount_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      discount_supplierId: {
        type: DataTypes.INTEGER(11),
        comment: "id supplier",
      },
      discount_name: {
        allowNull: false,
        type: DataTypes.STRING,
        comment: "discount name",
      },
      discount_des: {
        allowNull: false,
        type: DataTypes.TEXT,
        comment: "description",
      },
      discount_type: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "fixed_amount",
        comment: "types: fixed_amount or percentage",
      },
      discount_value: {
        allowNull: false,
        type: DataTypes.DECIMAL(11, 2),
        defaultValue: "0", //10.000, 10
        comment: "values: 10.000vnd or 10%",
      },
      discount_code: {
        allowNull: false,
        unique: true,
        validate: {
          len: [6, Infinity], // Kiểm tra độ dài từ 6 trở lên
        },
        type: DataTypes.STRING,
        comment: "code",
      },
      discount_start_date: {
        allowNull: false,
        type: DataTypes.DATE,
        comment: "start date",
      },
      discount_end_date: {
        allowNull: false,
        type: DataTypes.DATE,
        comment: "end date",
      },
      discount_max_uses: {
        allowNull: false,
        type: DataTypes.INTEGER,
        comment: "maximum quantity can use",
      },
      discount_count_used: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: "0",
        comment: "quantity used",
      },
      discount_max_uses_per_user: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: "1",
        comment: "max discount code used per user",
      },
      discount_min_order_value: {
        allowNull: false,
        type: DataTypes.DECIMAL(11, 2),
        defaultValue: "0",
        comment: "min order value",
      },
      discount_is_active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        comment: "is discount active?",
      },
      discount_apply_to: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "all",
        comment: "all or specific",
      },
      discount_product_ids: {
        allowNull: false,
        type: DataTypes.JSON,
        defaultValue: JSON.stringify([]),
        comment: "the books can be apply discount code",
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
      modelName: "discount",
      tableName: "discount",
      timestamps: false,
    }
  );

  return Discount;
};
