const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const userController = require("../../controllers/user.controller");

router.post("/getInfo", asyncHandler(userController.getUserInfo));
router.post("/updateInfo", asyncHandler(userController.updateProfile));

module.exports = router;
