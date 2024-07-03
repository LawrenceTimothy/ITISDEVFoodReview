// src/routes/profile.js

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path as per your project structure

// View profile (GET request)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('viewProfile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit profile (GET request)
router.get('/edit/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('editProfile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit profile (POST request)
router.post('/edit/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { profilePicture, description } = req.body;

    const user = await User.findOneAndUpdate(
      { username },
      { profilePicture, description },
      { new: true }
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
