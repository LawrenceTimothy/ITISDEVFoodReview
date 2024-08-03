const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    overallRating: { type: Number, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    calorieCount: { type: Number, required: true },
    bestPartneredWith: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
