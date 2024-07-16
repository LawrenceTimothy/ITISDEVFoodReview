// models/poll.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  mealOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true }],
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Poll', pollSchema);
