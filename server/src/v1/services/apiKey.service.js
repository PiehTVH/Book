"use strict";

const apiKeyModel = require("../models/apiKey.model");
const findById = async (key) => {
  const objkey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objkey;
};

module.exports = {
  findById,
};
