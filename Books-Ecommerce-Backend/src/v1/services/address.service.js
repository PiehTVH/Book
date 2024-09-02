"use strict";

const db = require("../models/sequelize/models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class AddressService {
  //create a new address
  static createAddress = async ({
    userId,
    provinceId,
    userName,
    userPhone,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    addressDetail,
    addressDefault,
    defaultPayment,
    isHome,
  }) => {
    //check user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    //create address
    const newAddress = await db.address.create({
      address_user_id: foundUser.dataValues.user_id,
      address_user_name: userName,
      address_user_phone: userPhone,
      address_province_id: provinceId,
      address_province_name: provinceName,
      address_district_id: districtId,
      address_district_name: districtName,
      address_ward_id: wardId,
      address_ward_name: wardName,
      address_detail: addressDetail,
      address_default: addressDefault,
      address_default_payment: defaultPayment,
      address_is_home: isHome,
    });

    if (!newAddress) throw new BadRequestError("Create address failed");

    return newAddress;
  };

  //get addresses
  static getAddresses = async ({ userId }) => {
    //check user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    return await db.address.findAll({
      where: {
        address_user_id: foundUser.dataValues.user_id,
      },
    });
  };

  //remove address
  static removeAddress = async ({ userId, addressId }) => {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const foundAddress = await db.address.findOne({
      where: {
        address_id: addressId,
        address_user_id: foundUser.dataValues.user_id,
      },
    });

    if (!foundAddress) throw new NotFoundError("Address not found");

    const deleteAddress = await db.address.destroy({
      where: {
        address_id: foundAddress.dataValues.address_id,
        address_user_id: foundAddress.dataValues.address_user_id,
      },
    });

    if (deleteAddress === 0) throw new BadRequestError("Remove address failed");

    return await AddressService.getAddresses({ userId });
  };
}

module.exports = AddressService;
