const mongoose = require('mongoose'); 

// didn't use curly braces hence we're literally returning the promiseData explicitly. 
const connectDB = async() => await mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    connectDB
}