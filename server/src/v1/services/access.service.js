"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { ROLES } = require("../const");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");

/// services ///
const { findByEmail } = require("./user.service");
const userService = require("./user.service");
const db = require("../models/sequelize/models");
const Op = require("sequelize");

class AccessService {
  static loginGuest = async (data, req) => {
    const sessionid = data?.id;
    const userId = data.user?.user?._id?.toString();

    if (!userId) {
      // Kiểm tra user đã được tạo chưa
      const foundUser = await userModel.findOne({
        username: `user-${sessionid}`,
      });

      if (foundUser) {
        return {
          user: getInfoData({
            fileds: ["_id", "username", "email", "roles"],
            object: foundUser,
          }),
        };
      } else {
        //Tạo User
        const newUser = await userModel.create({
          username: `user-${sessionid}`,
          email: `user-${sessionid}@email.com`,
          password: sessionid,
          roles: [ROLES.CLIENT],
        });
        //Tạo MySql
        if (!newUser) throw new BadRequestError("create guest user failed");

        // console.log('MY SQLLLLLLLLLLLLLLLLLLL');
        const user_id = newUser._id.toString();
        await userService.addUserDB(
          user_id,
          `user-${sessionid}`,
          "",
          `user-${sessionid}@email.com`,
          sessionid
        );

        return {
          user: getInfoData({
            fileds: ["_id", "username", "email", "roles"],
            object: newUser,
          }),
        };
      }
    }
  };

  static signUp = async ({ username, email, password }) => {
    // Step 1: check username
    const holderUserName = await userModel.findOne({ username }).lean();
    if (holderUserName) {
      throw new BadRequestError("Username already Registered!");
      // return {
      //     code: 'xxxx',
      //     message: 'Username already Registered',
      // }
    }

    // Step 2: check email
    const holderUserEmail = await userModel.findOne({ email }).lean();
    if (holderUserEmail) {
      throw new BadRequestError("Email already Registered!");
      // return {
      //     code: 'xxxx',
      //     message: 'Email already Registered',
      // }
    }

    // create new user
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash::", passwordHash);
    const newUser = await userModel.create({
      username,
      email,
      password: passwordHash,
      roles: [ROLES.CLIENT],
    });

    if (newUser) {
      //create private key, public key (private key used for syncing a token
      //and public key used for validation that token)

      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });

      //create public key for decoding token
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey: publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Create Public Key Failed");

