var mongoose = require('mongoose');
var userCollectionName = "logincollections";

var ReviewSchema = new mongoose.Schema({
    reviewId : {
        type: String,
        required: true,
        unique: true
    },
    reviewUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userCollectionName,    // TODO: To update with actual user collection.
        required: true
    },
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
        default: new Date()
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    isUpvote: {
        type: Boolean,
        required: true
    },
    reviewVerdict:{
        type: Boolean,
        required: true
    },
    reviewUpvotes: {
        type: Number,
        required: false,
        default: 0
    },
    reviewDownvotes: {
        type: Number,
        required: false,
        default: 0,
    },
    reviewUpvoteUsers: { // Tracks if user has already upvoted
        type: [mongoose.Schema.Types.ObjectId],
        ref: userCollectionName, // references user collection
        default: []
    },
    reviewDownvoteUsers: { // Tracks if user has already downvoted
        type: [mongoose.Schema.Types.ObjectId],
        ref: userCollectionName, // references user collection
        default: []
    },
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;