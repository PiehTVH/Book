"use strict";

const {
  DISCOUNT_WALLET_STATUS,
  DISCOUNT_TYPE,
  DISCOUNT_APPLY_TO,
} = require("../const/discount");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const db = require("../models/sequelize/models");
const {
  checkDiscountCode,
  checkAndupdateDiscountWallet,
} = require("../utils/checkDiscountCode");
/*
    Key features: Discount Service
    - add discount to user discount wallet
    - update discount
    - create discount [Admin]
    - get list discount
*/

class DiscountService {
  //create discount
  static async createDiscount(payload) {
    /*
            {
                supplierId,
                discountName,
                discountDes,
                discountType,
                discountValue,
                discountCode,
                discountStartDate,
                discountEndDate,
                discountMaxUses,
                discountMaxUsesPerUser
                discountMinOrderValue,
                discountIsActive,
                discountApplyTo,
                discountProductIds
            }
        */

    const {
      supplierId,
      discountName,
      discountDes,
      discountType,
      discountValue,
      discountCode,
      discountStartDate,
      discountEndDate,
      discountMaxUses,
      discountMaxUsesPerUser,
      discountMinOrderValue,
      discountIsActive,
      discountApplyTo,
      discountProductIds,
    } = payload;

    if (!discountName || !discountDes) {
      throw new BadRequestError("Input invalid");
    }

    if (
      discountType !== DISCOUNT_TYPE.FIXED_AMOUNT &&
      discountType !== DISCOUNT_TYPE.PERCENTAGE
    )
      throw new BadRequestError("Discount type is invalid");

    if (discountType === DISCOUNT_TYPE.PERCENTAGE && discountValue > 100.0) {
      throw new BadRequestError("Discount value is invalid");
    }

    if (discountCode.length < 6)
      throw new BadRequestError("Discount code must be at least 6 characters");

    if (new Date(discountStartDate) >= new Date(discountEndDate))
      throw new BadRequestError("End date must be greater than start date");

    if (discountMaxUses < 0)
      throw new BadRequestError("Discount max uses must be granter then 0");

    if (discountMaxUsesPerUser < 0)
      throw new BadRequestError(
        "Discount max uses per user must be greater than 0"
      );

    if (
      discountApplyTo !== DISCOUNT_APPLY_TO.SPECIFIC &&
      discountApplyTo !== DISCOUNT_APPLY_TO.ALL
    )
      throw new BadRequestError("Discount Apply To is invalid");

    if (
      discountApplyTo === DISCOUNT_APPLY_TO.SPECIFIC &&
      discountProductIds.length === 0
    )
      throw new BadRequestError("Add products will be applied discount code");

    const foundSupplier = await db.supplier.findByPk(supplierId);
    if (!foundSupplier) throw new NotFoundError("Supplier not found");

    const existsCode = await db.discount.findOne({
      where: {
        discount_code: discountCode,
      },
    });

    if (existsCode) throw new BadRequestError("Discount code already exists");

    // Create Discount
    const newDiscount = await db.discount.create({
      discount_supplierId: supplierId,
      discount_name: discountName,
      discount_des: discountDes,
      discount_type: discountType,
      discount_value: discountValue,
      discount_code: discountCode,
      discount_start_date: discountStartDate,
      discount_end_date: discountEndDate,
      discount_max_uses: discountMaxUses,
      discount_count_used: 0, // Mặc định là 0 khi tạo mới
      discount_max_uses_per_user: discountMaxUsesPerUser,
      discount_min_order_value: discountMinOrderValue,
      discount_is_active: discountIsActive,
      discount_apply_to: discountApplyTo,
      discount_product_ids: discountProductIds,
      create_time: new Date(),
      update_time: new Date(),
    });

    if (!newDiscount) throw new BadRequestError("Discount create failed");

    return newDiscount;
  }

