const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const session = require("express-session")
const collection = require("./mongodb")
const exphbs = require("express-handlebars")

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

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
