"use strict";

const JWT = require("jsonwebtoken");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    // verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`create JWT error::`, error);
  }
};

const verifyJWT = async (token, keySecret) => {
  try {
    const result = await JWT.verify(token, keySecret);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTokenPair,
  verifyJWT,
};
