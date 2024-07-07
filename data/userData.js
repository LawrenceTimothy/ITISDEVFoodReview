const mongoose = require("mongoose");

// Temporary user data with bare minimum fields.
const testData = [
    {
        _id: new mongoose.Types.ObjectId("60b9e4b3d3b3f3b3b3b3b3b3"),
        username: 'user1',
        password: 'password1',
    },
    {
        _id: new mongoose.Types.ObjectId("60b9e4b3d3b3f3b3b3b3b3b4"),
        username: 'user2',
        password: 'password2',
    },
    {
        _id: new mongoose.Types.ObjectId("60b9e4b3d3b3f3b3b3b3b3b5"),
        username: 'user3',
        password: 'password3',
    },
    // Add more users as needed
];

module.exports = testData;