"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // Define associations here if needed
      this.belongsTo(models.user, { foreignKey: "feedback_userid" });
      this.belongsTo(models.book, { foreignKey: "feedback_bookid" });
      this.belongsTo(models.order, { foreignKey: "feedback_orderid" });
    }
  }
  Feedback.init(
    {
      feedback_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      feedback_userid: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id user",
      },
      feedback_bookid: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id book",
      },
      feedback_orderid: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id order",
      },
      feedback_rating: {
        type: DataTypes.ENUM("0", "1", "2", "3", "4", "5"),
        allowNull: false,
        defaultValue: "0",
        comment: "rating: [1,5]",
      },
      feedback_content: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "comments",
      },
      feedback_status: {
        type: DataTypes.ENUM("active", "banned"),
        allowNull: false,
        defaultValue: "active",
        comment: "status: active, banned",
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
      modelName: "feedback",
      tableName: "feedback",
      timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt columns
    }
  );
  return Feedback;
};
