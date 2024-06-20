const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/FoodReviewTesting")
.then(()=>{
    console.log("Connection to MongoDB is successful");
})
.catch(()=>{
    console.log("Connection to MongoDB failed");
})

const LogInSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const collection = new mongoose.model("LogInCollection", LogInSchema)

module.exports = collection