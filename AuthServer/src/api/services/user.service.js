const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sequelize = require("../../config/db/database");
const { redisClient } = require("../../config/db/redisClient");

exports.createUser = async (username, password, firstname, lastname, email) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: username,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    email: email,
  })
    .catch((error) => {
      console.log(error);
    })
    .then((user) => {
      console.log("New User Created in DB", user);
    });

  console.log(user);
  return user;
};

exports.authenticateUser = async (username, password) => {
  const user = await User.findOne({ where: { username: username } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const roles = await sequelize.query(
      `SELECT r.name FROM roles r
         INNER JOIN user_roles ur ON r.id = ur.roleId
         WHERE ur.userId = :userId`,
      {
        replacements: { userId: user.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // Map roles to an array of role names
    const roleNames = roles.map((role) => role.name);
    const token = await this.generateAccessToken(
      user.id,
      user.username,
      roleNames
    );
    return {
      token: token,
      userId: user.id,
      imageURL: user.imageURL,
      roles: roleNames,
    };
  }
  console.log("User not found or password incorrect");
  return null;
};

exports.generateAccessToken = async (userId, username, roles) => {
  try {
    const accessToken = jwt.sign(
      { userId: userId, username: username, roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return accessToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateUserPicture = async (userId, picture) => {
  const user = await User.findOne({ where: { userId: userId } });
  if (user) {
    user.imageURL = picture;
    user.save();
    return user;
  }
  return null;
};

exports.getAllUsers = async () => {
  return User.findAll({ attributes: ["id", "username"] })
    .catch((error) => {
      console.log(error);
    })
    .then((users) => {
      console.log("Users Found in DB", users);
    });
};

exports.generateRefreshToken = async (userId, username) => {
  try {
    const refreshToken = jwt.sign(
      { userId: userId, username: username, typ: "refresh" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    return refreshToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.validateRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("Decoded Token", decoded);
    const inStrorageToken = await redisClient.get(
      `refreshToken:${decoded.userId}`
    );
    if (!inStrorageToken) {
      console.log("No User refresh token");
      return null;
    } else if (inStrorageToken !== refreshToken) {
      console.log("Token is not coresponding");
      return null;
    }
    return decoded;
  } catch (error) {
    console.log("Invalid Signature");
    return null;
  }
};

exports.saveRefreshToken = async (userId, refreshToken) => {
  const expiresIn = 7 * 24 * 60 * 60 * 60; // 7 days in seconds
  try {
    const result = await redisClient.setEx(
      `refreshToken:${userId}`,
      expiresIn,
      refreshToken
    );
    console.log(`Result: ${result}`); // Should log 'OK' if successful
    return result;
  } catch (error) {
    console.error(`Error saving refresh token for user ${userId}: ${error}`);
    throw error; // Rethrow the error or handle it as needed
  }
};

exports.getRefreshToken = async (userId) => {
  return redisClient.get(userId);
  //   return redisClient.get(`refreshToken:${userId}`)
};

exports.deleteRefreshToken = async (userId) => {
  try {
    const response = await redisClient.del(`refreshToken:${userId}`);
    console.log(response); // Log or handle the response as needed
    return response; // Return the response for further processing
  } catch (error) {
    console.error(error); // Handle or throw the error
    throw error; // Consider re-throwing the error for the caller to handle
  }
};
