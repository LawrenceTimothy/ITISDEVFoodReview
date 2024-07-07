const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const userTestData = require("../data/userData.js");

// For reseting the user collection.
router.post("/reset", async (req, res) => {
    await User.deleteMany({});
    for (let i = 0; i < userTestData.length; i++) {
        const user = new User(userTestData[i]);
        await user.save();
    }
    res.send(userTestData);
});

module.exports = router;