"use strict";

const { SuccessResponse } = require("../core/success.response");
const FavoriteBookService = require("../services/favoritebook.service");

class FavoriteBookController {
  getListFavoriteBook = async (req, res, next) => {
    const data = await FavoriteBookService.getListFavoriteBook(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getStatusFavoriteBook = async (req, res, next) => {
    const data = await FavoriteBookService.getStatusFavoriteBook(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  addFavoriteBook = async (req, res, next) => {
    const data = await FavoriteBookService.addFavoriteBook(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };
}

module.exports = new FavoriteBookController();
