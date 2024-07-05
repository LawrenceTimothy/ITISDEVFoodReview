const mongoose = require('mongoose');

// Temporary schema for the use of populating the reviews.
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('jtptestusers', UserSchema);

module.exports = User;