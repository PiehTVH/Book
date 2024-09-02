"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const OTP = require("../models/opt.model");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { AUTH_EMAIL } = process.env;

const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const formatData = (input) => {
  if (input > 9) {
    return input;
  } else return `0${input}`;
};

class OTPService {
  static sendOTP = async ({ email, subject, message, duration = 1 }) => {
    try {
      if (!(email && subject && message)) {
        throw new BadRequestError("Provide values for email, subject, message");
      }

      //clear old record
      await OTP.deleteOne({ email });

      //generate pin
      const generatedOTP = await generateOTP();

      //get template

      let objectDate = new Date();
      console.log(objectDate);
      let date_ =
        formatData(objectDate.getDate()) +
        "/" +
        formatData(objectDate.getMonth() + 1) +
        "/" +
        formatData(objectDate.getFullYear());

      const src = fs
        .readFileSync(
          path.resolve(__dirname, "../templates/email_template.html")
        )
        .toString();
      const template = handlebars.compile(src);
      const replacement = {
        otp_duration: duration,
        date: date_,
        otp: generatedOTP,
      };
      const htmlToSend = template(replacement);

      //send email
      const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject,
        html: htmlToSend,
      };
      await sendEmail(mailOptions);

      //save otp record
      const hashedOTP = await bcrypt.hash(generatedOTP, 10);
      const newOTP = await new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000 * duration,
      });
      const createdOTPRecord = await newOTP.save();
      return createdOTPRecord;
    } catch (err) {
      throw err;
    }
  };

  static verifyOTP = async ({ email, otp }) => {
    try {
      if (!(email && otp)) {
        throw new BadRequestError("Provide values for email, otp");
      }

      //ensure otp record exists
      const matchedOTPRecord = await OTP.findOne({
        email,
      });
      if (!matchedOTPRecord) {
        throw new BadRequestError("No otp records found.");
      }

      //check Expire date
      const { expiresAt } = matchedOTPRecord;
      if (expiresAt < Date.now()) {
        await OTP.deleteOne({ email });
        throw new NotFoundError("Code has expired. Request for a new one.");
      }

      // verify the value if it is not expired yet
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await bcrypt.compare(otp, hashedOTP);
      return validOTP;
    } catch (err) {
      throw err;
    }
  };

  static deleteOTP = async (email) => {
    console.log("delete er");
    try {
      await OTP.deleteOne({ email });
    } catch (err) {
      throw err;
    }
  };

  static listOTP = async () => {
    return OTP.find();
  };
}
module.exports = OTPService;
