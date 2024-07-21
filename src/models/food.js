const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pictureUrl: { type: String, default: '' },
  overallRating: { type: Number },
  description: { type: String },
  ingredients: { type: [String] },
  calorieCount: { type: Number },
  bestPartneredWith: { type: String },
  isMealOfTheWeek: { type: Boolean, default: false }
});

module.exports = mongoose.model('Food', foodSchema);