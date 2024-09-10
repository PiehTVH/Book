"use strict";
const db = require("../models/sequelize/models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class OrderService {
  //get order of user ID
  static getOrders = async ({
    userId,
    status = null,
    page = 1,
    limit = 10,
  }) => {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    let whereClause = {};
    if (status !== null) {
      whereClause.ob_status = status;
    }
    const listOrders = await db.order_book.findAll({
      include: [
        {
          model: db.order,
          attributes: ["order_id", "order_status", "order_user_id"],
          where: { order_user_id: foundUser.dataValues.user_id },
        },
        {
          model: db.book,
          attributes: ["book_title", "book_img", "book_spe_price"],
        },
      ],
      where: whereClause,
      attributes: [
        "ob_book_id",
        "ob_quantity",
        "ob_total_price",
        "ob_status",
        "create_time",
      ],
      order: [["create_time", "DESC"]],
      limit: limit,
      offset: (page - 1) * limit,
    });

    const formattedListOrders = listOrders.map((order) => {
      return {
        detailBillId: order.ob_book_id + order.order.order_id,
        bookId: order.ob_book_id,
        name: order.book.book_title,
        price: order.book.book_spe_price,
        quantity: order.ob_quantity,
        imageSrc: order.book.book_img,
        billId: order.order.order_id,
        status: order.ob_status,
        billStatus: order.order.order_status,
        date: order.create_time,
      };
    });

    return formattedListOrders;
  };

  //get one order
  static getOneOrder = async ({ orderId }) => {
    const foundOrder = await db.order.findByPk(orderId);
    if (!foundOrder) throw new NotFoundError("Order not found");

    const orderDetail = await db.order_book.findAll({
      where: {
        ob_order_id: foundOrder.dataValues.order_id,
      },
    });

    const orderBook = [];
    for (let i = 0; i < orderDetail.length; i++) {
      const bookId = orderDetail[i].ob_book_id;

      const book = await db.book.findByPk(bookId);
      const bookDetail = await db.book_detail.findByPk(bookId);

      orderBook.push({
        bookId: book.dataValues.book_id,
        bookImg: book.dataValues.book_img,
        bookTitle: book.dataValues.book_title,
        bookQuantity: orderDetail[i].ob_quantity,
        bookPrice: orderDetail[i].ob_total_price,
        bookStatus: orderDetail[i].ob_status,
        bookAuthor: bookDetail.dataValues.book_authors_name,
        bookLayout: bookDetail.dataValues.book_layout,
      });
    }

    return {
      order: {
        order_id: foundOrder.dataValues.order_id,
        order_tracking_code: foundOrder.dataValues.order_tracking_code,
        order_status: foundOrder.dataValues.order_status,
        order_payment: foundOrder.dataValues.order_payment,
        order_num_books: foundOrder.dataValues.order_num_books,
        order_old_total: foundOrder.dataValues.order_old_total,
        order_spe_total: foundOrder.dataValues.order_spe_total,
        order_fee_service: foundOrder.dataValues.order_fee_service,
        order_fee_shiping: foundOrder.dataValues.order_fee_shiping,
        order_discount_amount: foundOrder.dataValues.order_discount_amount,
        create_time: foundOrder.dataValues.create_time,
      },
      orderDetail: orderBook,
    };
  };

  static getAllOrder = async ({ userId }) => {
    const foundOrder = await db.order.findOne({
      where: { order_user_id: userId },
    });
    if (!foundOrder) throw new NotFoundError("Order not found");

    const foundDetailOrder = await db.order_book.findAll({
      where: { ob_order_id: foundOrder.dataValues.order_id },
    });
    if (!foundDetailOrder) throw new NotFoundError("Order not found");

    return {
      order: foundOrder,
      order_book: foundDetailOrder,
    };
  };
}
module.exports = OrderService;
