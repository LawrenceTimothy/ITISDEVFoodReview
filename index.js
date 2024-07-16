<<<<<<< Updated upstream
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Adjust path to db.js in src/config
const profileRoutes = require('./profile/src/routes/profile'); // Adjust path to profile.js in src/routes
const foodsRouter = require('./viewFoods/src/routes/foods');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Handlebars setup
// Example using Handlebars (hbs) view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'profile', 'src', 'views') }));
app.set('view engine', 'hbs');

// Set the views directories for both modules
// Adjust paths based on your project structure
app.set('views', [
    path.join(__dirname, 'profile', 'src', 'views'),
    path.join(__dirname, 'viewFoods', 'src', 'views')
]);

// Authentication middleware for demo purposes
//app.use((req, res, next) => {
// For demonstration, set req.user to a static user
// req.user = { username: 'testuser' }; // Replace with actual authentication logic
// next();
//});

// Routes
app.use('/profile', profileRoutes);
app.use('/foods', foodsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
=======
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
>>>>>>> Stashed changes
