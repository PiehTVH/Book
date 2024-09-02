"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FavoriteBook extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  FavoriteBook.init(
    {
      fav_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "favorite(fav) id",
      },
      fav_userid: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id user",
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
      modelName: "favorite_book",
      tableName: "favorite_book",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return FavoriteBook;
};
