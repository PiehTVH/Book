"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required:false,
      // unique:true,
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: "string" } },
      },
      trim: true,
    },
    phone: {
      type: String,
      // required:false,
      // unique:true,
      index: {
        unique: true,
        partialFilterExpression: { phone: { $type: "string" } },
      },
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
