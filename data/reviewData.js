const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const testData = [
  {
    reviewId: "123e4567-e89b-12d3-a456-426614174001",
    reviewUser: new mongoose.Types.ObjectId("60b9e4b3d3b3f3b3b3b3b3b3"),
    reviewSubject: 'Review Subject 1',
    reviewBody: 'Review Body 1',
    reviewDate: new Date(),
    foodId: new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b3'),
    reviewUpvotes: 0,
    reviewDownvotes: 0,
    reviewUpvoteUsers: [],
    reviewDownvoteUsers: []
  },
  {
    reviewId: '123e4567-e89b-12d3-a456-426614174000',
    reviewUser: new mongoose.Types.ObjectId("60b9e4b3d3b3f3b3b3b3b3b3"),
    reviewSubject: 'Review Subject 2',
    reviewBody: 'Review Body 2',
    reviewDate: new Date(),
    foodId: new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b4'),
    reviewUpvotes: 0,
    reviewDownvotes: 0,
    reviewUpvoteUsers: [],
    reviewDownvoteUsers: []
  },
  // Add more reviews as needed
];

module.exports = testData;