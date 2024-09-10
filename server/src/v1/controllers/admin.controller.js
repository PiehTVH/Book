"use strict";

const { SuccessResponse } = require("../core/success.response");
const AdminService = require("../services/admin.service");
const SudoService = require("../sudo");

class AdminController {
  //usage for president only
  createApiKey = async (req, res, next) => {
    const data = await SudoService.createApiKey(req.body);
    new SuccessResponse({
      message: "Apikey successfully",
      metadata: data,
    }).send(res);
  };

  addFirebaseAccount = async (req, res, next) => {
    const data = await AdminService.addFirebaseAccount(req.body);
    new SuccessResponse({
      message: "Added Firebase Account successfully",
      metadata: data,
    }).send(res);
  };
}

module.exports = new AdminController();
