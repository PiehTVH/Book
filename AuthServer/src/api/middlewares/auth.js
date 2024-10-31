const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ unauthorizedMessage: "No Token Founded" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ unauthorizedMessage: "Invalid Token" });
    }
    if ((await User.findByPk(user.userId)) === null) {
      return res.status(403).json({ unauthorizedMessage: "User not found" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
