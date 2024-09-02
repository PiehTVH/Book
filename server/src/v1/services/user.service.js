"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const db = require("../models/sequelize/models");
const sequelize = require("sequelize");

const { slugConverter } = require("../utils/convertToSlug");

class UserService {
  static checkEmailnPhone = async ({ method, methodValue }) => {
    let isUsed = "";
    let result = true;
    if (method == "email") {
      isUsed = await userModel.findOne({ email: methodValue }).lean();
    } else if (method == "phone") {
      isUsed = await userModel.findOne({ phone: methodValue }).lean();
    }

    if (!isUsed) {
      result = false;
    }

    return {
      isUsed: result,
    };
  };

  //find by email
  static findByEmail = async ({
    email,
    select = {
      email: 1,
      status: 1,
      roles: 1,
      username: 1,
      password: 1,
      verify: 1,
    },
  }) => {
    return await userModel.findOne({ email }).select(select).lean();
  };

  static getUserID = async ({ method, methodValue }) => {
    let userID = "";
    if (method == "email") {
      userID = await userModel.findOne({ email: methodValue }, "_id");
    } else if (method == "phone") {
      userID = await userModel.findOne({ phone: methodValue }, "_id");
    }

    return {
      user_id: userID,
    };
  };

  // Get: User information
  static getUserInfo = async ({ userId }) => {
    console.log(userId);
    const user = await db.user.findOne({ where: { user_sid: userId } });
    // console.log(user)
    if (!user) {
      throw new NotFoundError("User not found");
    }
    let userInfo = await db.user.findOne({
      attributes: [
        ["user_username", "fullname"],
        ["user_sid", "userid"],
        ["user_email", "email"],
        ["user_phone", "phonenumber"],
        ["user_sex", "sex"],
        ["user_slug", "slug"],

        [sequelize.fn("DATE", sequelize.col("user_day_of_birth")), "birthday"],
      ],
      where: {
        user_sid: userId,
      },
    });

    return {
      user_data: userInfo,
    };
  };

  // Update: Update user profile: including Name, Sex, Date of birth
  static updateProfile = async ({ updatedField, updatedValue, userId }) => {
    // Khởi tạo mảng giá trị Giới tính
    let genderList = ["male", "female", "unknown"];
    console.log(updatedField, updatedValue, userId);
    // Tìm user
    let userInfo = await db.user.findOne({
      where: { user_sid: userId },
    });

    //Không tìm thấy --> Lỗi
    if (!userInfo) {
      throw new NotFoundError("User not found");
    }
    // console.log(userInfo)
    //Nếu giá trị update rỗng --> Trả về record cũ
    if (updatedValue == null || updatedValue == "") {
      return { user_info: userInfo };
    }

    let field = "";
    let updated_slug = "";
    switch (updatedField) {
      case "name":
        field = "user_username";
        updated_slug = slugConverter(updatedValue);
        console.log(updated_slug);
        break;
      case "sex":
        if (!genderList.includes(updatedValue)) {
          throw new BadRequestError("Invalid gender value");
        }
        field = "user_sex";
        break;
      case "dob":
        field = "user_day_of_birth";
        break;
      case "email":
        field = "user_email";
        break;
      case "pw":
        field = "user_password";
        updatedValue = await bcrypt.hash(updatedValue, 10);

        console.log("password");
        break;
      case "phonenumber":
        field = "user_phone";
        break;
      default:
        throw new BadRequestError("Request data is not valid");
    }
    let result = false;
    // Update
    try {
      //update tên
      if (updated_slug.length > 0) {
        await userInfo.set({
          [field]: updatedValue,
          user_slug: updated_slug,
        });
      } else {
        await userInfo.set({
          [field]: updatedValue,
        });
      }
      console.log("switchs");
      switch (updatedField) {
        case "email":
          await userModel.findOneAndUpdate(
            { _id: userId },
            { email: updatedValue },
            {
              new: true,
            }
          );
          break;

        case "phonenumber":
          await userModel.findOneAndUpdate(
            { _id: userId },
            { phone: updatedValue },
            {
              new: true,
            }
          );
          break;
        case "pw":
          await userModel.findOneAndUpdate(
            { _id: userId },
            { password: updatedValue },
            {
              new: true,
            }
          );
          break;
      }
      result = true;
      await userInfo.save();
    } catch (err) {
      // console.log('er here')
      throw new BadRequestError(err.message);
    }

    return {
      user_data: await UserService.getUserInfo({ userId }),
      update_result: result,
    };
  };

  //  Add user to Mysql DB
  static addUserDB = async (userSid, name, phone, email, pw) => {
    console.log("in add user");
    if (!(userSid && name && (phone || email) && pw)) {
      throw new BadRequestError("Signup values cannot be null");
    }
    const slug_name = slugConverter(name);

    // const passwordHash = await bcrypt.hash(pw, 10);
    // console.log("passwordHash::", passwordHash);
    // console.log(method+' '+signupMethodValue)
    let new_user = await db.user.create({
      user_sid: userSid,
      // them thuoc tinh mac dinh
      user_username: name,
      user_password: pw,
      user_salf: "",
      user_slug: slug_name,
      user_email: email,
      user_phone: phone,
      user_sex: "",
      user_avatar: "",
    });
    // console.log(new_user)
    return {
      user_data: new_user,
    };
  };

  static getEmailnPhone = async ({ userId }) => {
    let email_phone = await db.user.findOne({
      attributes: [
        ["user_email", "email"],
        ["user_phone", "phone"],
      ],
      where: { user_sid: userId },
    });
    if (!email_phone) {
      throw new BadRequestError("User not found");
    }

    return {
      email_n_phone: email_phone,
    };
  };

  // Để xem người dùng có trong DB (test xong sẽ xóa)
  static getUserMongoDB = async () => {
    const userdata = await userModel.find({}).lean();
    // const keytoken = await keyToken.find({});

    return {
      user_data: userdata,
      // token: keytoken
    };
  };

  static deleteUser = async ({ email_ }) => {
    try {
      await userModel.deleteOne({ email: email_ });
    } catch (err) {
      throw err;
    }
  };
}
module.exports = UserService;
