"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Publisher.init(
    {
      pub_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        comment: "id",
      },
      pub_sid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "name",
      },
      pub_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "name",
      },
      pub_img: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "image",
      },
      pub_slug: {
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
      modelName: "publisher",
      tableName: "publisher",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Publisher;
};
