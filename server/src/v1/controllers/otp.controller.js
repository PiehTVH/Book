"use strict";

const { SuccessResponse } = require("../core/success.response");
const OTPService = require("../services/otp.service");

class OTPController {
  sendOTP = async (req, res, next) => {
    console.log("otp " + req.body);
    const data = await OTPService.sendOTP(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  verifyOTP = async (req, res, next) => {
    console.log("verify " + req.body);
    const data = await OTPService.verifyOTP(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  // Xem list OTP (test xong xóa)
  listOTP = async (req, res, next) => {
    const data = await OTPService.listOTP();
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };
}

module.exports = new OTPController();
