class CartService {
  //remove all cart
  static async removeAllCarts({ userId }) {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const foundCart = await db.cart.findOne({
      where: {
        cart_userid: foundUser.dataValues.user_id,
      },
    });
    if (!foundCart) throw new NotFoundError("Cart not found");

    const remove = db.cart_book.destroy({
      where: {
        cb_cart_id: foundCart.dataValues.cart_id,
      },
    });
    if (!remove) throw new BadRequestError("Cart could not be removed");

    //update num cart
    await foundCart.set({
      cart_count_products: 0,
    });
    await foundCart.save();

    return await CartService.getListCarts({ userId });
  }

  //Get NumCart
  static async getNumCart({ userId }) {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const cart = await db.cart.findOne({
      where: {
        cart_userid: foundUser.dataValues.user_id,
      },
    });
    if (!cart) throw new NotFoundError("Cart not found");

    return {
      cartId: cart.dataValues.cart_id,
      numCart: cart.dataValues.cart_count_products,
    };
  }

  //Get Carts
  static async getListCarts({ userId }) {
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const userCart = await db.cart.findOne({
      where: {
        cart_userid: foundUser.dataValues.user_id,
      },
    });
    if (!userCart) {
      throw new NotFoundError("User Cart not found");
    }

    const listCarts = await db.cart_book.findAll({
      where: {
        cb_cart_id: userCart.dataValues.cart_id,
      },
      include: [
        {
          model: db.book,
          attributes: [
            "book_title",
            "book_img",
            "book_spe_price",
            "book_old_price",
            "book_publisherId",
          ],
        },
        {
          model: db.bool_detail,
          attributes: ["book_authors_name", "book_pulisherName", "book_layout"],
        },
      ],
      attributes: ["cb_book_id", "cb_book_num"],
    });

    return {
      cart_count_products: userCart.dataValues.cart_count_products,
      cart_data: listCarts,
    };
  }
}
