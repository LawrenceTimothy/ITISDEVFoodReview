const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const bodyParser = require('body-parser');
const connectDB = require('../config/db.js');
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
const profileRoutes = require('../routes/profileRoutes'); 
const viewfoodsRoutes = require('../routes/viewfoodsRoutes');
const mealsRoutes = require('../routes/mealsRoutes');
const mealsOfTheWeekRoutes = require('../routes/mealsOfTheWeekRoutes');
const pollsRoutes = require('../routes/pollRoutes');
const homeRoutes = require('../routes/homeRoutes');

const templatePath = path.join(__dirname, "../views")
connectDB();

// Session Handling
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});

// Middlewares
app.use(express.json())
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
app.use('/profile', profileRoutes);
app.use('/viewfood', viewfoodsRoutes);
app.use('/meals', mealsRoutes);
app.use('/meals-of-the-week', mealsOfTheWeekRoutes);
app.use('/polls', pollsRoutes);
app.use('/home', homeRoutes);

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
        res.status(200).json({
            message: "Your review has been successfully posted!",
            review: reviewData
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Failed to post review. Please try again.",
            error: e.message
        });
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

// RENZO: hbs helper for showing upvote/downvote result.
hbs.registerHelper('subtract', function(a, b) { 
    return a - b;
});