        // return {
        //     code: 'xxxx',
        //     message: 'Create Public Key Failed',
        // }
      }
      console.log(`publicKeyString:: ${publicKeyString}`);

      //convert public key string to object
      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log(`publicKeyObject:: ${publicKeyObject}`);

      // Create token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, username, email },
        publicKeyString,
        privateKey
      );
      console.log(`Create token successfully::`, tokens);

      return {
        code: "201",
        metadata: {
          user: getInfoData({
            fileds: ["_id", "username", "email", "roles"],
            object: newUser,
          }),
          tokens,
        },
      };
    }

    //error
    return {
      code: "200",
      metadata: null,
    };
  };

  /*
    1-check email in dbs
    2-match password
    3-create Access Token và RT
    4-generate Token
    5-get data and return
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("Shop not registered");

    //2
    const match = bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    //3 create private key, public key (private key used for syncing a token
    //and public key used for validation that token)
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    //create public key for decoding token
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
    });

    //4
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      publicKeyString,
      privateKey
    );

    //5
    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      user: getInfoData({
        fileds: ["_id", "username", "email", "roles"],
        object: foundUser,
      }),
      tokens,
    };
  };

  /*logout*/
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("Removed key store::", delKey);
    return delKey;
  };

  /*
    Check this token used?
  */
  static handleRefreshToken = async (refreshToken) => {
    //check xem token nay da duoc su dung chua
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    //neu co
    if (foundToken) {
      //xem la user nao
      const { userId, email } = await verifyJWT(
        foundToken.refreshToken,
        foundToken.publicKey
      );

      //xoa tat ca token trong KeyStore
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something went wrong!! Please relogin");
    }

    //neu chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("User not registered");

    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.publicKey
    );

    //check userId
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("User not registered");

    //create 1 cap moi
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
    });

    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      publicKeyString,
      privateKey
    );

    //Update Token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // đã được sử dụng
      },
    });

    return {
      user: {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      tokens,
    };
  };

  //SignUp
  static signup_user = async (
    { signupMethod, signupMethodValue, password },
    req
  ) => {
    //Kiểm tra tham số có null
    if (!(signupMethod && signupMethodValue && password)) {
      throw new BadRequestError(`Signup method and password cannot be null`);
    }
    console.log(signupMethod, signupMethodValue, password);

    let guest_id = "";
    let guest = "";
    // console.log(req.session)
    // Kiểm tra xem Session có user chưa (trường hợp loginGuest không kịp tạo user --> Gọi để tạo và trả về User --> Lấy userid để Đăng ký mới)
    if (!req.session.user) {
      console.log("in red session user");
      guest = await AccessService.loginGuest(req.session, req);
      guest_id = guest.user._id;
    }
    // Trường hợp đã có User nhưng session đó có Tokens --> đang có phiên đăng nhập --> Lỗi tạo (lỗi này do session chưa hết và chưa xử lý Logout) --> Kiểm tra nếu chưa có Token thì gán guest_id = user_id của session và lấy id này đi đăng ký
    else if (!req.session.user.token) {
      console.log("no token");
      guest_id = req.session.user.user._id;
    } else {
      throw new BadRequestError(`Signup failed. Please try again later`);
    }

    const new_user_name = `user-${guest_id}`;

    // console.log(guest)
    //check Email/Phone number
    let email_value = "";
    let phone_value = "";
    switch (signupMethod) {
      case "email":
        email_value = signupMethodValue;
        break;
      case "phone":
        phone_value = signupMethodValue;
        break;
      default:
        throw new BadRequestError("Invalid Signup method");
    }

    //điều kiện Or
    let isUsed = await userModel
      .find({
        where: { [Op.or]: [{ email: email_value }, { phone: phone_value }] },
      })
      .exec();

    console.log("isused", isUsed);

    if (isUsed.length > 0) {
      throw new BadRequestError(`${signupMethod} already Registered!`);
    }

    //
    //hash password người dùng nhập

    const passwordHash = await bcrypt.hash(password, 10);
    // console.log("passwordHash::", passwordHash);

    let registered_user = "";
    // xem người dung Đăng ký bằng Email/Đt --> Cập nhật email/phone + pw (MONGO DB)
    if (email_value !== "") {
      registered_user = await userModel.findOneAndUpdate(
        { _id: guest_id },
        {
          username: new_user_name,
          email: email_value,
          password: passwordHash,
        }
      );
    } else if (phone_value !== "") {
      registered_user = await userModel.findOneAndUpdate(
        { _id: guest_id },
        {
          username: new_user_name,
          phone: phone_value,
          password: passwordHash,
        }
      );
    }

    // console.log(registered_user)
    //cập nhật vào mysql db
    if (registered_user) {
      let foundUser = await db.user.findOne({
        where: { user_sid: guest_id.toString() },
      });

      console.log("found user in Mysql ", foundUser);
      if (foundUser) {
        await foundUser.set({
          user_username: new_user_name,
          user_slug: new_user_name,
          user_email: email_value,
          user_phone: phone_value,
          user_password: passwordHash,
        });
      }
      foundUser.save();

      //create private key, public key (private key used for syncing a token
      //and public key used for validation that token)
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });

      //create public key for decoding token
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: registered_user._id,
        publicKey: publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Create Public Key Failed");
      }
      console.log(`publicKeyString:: ${publicKeyString}`);

      //convert public key string to object
      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log(`publicKeyObject:: ${publicKeyObject}`);

      // Create token pair
      const tokens = await createTokenPair(
        {
          userId: registered_user._id,
          username: foundUser.username,
          user_email: email_value,
          user_phone: phone_value,
        },
        publicKeyString,
        privateKey
      );
      console.log(`Create token successfully::`, tokens);

      return {
        user: getInfoData({
          fileds: ["_id", "username", signupMethod, "roles"],
          object: registered_user,
        }),
        tokens,
      };
    } else {
      // User không được add vào db thành công --> xóa record trong Mongo
      throw new BadRequestError("Fail to signup. Please try again later");
    }
  };

  static login_user = async ({
    loginMethod,
    loginMethodValue,
    password,
    refreshToken = null,
  }) => {
    // 1 Kiểm tra user đăng nhập = Email/sđt
    // console.log('in login user')
    // console.log(loginMethod, loginMethodValue, password)

    let foundUser = "";
    if (loginMethod == "email") {
      let email = loginMethodValue;
      foundUser = await userModel.findOne({ email: email }).lean();
    } else if (loginMethod == "phone") {
      let phone = loginMethodValue;
      foundUser = await userModel.findOne({ phone: phone }).lean();
    }

    //Không tìm thấy --> Lỗi
    if (!foundUser) throw new BadRequestError("Authentication failed");

    //2 Kiểm tra mật khẩu
    // console.log(foundUser._id)
    const match = await bcrypt.compare(password, foundUser.password);
    // console.log(match)

    if (!match) throw new AuthFailureError("Authentication failed");

    //3 create private key, public key (private key used for syncing a token
    //and public key used for validation that token)
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    //create public key for decoding token
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
    });

    //4
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      publicKeyString,
      privateKey
    );

    //5
    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
      refreshToken: tokens.refreshToken,
    });

    const foundUserDB = await db.user.findOne({ user_sid: foundUser._id });
    return {
      user: getInfoData({
        fileds: ["_id", "username", loginMethod, "roles"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static login_sms = async ({ phone }) => {
    // 1 Kiểm tra user đăng nhập = Email/sđt
    // console.log('in login user')
    // console.log(loginMethod, loginMethodValue, password)

    let foundUser = await userModel.findOne({ phone: phone }).lean();

    //Không tìm thấy --> Lỗi
    if (!foundUser) throw new BadRequestError("Authentication failed");

    //3 create private key, public key (private key used for syncing a token
    //and public key used for validation that token)
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    //create public key for decoding token
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
    });

    //4
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      publicKeyString,
      privateKey
    );

    //5
    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
      refreshToken: tokens.refreshToken,
    });

    // const foundUserDB = await db.user.findOne({ user_sid: foundUser._id })
    return {
      user: getInfoData({
        fileds: ["_id", "username", "phone", "roles"],
        object: foundUser,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
