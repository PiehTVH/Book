"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Layout extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Layout.init(
    {
      layout_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      layout_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "name",
      },
      layout_slug: {
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
      modelName: "layout",
      tableName: "layout",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Layout;
};
