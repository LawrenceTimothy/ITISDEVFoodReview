const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Meal = require('../models/foodModel'); 

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with original extension
    }
});

const upload = multer({ storage: storage });

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
router.post('/edit/:id', upload.single('picture'), async (req, res) => {
  try {
    const { name, overallRating, description, calorieCount, bestPartneredWith } = req.body;
    const pictureUrl = req.file ? `/images/${req.file.filename}` : req.body.oldPictureUrl;

    // Handle undefined or empty ingredients
    const ingredients = req.body.ingredients ? req.body.ingredients.split(',').map(item => item.trim()) : [];

    const updatedFood = {
      name,
      pictureUrl,
      overallRating,
      description,
      ingredients,
      calorieCount,
      bestPartneredWith
    };

    await Meal.findByIdAndUpdate(req.params.id, updatedFood);
    res.redirect('/viewfood');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
