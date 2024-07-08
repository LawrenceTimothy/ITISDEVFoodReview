// Technically not needed, since reviews are binded to foods.
// This module is just for testing and development purposes.

const express = require("express");
const router = express.Router();

const Review = require('../models/reviewmodel');
const reviewTestData = require("../data/reviewData.js");

router.post("/reset", async (req, res) => {
    await Review.deleteMany({});

    for(let i = 0; i < reviewTestData.length; i++) 
    {
        const review = new Review(reviewTestData[i]);
        await review.save();
    }
    res.send(reviewTestData);
});

module.exports = router;