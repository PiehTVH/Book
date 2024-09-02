"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category4 extends Model {
    static associate(models) {
      this.belongsTo(
        models.category_3,
        { as: "submenu" },
        { foreignKey: "cate3_id" }
      );
      // Define associations here if needed
    }
  }
  Category4.init(
    {
      cate4_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      cate4_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "id_string",
      },
      cate3_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "cate3_id",
      },
      cate3_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "cate3_sid",
      },
      cate4_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "cate_name",
      },
      cate4_slug: {
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
      modelName: "category_4",
      tableName: "category_4",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Category4;
};
