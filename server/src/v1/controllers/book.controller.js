"use strict";

const { SuccessResponse } = require("../core/success.response");
const BookService = require("../services/book.service");

class BookController {
  searchBooks = async (req, res, next) => {
    const data = await BookService.searchBooks(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getOneBook = async (req, res, next) => {
    const data = await BookService.getOneBook(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  createBook = async (req, res, next) => {
    const data = await BookService.createBook(req.body);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getAllBook = async (req, res, next) => {
    const data = await BookService.getAllBook();
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getBookById = async (req, res, next) => {
    let bookId = req.params.id;
    const data = await BookService.getBookById(bookId);
    new SuccessResponse({
      metadata: data,
    }).send(res);
  };

  getBookBySearchFilterSort = async (req, res) => {
    const {
      search,
      categories,
      sort,
      price,
      publisher,
      page = 1,
      limit = 1,
    } = req.query;
    try {
      const sortBy = sort ? sort : null;
      const filterCate =
        categories !== "all" && categories
          ? categories.split(",").map((cat) => encodeURIComponent(cat))
          : null;
      //console.log("categories", filterCate)
      const filterPrice = price
        ? price.split(",").map((p) => encodeURIComponent(p))
        : null;
      const filterPublisher = publisher ? publisher : null;
      const books = await BookService.getBookSearchFilterSort(
        search,
        filterCate,
        filterPrice,
        filterPublisher,
        sortBy,
        parseInt(page - 1),
        parseInt(limit)
      );
      new SuccessResponse({
        metadata: books,
      }).send(res);
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = new BookController();
