"use strict";
const db = require("../models/sequelize/models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class FeedbackService {
  //summary
  static summary = async ({ bookId, limit }) => {
    const feedbacks = await db.feedback.findAll({
      where: {
        feedback_bookid: bookId,
        feedback_rating: { [db.Sequelize.Op.ne]: "0" },
      },
      attributes: ["feedback_rating"],
    });

    const book = await db.book.findByPk(bookId);

    let star_5 = 0;
    let star_4 = 0;
    let star_3 = 0;
    let star_2 = 0;
    let star_1 = 0;

    feedbacks.forEach((feedback) => {
      switch (feedback.feedback_rating) {
        case "5":
          star_5++;
          break;
        case "4":
          star_4++;
          break;
        case "3":
          star_3++;
          break;
        case "2":
          star_2++;
          break;
        case "1":
          star_1++;
          break;
        default:
          break;
      }
    });

    return {
      star_5,
      star_4,
      star_3,
      star_2,
      star_1,
      totalCount: feedbacks.length,
      avg_rating: book.dataValues.book_avg_rating,
    };
  };

  //get feedback for book
  static getFeedbackByBookId = async ({
    bookId,
    page = 1,
    limit = 10,
    filter = "default",
    sort = "default",
  }) => {
    let orderBy = [];
    if (sort === "z_a") {
      orderBy.push(["feedback_rating", "ASC"]);
    } else if (sort === "a_z") {
      orderBy.push(["feedback_rating", "DESC"]);
    } else {
      orderBy.push(["create_time", "DESC"]);
    }

    //Total
    const totalCount = await db.feedback.count({
      where: {
        feedback_bookid: bookId,
        feedback_rating: { [db.Sequelize.Op.ne]: "0" },
        ...(filter === "default" ? "" : { feedback_rating: filter }),
      },
      order: orderBy,
    });
    const totalPages = Math.ceil(totalCount / limit);

    //Pagination
    const listFeedback = await db.feedback.findAll({
      where: {
        feedback_bookid: bookId,
        feedback_rating: { [db.Sequelize.Op.ne]: "0" },
        ...(filter === "default" ? "" : { feedback_rating: filter }),
      },
      include: [
        {
          model: db.user,
          attributes: ["user_username", "user_avatar"],
        },
      ],
      limit: limit,
      offset: (page - 1) * limit,
      order: orderBy,
    });

    return {
      totalCount,
      totalPages,
      comments: listFeedback,
    };
  };

  //check user feedback
  static isFeedback = async ({
    userId,
    bookId,
    orderId,
    isWithTran = true,
  }) => {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    if (isWithTran) {
      const foundTransations = await db.transaction.findOne({
        where: {
          tran_order_id: orderId,
        },
      });

      if (
        !foundTransations ||
        (foundTransations.dataValues.tran_status !== "Completed" &&
          foundTransations.dataValues.tran_status !== "Pending")
      ) {
        return {
          isFeedback: true,
        };
      }
    }

    const foundFeedback = await db.feedback.findOne({
      where: {
        feedback_userid: foundUser.dataValues.user_id,
        feedback_bookid: bookId,
        feedback_orderid: orderId,
        feedback_rating: { [db.Sequelize.Op.ne]: "0" },
      },
    });

    if (!foundFeedback) {
      return {
        isFeedback: false,
      };
    } else {
      return {
        isFeedback: true,
      };
    }
  };

  //submit feedback
  static submitFeedback = async ({
    userId,
    bookId,
    orderId,
    rating,
    comment,
    isWithTran = true,
  }) => {
    //find user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    //find order
    const foundOrder = await db.order.findByPk(orderId);
    if (!foundOrder) throw new NotFoundError("Order not found");

    const foundBook = await db.book.findByPk(bookId);
    if (!foundBook) throw new NotFoundError("Book not found");

    const status = await FeedbackService.isFeedback({
      userId,
      bookId,
      orderId: foundOrder.dataValues.order_id,
      isWithTran,
    });

    let feedback = null;
    if (isWithTran || status.isFeedback) {
      feedback = await db.feedback.update(
        {
          feedback_rating: JSON.stringify(rating),
          feedback_content: comment,
        },
        {
          where: {
            feedback_userid: foundUser.dataValues.user_id,
            feedback_bookid: bookId,
            feedback_orderid: foundOrder.dataValues.order_id,
          },
        }
      );
    } else {
      feedback = await db.feedback.create({
        feedback_userid: foundUser.dataValues.user_id,
        feedback_bookid: bookId,
        feedback_orderid: foundOrder.dataValues.order_id,
        feedback_rating: JSON.stringify(rating),
        feedback_content: comment,
      });
    }

    if (!feedback) throw new BadRequestError("Create feedback failed!");

    //update book rating
    if (rating > 0) {
      const newRating =
        (foundBook.dataValues.book_avg_rating *
          foundBook.dataValues.book_num_rating +
          rating) /
        (foundBook.dataValues.book_num_rating + 1);
      await foundBook.set({
        book_avg_rating: newRating.toFixed(1),
        book_num_rating: foundBook.dataValues.book_num_rating + 1,
      });

      await foundBook.save();
    }

    return feedback;
  };
}
module.exports = FeedbackService;
