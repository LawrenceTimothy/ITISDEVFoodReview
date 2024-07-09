// src/routes/foods.js

const express = require('express');
const router = express.Router();
const Food = require('../models/food'); // Adjust path as per your project structure

// View all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().lean(); // Retrieve all foods from MongoDB

    // Render viewFoods.hbs with the list of foods
    res.render('viewFoods', { foods });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;