  //apply discount
  static async applyDiscount({ userId, discountId, product = {}, order = {} }) {
    /*
            discountId
            discountCode
            userId
            product{
                productId,
                quantity,
                price
            }
            order{
                orderId,
                price,
                feeShip,
                feeService
            }
        */

    //find user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const discountWallet = await db.discount_wallet.findOne({
      where: {
        dw_discount_id: discountId,
        dw_user_id: foundUser.dataValues.user_id,
      },
    });

    //Check in discount wallet
    if (!discountWallet)
      throw new NotFoundError("Discount not found in your wallet");

    if (
      discountWallet.dataValues.dw_discount_status ===
      DISCOUNT_WALLET_STATUS.INACTIVE
    )
      throw new BadRequestError("Discount not available");

    if (
      discountWallet.dataValues.dw_discount_status ===
      DISCOUNT_WALLET_STATUS.OUTDATE
    )
      throw new BadRequestError("Discount is out of date");

    if (
      discountWallet.dataValues.dw_discount_quatity <=
      discountWallet.dataValues.dw_discount_used
    )
      throw new BadRequestError("Discount usage limit has been reached");

    const discount = await db.discount.findByPk(
      discountWallet.dataValues.dw_discount_id
    );
    //Check discount
    //check discount exists
    await checkAndupdateDiscountWallet(discount, discountWallet);
    // checkDiscountCode(discount)

    //check max uses per user
    if (
      discountWallet.dataValues.dw_discount_used >=
      discount.dataValues.discount_max_uses_per_user
    ) {
      throw new BadRequestError("Discount usage limit has been reached");
    }

    //Product
    if (discount.dataValues.discount_apply_to === DISCOUNT_APPLY_TO.SPECIFIC) {
      //check min order value
      if (
        discount.dataValues.discount_min_order_value >
        product.price * product.quantity
      )
        throw new BadRequestError(
          `Min price must be greater than ${discount.dataValues.discount_min_order_value}`
        );

      //check discount can apply for product
      if (
        !discount.dataValues.discount_product_ids.includes(product.productId)
      ) {
        throw new NotFoundError("Discount is not apply for this product");
      }
    }
    //Order
    else if (discount.dataValues.discount_apply_to === DISCOUNT_APPLY_TO.ALL) {
      //check min order value
      if (discount.dataValues.discount_min_order_value > order.price)
        throw new BadRequestError(
          `Min price must be greater than ${discount.dataValues.discount_min_order_value}`
        );
    } else {
      throw new BadRequestError("Request data is not valid");
    }

    //update discount
    await discount.set({
      discount_count_used: discount.dataValues.discount_count_used + 1,
      update_time: new Date(),
    });
    await discount.save();
    if (
      discount.dataValues.discount_count_used >=
      discount.dataValues.discount_max_uses
    ) {
      discount.set({
        discount_is_active: 0,
        update_time: new Date(),
      });
      discount.save();
    }

    //update discount wallet
    await discountWallet.set({
      dw_discount_used: discountWallet.dataValues.dw_discount_used + 1,
      update_time: new Date(),
    });
    await discountWallet.save();
    if (
      discount.dataValues.discount_is_active === 0 ||
      discountWallet.dataValues.dw_discount_quatity <=
        discountWallet.dataValues.dw_discount_used
    ) {
      await discountWallet.set({
        dw_discount_status: DISCOUNT_WALLET_STATUS.INACTIVE,
        update_time: new Date(),
      });
      await discountWallet.save();
    }

    return {
      discount,
      discountWallet,
    };
  }

  //get discount amount
  static async getDiscountAmount({
    discountId,
    discountCode,
    userId,
    product = {},
    order = {},
  }) {
    //find user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    let discount = null;
    let discountWallet = null;
    //Check discount is in wallet
    if (!discountId) {
      discount = await db.discount.findOne({
        where: {
          discount_code: discountCode,
        },
      });

      //collect discount
      discountWallet = await DiscountService.collectDiscount({
        userId: foundUser.dataValues.user_id,
        discountId: discount.dataValues.discount_id,
      });
    } else {
      discountWallet = await db.discount_wallet.findOne({
        where: {
          dw_discount_id: discountId,
          dw_user_id: foundUser.dataValues.user_id,
        },
      });

      if (!discountWallet)
        throw new NotFoundError("Discount not found in wallet");

      discount = await db.discount.findByPk(discountId);
    }

    //check discount
    checkDiscountCode(discount);

    //check max uses per user
    if (
      discountWallet.dataValues.dw_discount_used >=
      discount.dataValues.discount_max_uses_per_user
    ) {
      throw new BadRequestError("Discount usage limit has been reached");
    }

    //check discount wallet
    if (
      discountWallet.dataValues.dw_discount_status ===
      DISCOUNT_WALLET_STATUS.INACTIVE
    )
      throw new BadRequestError("Discount is not available");

    if (discount.dataValues.discount_apply_to === DISCOUNT_APPLY_TO.SPECIFIC) {
      //check min order value
      if (
        discount.dataValues.discount_min_order_value >
        product.price * product.quantity
      )
        throw new BadRequestError(
          `Min price must be greater than ${discount.dataValues.discount_min_order_value}`
        );

      //check discount can apply for product
      if (
        !discount.dataValues.discount_product_ids.includes(product.productId)
      ) {
        throw new NotFoundError("Discount is not apply for this product");
      } else {
        //return value
        const amount =
          discount.dataValues.discount_type === DISCOUNT_TYPE.FIXED_AMOUNT
            ? discount.dataValues.discount_value
            : product.price *
              product.quantity *
              (discount.dataValues.discount_value / 100);

        return {
          discountId: discount.dataValues.discount_id,
          productId: product.productId,
          quantity: product.quantity,
          oldPrice: product.price * product.quantity,
          discountedPrice: Math.max(
            product.price * product.quantity - amount,
            0
          ),
          amount,
          discountType: discount.dataValues.discount_type,
          discountValue: discount.dataValues.discount_value,
        };
      }
    } else if (
      discount.dataValues.discount_apply_to === DISCOUNT_APPLY_TO.ALL
    ) {
      //check min order value
      if (discount.dataValues.discount_min_order_value > order.price)
        throw new BadRequestError(
          `Min price must be greater than ${discount.dataValues.discount_min_order_value}`
        );

      //return value
      let oldPrice = order.price;
      if (order.feeShip) {
        oldPrice += order.feeShip;
      }
      if (order.feeService) {
        oldPrice += order.feeService;
      }
      const amount =
        discount.dataValues.discount_type === DISCOUNT_TYPE.FIXED_AMOUNT
          ? discount.dataValues.discount_value
          : oldPrice * (discount.dataValues.discount_value / 100);

      return {
        discountId: discount.dataValues.discount_id,
        oldPrice: oldPrice,
        discountedPrice: Math.max(oldPrice - amount, 0),
        amount,
        discountType: discount.dataValues.discount_type,
        discountValue: discount.dataValues.discount_value,
        feeShip: order.feeShip || 0,
        feeService: order.feeService || 0,
        discountApplyTo: discount.dataValues.discount_apply_to,
      };
    } else {
      throw new BadRequestError("Request data is not valid");
    }
  }

  // get discount wallet
  static async getDiscountWallet({ userId }) {
    //found user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const listDiscounts = await db.discount_wallet.findAll({
      where: {
        dw_user_id: foundUser.dataValues.user_id,
        dw_discount_status: DISCOUNT_WALLET_STATUS.ACTIVE,
      },
      include: [
        {
          model: db.discount,
          attributes: [
            "discount_name",
            "discount_des",
            "discount_type",
            "discount_value",
            "discount_code",
            "discount_end_date",
            "discount_min_order_value",
            "discount_apply_to",
          ],
        },
      ],
      attributes: [
        "dw_discount_id",
        "dw_discount_quatity",
        "dw_discount_used",
        "dw_discount_status",
      ],
    });

    return {
      count_discount: listDiscounts?.length || 0,
      data_discount: listDiscounts,
    };
  }

  //add discount to wallet
  static async addDiscountToWallet({ userId, discountId, quantity }) {
    const addDiscount = await db.discount_wallet.create({
      dw_discount_id: discountId,
      dw_user_id: userId,
      dw_discount_quatity: quantity,
    });

    if (!addDiscount) throw new BadRequestError("Add discount failed!");

    return addDiscount;
  }

  //collect discount
  static async collectDiscount({ userId, discountId }) {
    //find user
    const foundUser = await db.user.findOne({
      where: {
        user_sid: userId,
      },
    });
    if (!foundUser) throw new NotFoundError("User not found");

    const foundDiscount = await db.discount.findByPk(discountId);

    checkDiscountCode(foundDiscount);

    const discountInWallet = await db.discount_wallet.findOne({
      where: {
        dw_discount_id: foundDiscount.dataValues.discount_id,
        dw_user_id: foundUser.dataValues.user_id,
      },
    });

    //check discount is available in user wallet
    if (!discountInWallet) {
      //add discount to wallet
      return await DiscountService.addDiscountToWallet({
        userId: foundUser.dataValues.user_id,
        discountId: foundDiscount.dataValues.discount_id,
        quantity: 1,
      });
    } else {
      //check discount wallet active
      if (
        discountInWallet.dataValues.dw_discount_status ===
        DISCOUNT_WALLET_STATUS.INACTIVE
      ) {
        //check max uses
        if (
          discountInWallet.dataValues.dw_discount_used <
          foundDiscount.dataValues.discount_max_uses_per_user
        ) {
          await discountInWallet.set({
            dw_discount_quatity:
              discountInWallet.dataValues.dw_discount_quatity + 1,
            dw_discount_status: DISCOUNT_WALLET_STATUS.ACTIVE,
          });
          await discountInWallet.save();
          return discountInWallet;
        }
        throw new BadRequestError("Discount usage limit has been reached");
      } else {
        //check max uses
        if (
          discountInWallet.dataValues.dw_discount_quatity <
          foundDiscount.dataValues.discount_max_uses_per_user
        ) {
          await discountInWallet.set({
            dw_discount_quatity:
              discountInWallet.dataValues.dw_discount_quatity + 1,
          });
          await discountInWallet.save();
          return discountInWallet;
        }
        if (
          discountInWallet.dataValues.dw_discount_quatity >
          discountInWallet.dataValues.dw_discount_used
        ) {
          return discountInWallet;
        }
        throw new BadRequestError("This discount have been already used");
      }
    }
  }
}

module.exports = DiscountService;
