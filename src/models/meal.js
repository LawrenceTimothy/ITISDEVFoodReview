// models/meal.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pictureUrl: { type: String },
  availability: { type: Boolean, default: true },
  discounts: { type: [String] },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Meal', mealSchema);
