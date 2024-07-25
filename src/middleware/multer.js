// src/middleware/multer.js
const multer = require('multer');
const path = require('path');

// Define storage location and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `pictures-${Date.now()}${path.extname(file.originalname)}`); // Unique filename
  }
});

// Create multer instance
const upload = multer({ storage: storage });

module.exports = upload;
