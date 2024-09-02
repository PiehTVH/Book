"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Address extends Model {
    static associate(models) {
      // Define associations here if needed
      Address.belongsTo(models.user, {
        foreignKey: "address_user_id",
      });
    }
  }
  Address.init(
    {
      address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "id",
      },
      address_user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        comment: "user id",
      },
      address_user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "user name",
      },
      address_user_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "user phone",
      },
      address_province_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "province id",
      },
      address_province_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "province name",
      },
      address_district_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "district id",
      },
      address_district_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "district name",
      },
      address_ward_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "ward id",
      },
      address_ward_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "ward name",
      },
      address_detail: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "detail address",
      },
      address_default: {
        type: DataTypes.ENUM("true", "false"),
        defaultValue: "false",
        allowNull: false,
        comment: "default address",
      },
      address_default_payment: {
        type: DataTypes.ENUM("true", "false"),
        defaultValue: "false",
        allowNull: false,
        comment: "default payment address",
      },
      address_is_home: {
        type: DataTypes.ENUM("true", "false"),
        defaultValue: "true",
        allowNull: false,
        comment: "is home?",
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
      modelName: "address",
      tableName: "address",
      timestamps: false, // Assuming timestamps are managed manually
    }
  );

  return Address;
};
