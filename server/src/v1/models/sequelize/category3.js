"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category3 extends Model {
    static associate(models) {
      this.belongsTo(models.category_2, { foreignKey: "cate2_id" });
      this.hasMany(models.category_4, {
        as: "submenu",
        foreignKey: "cate3_id",
      });
      // Define associations here if needed
    }
  }
  Category3.init(
    {
      cate3_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      cate3_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "id_string",
      },
      cate2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "cate2_id",
      },
      cate2_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "cate2_sid",
      },
      cate3_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "cate_name",
      },
      cate3_slug: {
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
      modelName: "category_3",
      tableName: "category_3",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Category3;
};
