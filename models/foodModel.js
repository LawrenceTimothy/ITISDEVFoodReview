var mongoose = require('mongoose');

// Temporary schema for the use of populating the reviews.
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pictureUrl: { type: String },
    overallRating: { type: Number },
    description: { type: String },
    ingredients: { type: [String] },
    calorieCount: { type: Number },
    bestPartneredWith: { type: String }
  });
  
module.exports = mongoose.model('Food', foodSchema);