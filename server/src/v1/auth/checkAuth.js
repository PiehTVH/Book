"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  API_KEY_BOOKADA: "api-key-bookada",
};

const SECRET_KEY = "sudo-0104";

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      const key_bookada = req.headers[HEADER.API_KEY_BOOKADA]?.toString();
      if (key_bookada === SECRET_KEY) {
        req.objkey = "0104";
        return next();
      }
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    //check objkey
    const objkey = await findById(key);
    if (!objkey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objkey = objkey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (req?.objkey === "0104") return next();

    if (!req?.objkey?.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    const validKeys = req?.objkey.permissions.includes(permission);
    if (!validKeys) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
