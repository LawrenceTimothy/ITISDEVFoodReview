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

// RENZO ADDITION BELOW
router.patch("/:id/reviews/:reviewId/vote", async (req, res) => { // HANDLES THE ENTIRE VOTE ACTION PROCESS
    try {
        const { id, reviewId } = req.params;
        const { voteType } = req.body; // Upvote or Downvote
        const userId = req.session.user._id;

        const review = await Review.findOne({ reviewId: reviewId }); // Gets the chosen review.

        if (!review) {
            return res.status(404).send("Review not found");
        }

        const alreadyUpvoted = review.reviewUpvoteUsers.includes(userId); // Gets list of review's already upvoted users.
        const alreadyDownvoted = review.reviewDownvoteUsers.includes(userId); // Gets list of review's already downvoted users.
        
        let previousVoteStatus = alreadyUpvoted ? 'upvote' : (alreadyDownvoted ? 'downvote' : null); // NOTE: SUPPOSED TO BE FOR VOTE REMOVAL. DOESN'T WORK, MIGHT FIX BUT IT IS A NON-ISSUE.
        let currentVoteStatus = voteType;

        if (voteType === 'upvote') { // If the user has upvoted the review...
            if (alreadyUpvoted) { //... and has already upvoted the review previously...
                
                review.reviewUpvotes--; // ... remove the upvote...
                review.reviewUpvoteUsers = review.reviewUpvoteUsers.filter(id => id.toString() !== userId.toString());
                currentVoteStatus = null; // ... and reset the vote status.
            } else { // If the user hasn't upvoted yet...
                
                review.reviewUpvotes++; // ... add the upvote...
                review.reviewUpvoteUsers.push(userId); // ... adds the user to the list of upvoting users.
                if (alreadyDownvoted) {
                    // Remove downvote if exists
                    review.reviewDownvotes--;
                    review.reviewDownvoteUsers = review.reviewDownvoteUsers.filter(id => id.toString() !== userId.toString());
                }
            }
        } else if (voteType === 'downvote') { // If the user has downvoted the review...
            if (alreadyDownvoted) { //... and has already downvoted the review previously...

                review.reviewDownvotes--; // ... remove the downvote...
                review.reviewDownvoteUsers = review.reviewDownvoteUsers.filter(id => id.toString() !== userId.toString());
                currentVoteStatus = null; // ... and reset the vote status.
            } else { // If the user hasn't downvoted yet...

                review.reviewDownvotes++; // ... add the downvote...
                review.reviewDownvoteUsers.push(userId); // ... adds the user to the list of downvoting users.
                if (alreadyUpvoted) {
                    // Remove upvote if exists
                    review.reviewUpvotes--;
                    review.reviewUpvoteUsers = review.reviewUpvoteUsers.filter(id => id.toString() !== userId.toString());
                }
            }
        }

        await review.save();
        res.status(200).json({ 
            upvotes: review.reviewUpvotes, 
            downvotes: review.reviewDownvotes,
            userVoteStatus: currentVoteStatus,
            previousVoteStatus: previousVoteStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// RENZO ADDITION END.

module.exports = router;