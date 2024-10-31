const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/users"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, "User" + "-" + req.params.userId + ext); // Set the filename for uploaded files
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000000000 }, // Set file size limit (in bytes)
});

module.exports = upload;
