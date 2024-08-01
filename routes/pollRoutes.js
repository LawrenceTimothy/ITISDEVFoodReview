const express = require('express');
const router = express.Router();
const Poll = require('../models/pollModel');

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
});

module.exports = router;
