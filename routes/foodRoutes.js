const express = require("express");
const router = express.Router();
const Review = require('../models/reviewModel');
const Food = require('../models/foodModel'); // Adjust path as per your project structure
const foodTestData = require("../data/foodData.js");
const reviewTestData = require("../data/reviewData.js");

router.get("/", async (req, res) => {
    try {
        const foods = await Food.find().lean(); // Retrieve all foods from MongoDB
        res.send(foods);
        // res.render('viewFoods', { foods });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post("/reset", async (req, res) => {
    try {
        await Food.deleteMany({});
        for (let i = 0; i < foodTestData.length; i++) {
            const food = new Food(foodTestData[i]);
            await food.save();
        }
        res.send(foodTestData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Food review endpoints
router.get("/:id/reviews", async (req, res) => {
    const foodId = req.params.id;
    if (req.session.user) {
        // Get reviews for the given food ID.
        const data = await Review.findById(foodId)
            
        res.render("review_page", { reviews: data });
    }
    // TODO: Currently set for easier access. To change to login page.
    else {
        // Get reviews for the given food ID.
        const data = await Review.find({ foodId })
            .populate("reviewUser")
            .exec();
                console.log(data);
        res.render("review_page", { reviews: data });
    }
});

router.post("/:id/reviews", async (req, res) => {
    const foodId = req.params.id;
    await Review.deleteMany({});

    for(let i = 0; i < reviewTestData.length; i++) {
        const review = new Review(reviewTestData[i]);
        await review.save();
    }
    res.send(reviewTestData);
});

module.exports = router;