var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
    reviewId : {
        type: String,
        required: true,
        unique: true
    },
    reviewUser: { // To store user's name. NOTE: COMMENTED THIS BECAUSE THERE'S STILL NO WAY TO TRACK THE USER
        type: String,
        required: true
    },
    /*userAvatar: { // to be used for the avatar of the user.
        type: String,
        required: false
    },*/
    reviewSubject: {
        type: String,
        required: true
    },
    reviewBody: {
        type: String,
        required: true
    },
    reviewDate: {
        type: Object,
        required: true
    },
    foodName: {
        type: String,
        required: false
    },
    reviewVerdict:{
        type: Boolean,
        required: true
    },
    reviewUpvotes: {
        type: Number,
        required: false
    },
    reviewDownvotes: {
        type: Number,
        required: false
    },
    /*reviewUpvoteUsers: [{ // Tracks if user has already upvoted
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // references user collection
    }],
    reviewDownvoteUsers: [{ // Tracks if user has already downvoted
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // references user collection
    }],*/
});

module.exports = mongoose.model ('Review', ReviewSchema);