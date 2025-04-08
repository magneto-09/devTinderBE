const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    }, 
    middleName:{
        type:String
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true, 
    },
    byPass:{
        type:String,
        required:true,  // security question Answer for password updatation. 
    },
    phone:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
})

const userModel = mongoose.model('user', userSchema); // JS wrapper around schema. Constructor

module.exports = {
    userModel
}