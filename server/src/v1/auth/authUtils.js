"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //verify
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

const authentication = asyncHandler(async (req, res, next) => {
  /*
        1- Check userId missing?
        2 - get access token
        3 - verify access token
        4 - check user in database
        5 - check keyStore with this userId
        6 -  Ok all -> return next()
    */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore");

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  //5

  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId) throw new AuthFailureError("Invalid Request");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  try {
    console.log("result::----------------", keySecret);
    const result = await JWT.verify(token, keySecret);
    return result; //await JWT.verify(token, keySecret);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
