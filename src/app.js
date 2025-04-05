const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db')
require('colors'); // for colorful clg(s)

const app = express();

dotenv.config(); // loads all environment Variables


// routes
const { userModel: User } = require('./models/user');

app.post('/signup', async (_, res, next) => {
    const userObj = {
        firstName: 'Piyush',
        lastName: 'Sharma',
        email: 'spiyush1721@gmail.com',
        phone: 9123118239,
        age: 23
    }

    const newUser = new User(userObj); //instance of model --> document

    try {
        await newUser.save();
        console.log('User added successfully'.bgGreen.white)
        res.status(200).send(JSON.stringify(userObj));
    } catch (error) {
        console.log(`Error occured. ${error}`.bgRed.yellow)
        next(error);
    }
})


// Home route to indicate server is working perfectly fine. 
app.get('/', (_, res) => res.send('<h1>devTinder Server is up & running.</h1>'))

const PORT = process.env.PORT || 7777

// Always connect your nodeApp with DB at first then make your nodeApp to listen at PORT NO. 
connectDB().then(
    (connData) => {
        // using optional chaining
        console.log(`Connected to mongoDB database ${connData?.connection?.host}`.bgMagenta.white);

        app.listen(PORT, () => console.log(`Server started listening at PORT No. ${PORT}`.bgWhite.black))
    }
)
    .catch(
        (e) => console.log(`Failed to connect to DB. ${e}`.bgRed.yellow)
    )

