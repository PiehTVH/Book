const express = require("express");
const userRoutes = require("./user.route");
const roleRoutes = require("./role.route");

const router = express.Router();

// Use the userRoutes
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

// Here you can add more route groups in the future
// router.use('/posts', postRoutes);

module.exports = router;
