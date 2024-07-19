<<<<<<< Updated upstream:viewFoods/src/models/food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pictureUrl: { type: String },
  overallRating: { type: Number },
  description: { type: String },
  ingredients: { type: [String] },
  calorieCount: { type: Number },
  bestPartneredWith: { type: String }
});

=======
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pictureUrl: { type: String, default: '' },
  overallRating: { type: Number },
  description: { type: String },
  ingredients: { type: [String] },
  calorieCount: { type: Number },
  bestPartneredWith: { type: String }
});

>>>>>>> Stashed changes:src/models/food.js
module.exports = mongoose.model('Food', foodSchema);