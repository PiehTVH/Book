"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FavoriteBookDetail extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      this.belongsTo(models.favorite_book, { foreignKey: "fb_fav_id" });
      this.belongsTo(models.book, { foreignKey: "fb_book_id" });
    }
  }
  FavoriteBookDetail.init(
    {
      fb_fav_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id favorite_book",
        primaryKey: true,
      },
      fb_book_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id book",
        primaryKey: true,
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
      modelName: "favorite_book_detail",
      tableName: "favorite_book_detail",
      timestamps: false,
    }
  );

  return FavoriteBookDetail;
};
