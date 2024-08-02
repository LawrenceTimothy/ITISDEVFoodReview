const express = require('express');
const router = express.Router();
const Meal = require('../models/mealModel'); 

// View all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Meal.find().lean();
    console.log(foods); // Log the fetched data to verify it
    res.render('viewFoods', { foods });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
