"use strict";

const { SuccessResponse } = require("../core/success.response");
const CategoryService = require("../services/category.service");

class CategoryController {
  getAllCategory = async (req, res, next) => {
    console.log("in getAllCategory");
    // console.log(req.query.id)
    const data = await CategoryService.getAllCategory();

    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getTop3Category = async (req, res, next) => {
    console.log("in getTop2Category");
    // console.log(req.query.id)
    const data = await CategoryService.getTop3Category();

    new SuccessResponse({
      metadata: data,
    }).send(res);
  };
}

module.exports = new CategoryController();
