const express = require("express");
const authenticateToken = require("../middlewares/auth");
const userController = require("../controllers/user.controller");
const upload = require("../../config/multerConfig");
const router = express.Router();

/**
 * @Swagger
 * /api/users/signup:
 *  post:
 *      summary: Register a new user
 *      requestBody:;
 *          required: true
 *          content:
 *              application/json
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          201:
 *              description: User created
 *          500:
 *              description: Error creating user
 */
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refreshToken);
router.get("/getUser", authenticateToken, userController.getUser);
router.get("/protected", authenticateToken, userController.protectedRoute);
router.put(
  "/updateUserProfilePicture/:userId",
  [
    authenticateToken,
    (req, res, next) => {
      if (req.params.userId != req.user.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    },
    upload.single("profilePicture"),
  ],
  userController.updateUserPicture
);
module.exports = router;
