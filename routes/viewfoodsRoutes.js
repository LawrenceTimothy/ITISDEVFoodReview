const express = require('express');
const router = express.Router();
const Meal = require('../models/foodModel'); 

// View all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Meal.find().lean();
    res.render('viewFoods', { foods });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
