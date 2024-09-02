"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Supplier.init(
    {
      sup_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      sup_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "name",
      },
      sup_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "name",
      },
      sup_img: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "image",
      },
      sup_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        comment: "slug",
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
      modelName: "supplier",
      tableName: "supplier",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Supplier;
};
