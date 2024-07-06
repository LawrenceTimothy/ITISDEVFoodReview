const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const testData = [
  {
    reviewId: "123e4567-e89b-12d3-a456-426614174001",
    reviewUser: new mongoose.Types.ObjectId("6680cabd97896c499c87baf3"),
    reviewSubject: 'Review Subject 1',
    reviewBody: 'Review Body 1',
    reviewDate: new Date(),
    food: new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b3'),
    isUpvote: true,
    reviewUpvotes: 0,
    reviewDownvotes: 0,
    reviewUpvoteUsers: [],
    reviewDownvoteUsers: []
  },
  {
    reviewId: '123e4567-e89b-12d3-a456-426614174000',
    reviewUser: new mongoose.Types.ObjectId("6680cabd97896c499c87baf3"),
    reviewSubject: 'Review Subject 2',
    reviewBody: 'Review Body 2',
    reviewDate: new Date(),
    food: new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b4'),
    isUpvote: false,
    reviewUpvotes: 0,
    reviewDownvotes: 0,
    reviewUpvoteUsers: [],
    reviewDownvoteUsers: []
  },
  // Add more reviews as needed
];

module.exports = testData;