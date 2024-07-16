// routes/bookmarks.js
const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');
const User = require('../models/user');
const Meal = require('../models/meal');

// Get all bookmarks for a user
router.get('/:userId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.params.userId }).populate('meal').lean();
    res.render('bookmarks', { bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a bookmark
router.post('/:userId/:mealId', async (req, res) => {
  try {
    const newBookmark = new Bookmark({ user: req.params.userId, meal: req.params.mealId });
    await newBookmark.save();
    res.redirect(`/bookmarks/${req.params.userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
