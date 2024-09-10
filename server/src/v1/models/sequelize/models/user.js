"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      // Example:
      // this.hasMany(models.Post);
    }
  }
  User.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      user_sid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        comment: "sid",
      },
      user_username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "username",
      },
      user_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "slug",
      },
      user_password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "password",
      },
      user_salf: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "salf",
      },
      user_email: {
        type: DataTypes.STRING,
        comment: "email",
      },
      user_phone: {
        type: DataTypes.STRING,
        comment: "phone",
      },
      user_sex: {
        type: DataTypes.STRING,
        comment: "sex",
      },
      user_avatar: {
        type: DataTypes.STRING,
        comment: "avatar",
      },
      user_day_of_birth: {
        type: DataTypes.DATE,
        comment: "birthday",
      },
      user_status: {
        type: DataTypes.ENUM("pending", "active", "block"),
        defaultValue: "pending",
        comment: "status",
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
      modelName: "user",
      tableName: "user",
      timestamps: false,
    }
  );

  return User;
};
