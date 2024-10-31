const roleController = require("../controllers/role.controller");
const express = require("express");
const router = express.Router();

router.get("/", roleController.getAllRoles);
module.exports = router;
