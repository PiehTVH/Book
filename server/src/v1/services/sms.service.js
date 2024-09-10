"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const firebaseAccountModel = require("../models/firebase.accounts.model");

class SMSService {
  //find available firebase accounts
  static async getFirebaseAccount() {
    const listAccounts = firebaseAccountModel.findOne({
      verify_per_day: { $lt: 5 },
    });

    if (listAccounts.length <= 0) {
      throw new NotFoundError("Couldn't find any available firebase account");
    } else {
      return listAccounts;
    }
  }

  static async increaseVerifyPerDay({ email }) {
    const foundAccount = await firebaseAccountModel.findOne({ email: email });
    if (!foundAccount) {
      throw new BadRequestError(`Firebase account not found`);
    }
    if (foundAccount.verify_per_day < 5) {
      // Tăng giá trị verify_per_day lên 1
      foundAccount.verify_per_day += 1;
      await foundAccount.save();
      return foundAccount;
    } else {
      throw new BadRequestError(
        `Maximum verify_per_day limit reached for Firebase account`
      );
    }
  }
}

module.exports = SMSService;
