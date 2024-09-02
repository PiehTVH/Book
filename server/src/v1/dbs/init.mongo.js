"use strict";

const {
  db: { host, username, password },
} = require("../configs/config");
const mongoose = require("mongoose");

const connectionString = `mongodb+srv://${username}:${password}@${host}/`;

const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    //dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString)
      .then((_) => {
        console.log("Connected mongoDB successfully");
        countConnect();
      })
      .catch((err) => {
        console.log(`Error connecting::${err.message}`);
      });
  }

  //instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
