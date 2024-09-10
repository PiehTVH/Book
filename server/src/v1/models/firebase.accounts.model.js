"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "FirebaseAccount";
const COLLECTION_NAME = "FirebaseAccount";

// Declare the Schema of the Mongo model
var firebaseAccountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    authDomain: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    storageBucket: {
      type: String,
      required: true,
    },
    messagingSenderId: {
      type: String,
      required: true,
    },
    appId: {
      type: String,
      required: true,
    },
    measurementId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify_per_day: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Export the model
module.exports = model(DOCUMENT_NAME, firebaseAccountSchema);
