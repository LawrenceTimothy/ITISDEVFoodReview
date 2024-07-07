const express = require("express");
const router = express.Router();
const Review = require('../models/reviewmodel');
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
// TODO: Add exception handling and session check.
router.get("/:id/reviews", async (req, res) => {
    const foodId = req.params.id;
    if (req.session.user) 
    {
        // Get reviews for the given food ID.
        const food = await Food.findById(foodId).lean();
        const data = await Review.find({ food: foodId })
            .populate("reviewUser")
            .populate("food")
            .exec();
        res.render("review_page", { 
            reviews: data,
            food: food
        });
    }
    // Login first
    else 
    {
        res.redirect('/login');
    }
});

// TODO: Add exception handling.
router.delete("/:id/reviews/:reviewId", async (req, res) => {
    const foodId = req.params.id;
    const reviewId = req.params.reviewId;
    const user = req.session.user;

    const review = await Review.findOne({reviewId: reviewId});

    // Check if session user is same as review user
    if (user !== undefined && user._id === review.reviewUser.toString())
    {
        // Delete review
        await Review.deleteOne({ _id: review._id});
        res.status(202).send();
    }
    else 
    {
        res.status(401).send("Unauthorized");
    }
});

// TODO: Add exception handling.
router.patch("/:id/reviews", async (req, res) => {
    const reviewId = req.body.reviewId;
    const reviewSubject = req.body.reviewSubject;
    const reviewBody = req.body.reviewBody;
    const isUpvote = req.body.isUpvote;
    const user = req.session.user;

    const review = await Review.findOne({ reviewId: reviewId });
    if (user !== undefined && user._id === review.reviewUser.toString())
    {
        await Review.findOneAndUpdate({ reviewId: reviewId }, 
            {
                reviewSubject,
                reviewBody,
                isUpvote
            },
            { new: true }
        );
        res.status(200).send(review);
    }
    else 
    {
        res.status(401).send("Unauthorized");
    }
});

module.exports = router;