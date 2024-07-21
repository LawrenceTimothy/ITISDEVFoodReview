const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Get home page
router.get('/', async (req, res) => {
  try {
    const mealsOfTheWeek = await Meal.find({ isMealOfTheWeek: true }).lean();
    res.render('home', { mealsOfTheWeek, today: new Date().toLocaleDateString() });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
