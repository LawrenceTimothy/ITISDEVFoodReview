const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');
const upload = require('../middleware/multer'); // Import multer configuration

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

// Get the form to edit a meal
router.get('/edit/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).lean();
    if (!meal) {
      return res.status(404).send('Meal not found');
    }
    res.render('editMeal', { meal });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Server error');
  }
});

// Handle form submission to update a meal
router.post('/edit/:id', upload.single('pictureUrl'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const mealId = req.params.id;

    const updatedMeal = {
      name,
      description,
      price,
      pictureUrl: req.file ? `/images/${req.file.filename}` : req.body.pictureUrl
    };

    const result = await Meal.findByIdAndUpdate(mealId, updatedMeal, { new: true });
    if (!result) {
      return res.status(404).send('Meal not found');
    }

    res.redirect('/meals');
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
