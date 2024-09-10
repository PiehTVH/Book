"use strict";

const { SuccessResponse } = require("../core/success.response");
const publisherService = require("../services/publisher.service");

class PublisherController {
  getAllPublisher = async (req, res, next) => {
    console.log("in get all pub");
    // console.log(req.query.id)
    const data = await publisherService.getAllPublisher();

    new SuccessResponse({
      metadata: data,
    }).send(res);
  };
}

module.exports = new PublisherController();
