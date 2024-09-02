require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const { model } = require("mongoose");

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  const error = new Error("Service Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
