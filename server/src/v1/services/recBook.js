"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class RecBook extends Model {
    static associate(models) {
      //   RecBook.belongsTo(models.RecSession, {
      //     foreignKey: "rec_session_id",
      //     onDelete: "CASCADE",
      //     onUpdate: "CASCADE",
      //   });
    }
  }

  RecBook.init(
    {
      rec_session_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "session id",
      },
      rec_user_sid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        comment: "user sid",
      },
      rec_book_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      rec_book_title: {
        type: DataTypes.STRING,
        comment: "spu name",
      },
      rec_book_img: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "book thumbnail",
      },
      rec_book_categories: {
        type: DataTypes.JSON,
        comment: "book categories",
      },
      rec_book_spe_price: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        comment: "special price",
      },
      rec_book_old_price: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        comment: "old price",
      },
      rec_book_is_recommadation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "is recommendation product",
      },
      create_time: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: "create_time",
      },
      update_time: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null,
        onUpdate: DataTypes.NOW,
        comment: "update_time",
      },
    },
    {
      sequelize,
      modelName: "rec_book",
      tableName: "rec_book",
      timestamps: false, // Assuming timestamps are managed manually
    }
  );

  return RecBook;
};
