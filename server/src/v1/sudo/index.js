"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const apiKeyModel = require("../models/apiKey.model");
const crypto = require("crypto");

class SudoService {
  //usage for president role only
  static async createApiKey({ permissions }) {
    const apiKey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: [permissions],
    });
    if (!apiKey) throw new BadRequestError("Create API Key failed");
    return apiKey;
  }
}

module.exports = SudoService;
