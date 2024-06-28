const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const session = require("express-session")
const collection = require("./mongodb")
const exphbs = require("express-handlebars")
const Review = require('../models/reviewmodel.js') // RENZO: references review model
const { v4: uuidv4 } = require('uuid'); // RENZO: FOR REVIEW ID GENERATION

const templatePath = path.join(__dirname, "../views")

// Session Handling
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});


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

app.get("/", (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user.username })
    } else {
        res.render("login")
    }
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    const data = {
        username: req.body.name,
        password: req.body.password
    }

    await collection.insertMany([data])

    req.session.user = data;
    res.render("home", { user: req.body.name })
})

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

// Review posting functionalityyt
app.post('/submitReview', (req, res) => {
    try {
        let reviewDate = new Date();
        const reviewData = new Review ({
            reviewId : uuidv4(), // Unique identifier for the review
            //reviewUser: req.user.reviewUser, // User's name. 
            reviewSubject: req.body.reviewSubject, // Title of the review.
            reviewDate: reviewDate, // Date of the review
            reviewBody: req.body.reviewBody, // Body of the review.
            foodName: req.body.foodName,// Food that was reviewed.
            reviewUpvotes: req.body.reviewUpvotes, // Number of upvotes.
            reviewDownvotes: req.body.reviewDownvotes, // Number of downvotes.
    });
      reviewData.save(); 
      console.log(reviewData); // logs into the console for testing
      res.redirect('/foodtest'); // redirect to foodtest
    } catch (e) {
        console.log(e);
        //console.log(reviewData);
    res.redirect('/foodtest'); // redirect to foodtest
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
