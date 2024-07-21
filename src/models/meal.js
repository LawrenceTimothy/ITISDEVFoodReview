const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pictureUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isMealOfTheWeek: { type: Boolean, default: false }
});

module.exports = mongoose.model('Meal', mealSchema);
