// src/routes/meals.js
const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Get all meals and today's date
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().lean();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Render meals view with meals and today's date
    res.render('meals', { meals, today });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
