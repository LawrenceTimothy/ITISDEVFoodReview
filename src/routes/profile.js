const express = require('express');
const multer = require('multer');
const router = express.Router();
const User = require('../models/user'); // Adjust path as per your project structure
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'profile/src/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// View profile (GET request)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user }); // Assuming 'profile.hbs' is your view template
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
    res.render('editProfile', { user }); // Assuming 'editProfile.hbs' is your edit view template
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit profile (POST request)
router.post('/edit/:username', upload.single('newProfilePicture'), async (req, res) => {
  try {
    const { username } = req.params;
    const { description } = req.body;
    let profilePicture = req.body.profilePicture;

    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { profilePicture, description },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
