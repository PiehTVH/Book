"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.book, { foreignKey: "inven_book_id" });
      this.belongsTo(models.supplier, { foreignKey: "inven_supplierId" });
    }
  }
  Inventory.init(
    {
      inven_book_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: "id",
      },
      inven_supplierId: {
        type: DataTypes.INTEGER(11),
        comment: "id supplier",
        // Add foreign key association if needed
      },
      inven_location: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
        comment: "location",
      },
      inven_stock: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "stock",
      },
      inven_reservations: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: "reservations",
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
      modelName: "inventory",
      tableName: "inventory",
      timestamps: false,
    }
  );

  return Inventory;
};
