const { mongoose } = require("mongoose");

// Temporary food data.
const testData = [
    {
        _id:new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b3'),
        name: 'Pizza',
        pictureUrl: 'http://example.com/pizza.jpg',
        overallRating: 4.5,
        description: 'Delicious pizza with mozzarella and tomato',
        ingredients: ['Dough', 'Tomato', 'Mozzarella'],
        calorieCount: 800,
        bestPartneredWith: 'Coke'
    },
    {
        _id: new mongoose.Types.ObjectId('60b9e4b3d3b3f3b3b3b3b3b4'),
        name: 'Burger',
        pictureUrl: 'http://example.com/burger.jpg',
        overallRating: 4.2,
        description: 'Juicy burger with lettuce and tomato',
        ingredients: ['Bun', 'Beef', 'Lettuce', 'Tomato'],
        calorieCount: 600,
        bestPartneredWith: 'Fries'
    }
    // Add more test data as needed
];

module.exports = testData;