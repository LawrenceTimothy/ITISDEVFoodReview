const express = require('express');
const router = express.Router();
const Poll = require('../models/pollModel');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
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

// GET: Render edit poll form
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
// POST: Update poll
router.post('/edit/:id', upload.array('pictures', 5), async (req, res) => {
    try {
        const { question, options } = req.body;
        const files = req.files;

        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).send('Poll not found');
        }

        const updatedOptions = options.map((option, index) => {
            const existingOption = poll.options.find(o => o._id.toString() === option.id);

            return {
                _id: existingOption ? existingOption._id : undefined,
                name: option.name,
                calorieCount: option.calorieCount,
                pictureUrl: files && files[index] ? `/images/${files[index].filename}` : (existingOption ? existingOption.pictureUrl : undefined),
                votes: existingOption ? existingOption.votes : 0
            };
        });

        updatedOptions.forEach(option => {
            if (!option._id) {
                delete option._id;
            }
        });

        poll.question = question;
        poll.options = updatedOptions;

        await poll.save();
        res.redirect('/polls');
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
