// routes/polls.js
const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const Meal = require('../models/meal');
const User = require('../models/user');

// Get current poll
router.get('/', async (req, res) => {
  try {
    const currentPoll = await Poll.findOne({ endDate: { $gte: new Date() } }).populate('mealOptions').lean();
    if (!currentPoll) {
      return res.status(404).send('No active poll found');
    }
    res.render('poll', { poll: currentPoll });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Vote in the poll
router.post('/vote', async (req, res) => {
  try {
    const { userId, mealId, pollId } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).send('Poll not found');
    }

    const alreadyVoted = poll.votes.some(vote => vote.user.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).send('User has already voted');
    }

    poll.votes.push({ user: userId, meal: mealId });
    await poll.save();

    res.redirect('/polls');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
