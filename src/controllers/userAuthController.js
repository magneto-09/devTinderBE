require('colors')
const { userModel: User } = require('../models/user')


// signUp controller - POST
const signupController = async (req, res, next) => {
    const dataObj = req.body; // raw JSON parsed into JS object by expres.json() present in app.js file.

    const newUser = new User(dataObj); // instance of model --> document

    try {
        await newUser?.save();
        res.status(200).send(JSON?.stringify(dataObj));
        console.log('Account created successfully'.bgGreen.white)
    } catch (error) {
        console.log(`Error occured. ${error}`.bgRed.yellow)
        next(error); // default error middleware
    }
}

// login controller - GET
const loginController = async (req, res, next) => {
    const { email, password } = req.query;

    try {
        const ifExists = await User?.findOne({ email }); // returns document if exists. email -> unique

        if (ifExists) {
            if (password === ifExists.password) {
                console.log(`Login Successful`.bgGreen.white);
                res.status(200).send(`Login Successful. ${JSON.stringify(ifExists)}`);
            }
            else {
                console.log('Incorrect Password'.bgRed.white);
                res.status(401).send('Incorrect Password!!!!!')
            }
        } else {
            console.log('Account Not Found!!!'.bgRed.yellow);
            res.status(400).send('Account Not Found. Create account first!!!!')
        }

    } catch (error) {
        console.log(`Error occured. ${error}`.bgRed.yellow)
        next(error); // default error middleware
    }
}


// updateController - PATCH
const updateController = async (req, res, next) => {

    const { email, securityAns, newPassword } = req.body;

    try {

        const ifExists = await User?.findOne(); 

        if(ifExists && securityAns===ifExists.byPass) {
            await User?.updateOne({email}, {password : newPassword});

            console.log('Password Updated Successfully'.bgGreen.white);
            res.status(200).send('Password Updated Successfully'); 
        }
        else {
            console.log('Something went wrong'.bgRed.white);
            res.status(404).send('Something went wrong!!!!!!')
        }

    } catch (error) {
        console.log(`Error occured. ${error}`.bgRed.yellow)
        next(error); // default error middleware
    }

}


// deleteController - DELETE
const deleteController = async(req, res, next) => {
    const {email} = req.query; 

    try {
       await User.deleteOne({email}); 
       console.log('User Deleted'.bgRed.yellow);
       res.status(200).send('User Deleted Successfully!!!!!!!!!!') 
    } catch (error) {
        console.log(`Error occured. ${error}`.bgRed.yellow)
        next(error); // default error middleware
    }
}

module.exports = {
    signupController,
    loginController,
    updateController,
    deleteController
}
