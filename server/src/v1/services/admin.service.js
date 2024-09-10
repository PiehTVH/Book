"use strict";

const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const firebaseAccountModel = require("../models/firebase.accounts.model");

class AdminService {
  /**
   * Tạo một đối tượng FirebaseAccount và lưu vào MongoDB
   * @param {Object} accountData - Dữ liệu cho tài khoản Firebase
   * @param {String} accountData.email - Email của người dùng
   * @param {String} accountData.apiKey - API key của Firebase
   * @param {String} accountData.authDomain - Auth domain của Firebase
   * @param {String} accountData.projectId - Project ID của Firebase
   * @param {String} accountData.storageBucket - Storage bucket của Firebase
   * @param {String} accountData.messagingSenderId - Messaging sender ID của Firebase
   * @param {String} accountData.appId - App ID của Firebase
   * @param {String} accountData.measurementId - Measurement ID của Firebase
   */
  static async addFirebaseAccount(accountData) {
    //check apiKey is exists
    const foundFBAccount = await firebaseAccountModel.findOne({
      apiKey: accountData.apiKey,
    });

    if (foundFBAccount)
      throw new ConflictRequestError("Firebase Account already added");

    //Add new firebase account
    const firebaseAccount = await firebaseAccountModel.create({
      email: accountData.email,
      apiKey: accountData.apiKey,
      authDomain: accountData.authDomain,
      projectId: accountData.projectId,
      storageBucket: accountData.storageBucket,
      messagingSenderId: accountData.messagingSenderId,
      appId: accountData.appId,
      measurementId: accountData.measurementId,
      status: "active",
      verify_per_day: 0,
    });
    if (!firebaseAccount)
      throw new BadRequestError("Add Firebase Account failed!");

    return firebaseAccount;
  }
}

module.exports = AdminService;
