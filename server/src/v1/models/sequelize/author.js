"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Author.init(
    {
      author_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      author_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "name",
      },
      author_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "name",
      },
      author_img: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "image",
      },
      author_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        comment: "slug",
      },
      author_des: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "description",
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
      modelName: "author",
      tableName: "author",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Author;
};
