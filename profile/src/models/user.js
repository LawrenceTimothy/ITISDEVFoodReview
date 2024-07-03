const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  description: { type: String, default: '' },
  reviews: [String],
  comments: [String],
});

module.exports = mongoose.model('User', UserSchema);