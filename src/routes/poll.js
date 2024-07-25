const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Get the current poll
router.get('/', async (req, res) => {
  try {
    const poll = await Poll.findOne().lean();
    if (!poll) {
      return res.status(404).send('Poll not found');
    }
    res.render('poll', { poll });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Server error');
  }
});

// Vote for an option
router.post('/vote', async (req, res) => {
  try {
    const { optionName } = req.body;

    // Find the poll (assuming only one poll exists)
    const poll = await Poll.findOne();
    if (!poll) {
      return res.status(404).send('Poll not found');
    }

    // Find the option within the poll by name
    const option = poll.options.find(o => o.name === optionName);
    if (!option) {
      return res.status(404).send('Option not found');
    }

    // Increment votes
    option.votes += 1;

    // Save poll
    await poll.save();
    res.redirect('/polls');
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Server error');
  }
});

// Get the form to edit a poll
router.get('/edit/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) {
      return res.status(404).send('Poll not found');
    }
    res.render('editPoll', { poll });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Server error');
  }
});

router.post('/edit/:id', upload.array('pictures'), async (req, res) => {
  try {
    const { question, options, optionId } = req.body;
    const pollId = req.params.id;

    // Debugging: Log request body and files
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Check if options and optionId are arrays
    if (!Array.isArray(options) || !Array.isArray(optionId)) {
      throw new Error('Options or optionId is not an array');
    }

    // Convert options and optionIds to an array of objects
    const optionsArray = options.map((name, index) => ({
      _id: optionId[index],
      name,
      pictureUrl: req.files[index] ? `/images/${req.files[index].filename}` : undefined
    }));

    console.log('Options array:', optionsArray);

    // Update the poll
    const updatedPoll = {
      question,
      options: optionsArray
    };

    const result = await Poll.findByIdAndUpdate(pollId, updatedPoll, { new: true });
    if (!result) {
      return res.status(404).send('Poll not found');
    }

    res.redirect('/polls');
  } catch (err) {
    console.error('Error details:', err); // Log the error
    res.status(500).send('Server error');
  }
});



module.exports = router;
