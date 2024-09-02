"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartBook extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.cart, { foreignKey: "cb_cart_id" });
      this.belongsTo(models.book, { foreignKey: "cb_book_id" });
      this.belongsTo(models.book_detail, { foreignKey: "cb_book_id" });
    }
  }
  CartBook.init(
    {
      cb_cart_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id cart",
        primaryKey: true,
      },
      cb_book_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id book",
        primaryKey: true,
      },
      cb_book_num: {
        type: DataTypes.INTEGER,
        comment: "number of books",
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
      modelName: "cart_book",
      tableName: "cart_book",
      timestamps: false,
    }
  );

  return CartBook;
};
