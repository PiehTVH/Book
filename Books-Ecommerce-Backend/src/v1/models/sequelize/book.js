"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Define associations here if needed
      this.belongsTo(models.publisher, { foreignKey: "book_publisherId" });
    }
  }
  Book.init(
    {
      book_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      book_title: {
        type: DataTypes.STRING,
        comment: "spu name",
      },
      book_categories: {
        type: DataTypes.JSON,
        comment: "json categories",
      },
      book_authors: {
        type: DataTypes.JSON,
        comment: "json authors",
      },
      book_publisherId: {
        type: DataTypes.BIGINT,
        comment: "id publisher",
      },
      book_supplierId: {
        type: DataTypes.BIGINT,
        comment: "id supplier",
      },
      book_layoutId: {
        type: DataTypes.BIGINT,
        comment: "id layout",
      },
      book_img: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "book thumbnail",
      },
      book_avg_rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0,
        comment: "avg rating",
      },
      book_num_rating: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        comment: "number ratings",
      },
      book_spe_price: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        comment: "special price",
      },
      book_old_price: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        comment: "old price",
      },
      book_status: {
        type: DataTypes.TINYINT,
        comment: "0: out of stock, 1: in stock",
      },
      is_deleted: {
        type: DataTypes.TINYINT.UNSIGNED,
        defaultValue: 0,
        comment: "0: null, 1: deleted",
      },
      sort: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "priority sort",
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
      modelName: "book",
      tableName: "book",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Book;
};
