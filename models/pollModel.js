const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      name: { type: String, required: true },
      pictureUrl: { type: String },
      votes: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model('Poll', pollSchema);