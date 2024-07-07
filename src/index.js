const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const session = require("express-session")
const collection = require("./mongodb")
const exphbs = require("express-handlebars")
const fs = require('fs');
const reviewData = require("../data/reviewData.js");
const Review = require('../models/reviewmodel.js') // RENZO: references review model
const { v4: uuidv4 } = require('uuid'); // RENZO: FOR REVIEW ID GENERATION

const foodRoutes = require("../routes/foodRoutes.js");
const userRoutes = require("../routes/userRoutes.js");
const reviewRoutes = require("../routes/reviewRoutes.js");

const templatePath = path.join(__dirname, "../views")

// Session Handling
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});

// Middlewares
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}))

// Routes
app.use("/foods", foodRoutes);
app.use("/users", userRoutes)
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user.username })
    } else {
        res.render("login")
    }
})

// Other routes
app.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});


app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    try {
        const newUser = new collection({
            username: username,
            password: password
        });
        await newUser.save();
        req.session.user = newUser;
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.name })

        if (check && check.password === req.body.password) {
            req.session.user = check; 
            res.render("home", { user: req.body.name })
        } else {
            res.render("login", { error: "Wrong credentials. Please try again." })
        }
    } catch (error) {
        res.render("login", { error: "Invalid login details" })
    }
})

//RENZO TEST 
// Route to food test page
app.get('/foodtest', (req, res) => {
    res.render('foodtest');
  });

app.get('/reviewtest', (req, res) => {
  const { foodId, foodName } = req.query;
  res.render('reviewtest', { foodId, foodName });
});

// Review posting functionality
app.post('/submitReview', async (req, res) => {
    var foodId = req.body.foodId;
    try {
        let reviewDate = new Date();
        const reviewData = new Review ({
            reviewId : uuidv4(), // Unique identifier for the review
            reviewUser: req.session.user._id, // User's name. 
            reviewSubject: req.body.reviewSubject, // Title of the review.
            reviewBody: req.body.reviewBody, // Body of the review.
            isUpvote: req.body.isUpvote, // Upvote status of the review.
            reviewDate: reviewDate, // Date of the review
            food: req.body.foodId,// Food that was reviewed.
        });
        await reviewData.save(); 
        // console.log(reviewData); // logs into the console for testing
        res.status(200).send(reviewData); // sends the review data to the client
    } catch (e) {
        console.log(e);
        console.log(reviewData);
        res.status(400).send(e);
    }
  });


// RENZO TEST END
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
