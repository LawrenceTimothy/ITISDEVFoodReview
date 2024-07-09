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
