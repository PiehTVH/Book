"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category1 extends Model {
    static associate(models) {
      this.hasMany(models.category_2, {
        as: "submenu",
        foreignKey: "cate1_id",
      });
      // Define associations here if needed
    }
  }
  Category1.init(
    {
      cate1_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      cate1_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "id_string",
      },
      cate1_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "cate_name",
      },
      cate1_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        comment: "cate_slug",
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
      modelName: "category_1",
      tableName: "category_1",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Category1;
};
