const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '' },
  description: { type: String, default: '' },
  reviews: [String],
  //comments: [String],
  bookmarkedMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]

});

module.exports = mongoose.model('User', UserSchema);