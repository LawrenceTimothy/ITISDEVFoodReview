// routes/meals.js
const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Get all meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().lean();
    res.render('meals', { meals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get a specific meal
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).lean();
    if (!meal) {
      return res.status(404).send('Meal not found');
    }
    res.render('mealDetail', { meal });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new meal
router.post('/', async (req, res) => {
  try {
    const { name, description, price, pictureUrl, availability, discounts } = req.body;
    const newMeal = new Meal({ name, description, price, pictureUrl, availability, discounts });
    await newMeal.save();
    res.redirect('/meals');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
