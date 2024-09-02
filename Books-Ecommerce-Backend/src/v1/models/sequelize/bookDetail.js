"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookDetail extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  BookDetail.init(
    {
      book_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: "id",
      },
      book_categories_name: {
        type: DataTypes.STRING,
        comment: "json categories name",
      },
      book_pulisherName: {
        type: DataTypes.STRING,
        comment: "id shop",
      },
      book_supplier: {
        type: DataTypes.STRING,
        comment: "supplier name",
      },
      book_authors_name: {
        type: DataTypes.STRING,
        comment: "authors name",
      },
      book_publish_year: {
        type: DataTypes.STRING,
        comment: "publish year",
      },
      book_layout: {
        type: DataTypes.STRING,
        defaultValue: "",
        comment: "layout",
      },
      book_avg_rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 4.5,
        comment: "avg rating",
      },
      book_num_ratings: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        comment: "number of ratings",
      },
      book_num_pages: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        comment: "number of pages",
      },
      book_size: {
        type: DataTypes.STRING,
        comment: "book size",
      },
      book_des: {
        type: DataTypes.TEXT,
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
      modelName: "book_detail",
      tableName: "book_detail",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return BookDetail;
};
