const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Adjust path to db.js in src/config
const profileRoutes = require('./src/routes/profile'); // Adjust path to profile.js in src/routes
const foodsRouter = require('./src/routes/foods');
const mealsRouter = require('./src/routes/meals');
const pollsRouter = require('./src/routes/poll');
const bookmarksRouter = require('./src/routes/bookmark');
const path = require('path');
const app = express();
const hbs = require('hbs')
const exhbs = require('express-handlebars')
const viewPath = path.join(__dirname, "./src/views")

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Handlebars
app.set('view engine', 'hbs');
app.set('views', viewPath); // Adjust views directory path

// Authentication middleware for demo purposes
app.use((req, res, next) => {
  // For demonstration, set req.user to a static user
  req.user = { username: 'testuser' }; // Replace with actual authentication logic
  next();
});

// Routes
app.use('/profile', profileRoutes);
app.use('/foods', foodsRouter);
app.use('/meals', mealsRouter);
app.use('/polls', pollsRouter);
app.use('/bookmarks', bookmarksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
