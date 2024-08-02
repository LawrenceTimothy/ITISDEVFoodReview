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

// GET: Edit food item
router.get('/edit/:id', async (req, res) => {
  try {
    const food = await Meal.findById(req.params.id).lean();
    if (!food) {
      return res.status(404).send('Food item not found');
    }
    res.render('editviewFoods', { food });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST: Update food item
router.post('/edit/:id', async (req, res) => {
  try {
    const updatedFood = {
      name: req.body.name,
      pictureUrl: req.body.pictureUrl,
      overallRating: req.body.overallRating,
      description: req.body.description,
      ingredients: req.body.ingredients.split(',').map(item => item.trim()),
      calorieCount: req.body.calorieCount,
      bestPartneredWith: req.body.bestPartneredWith
    };
    await Meal.findByIdAndUpdate(req.params.id, updatedFood);
    res.redirect('/viewfood');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
