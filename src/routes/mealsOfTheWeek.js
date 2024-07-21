// src/routes/mealsOfTheWeek.js

const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Middleware to get current date
const getCurrentDate = () => {
  const today = new Date();
  return today.toDateString();
};

// View Meals of the Week
router.get('/', async (req, res) => {
  try {
    const today = getCurrentDate();
    const mealsOfTheWeek = await Meal.find({ isMealOfTheWeek: true }).lean();
    res.render('mealsOfTheWeek', { meals: mealsOfTheWeek, today });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
