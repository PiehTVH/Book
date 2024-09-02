"use strict";

const db = require("../models/sequelize/models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const OTPService = require("./otp.service");

class emailOTPService {
  static sendOTPEmail = async ({ email }) => {
    if (!email) {
      throw new BadRequestError("An email is required");
    }
    try {
      const existingUser = await db.user.findOne({ email });
      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      const otpDetails = {
        email,
        subject: "MÃ XÁC THỰC OTP",
        message: "Verify your email with the code below",
        duration: 1,
      };
      const createdOTP = await OTPService.sendOTP(otpDetails);
      console.log("here");
      return createdOTP;
    } catch (err) {
      console.log("here err");
      throw err;
    }
  };

  static verifyOTPEmail = async ({ email, otp }) => {
    if (!(email && otp)) {
      throw new BadRequestError("Empy otp details are not allowed");
    }

    const otpDetails = {
      email,
      otp,
    };
    // let otpService= new OTPService();
    try {
      // console.log('in ')
      const validOTP = await OTPService.verifyOTP(otpDetails);
      if (!validOTP) {
        throw new BadRequestError("Invalid code passed. Check your inbox");
      }
      // console.log('in 2')
      //delete otp
      await OTPService.deleteOTP(email);
      return validOTP;
    } catch (err) {
      console.log("err here");
      throw err;
    }
  };
}
module.exports = emailOTPService;
