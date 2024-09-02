"use strict";

const mongoose = require("mongoose");

const connectionString = `mongodb+srv://hiep:hiep@cluster0.mab1aqy.mongodb.net/`;

mongoose
  .connect(connectionString)
  .then((_) => {
    console.log("Connected mongoDB successfully");
  })
  .catch((err) => {
    console.log(`Error connecting::${err.message}`);
  });

//dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
