// routes/bookmarks.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Meal = require('../models/meal');

// Add a meal to bookmarks
router.post('/add', async (req, res) => {
  try {
    const { username, mealId } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    
    if (!user.bookmarkedMeals.includes(mealId)) {
      user.bookmarkedMeals.push(mealId);
      await user.save();
    }

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove a meal from bookmarks
router.post('/remove', async (req, res) => {
  try {
    const { username, mealId } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    
    user.bookmarkedMeals = user.bookmarkedMeals.filter(id => id.toString() !== mealId);
    await user.save();

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// View bookmarked meals
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('bookmarkedMeals').lean();
    if (!user) return res.status(404).send('User not found');
    
    res.render('bookmarks', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
