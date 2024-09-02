"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");
const { OK, CREATED } = require("../core/success.response");

class UserController {
  checkEmailnPhone = async (req, res, next) => {
    const data = await UserService.checkEmailnPhone(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getUserID = async (req, res, next) => {
    const data = await UserService.getUserID(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getUserInfo = async (req, res, next) => {
    const data = await UserService.getUserInfo(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  updateProfile = async (req, res, next) => {
    console.log("in update");
    const data = await UserService.updateProfile(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  addUserDB = async (req, res, next) => {
    const data = await UserService.addUserDB(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  // Xem người dùng trong MongoDB (test xong xóa)
  getUserMongoDB = async (req, res, next) => {
    const data = await UserService.getUserMongoDB(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getEmailnPhone = async (req, res, next) => {
    const data = await UserService.getEmailnPhone(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  delete_U = async (req, res, next) => {
    new SuccessResponse({
      metadata: await UserService.deleteUser(req.body),
    }).send(res);
  };
}

module.exports = new UserController();
