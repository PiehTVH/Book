const userService = require("../services/user.service");

exports.signup = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  try {
    await userService.createUser(
      username,
      password,
      firstname,
      lastname,
      email
    );
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.updateUserPicture = async (req, res) => {
  const user = await userService.updateUserPicture(
    req.params.userId,
    req.file.path
  );
  if (user) {
    res.json({
      message: "User picture updated",
      imageURL: user.imageURL,
      userId: user.id,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    const {
      token: accessToken,
      userId,
      imageURL,
      roles,
    } = await userService.authenticateUser(username, password);
    const refreshToken = await userService.generateRefreshToken(
      userId,
      username
    );
    if (accessToken && refreshToken) {
      await userService.saveRefreshToken(userId, refreshToken);
      res.json({
        accessToken,
        refreshToken,
        imageURL: imageURL.replace("public", ""),
        userId: userId,
        username: username,
        roles,
      });
    } else {
      res.status(401).send({ message: "Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.getUser = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

exports.protectedRoute = (req, res) => {
  res.json({ message: "This route is protected" });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = await userService.validateRefreshToken(refreshToken);
  if (decoded) {
    const { userId, username } = decoded;
    const newAccessToken = await userService.generateAccessToken(
      userId,
      username
    );
    res.json({ accessToken: newAccessToken });
  } else {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
