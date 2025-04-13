const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "Min. length should be 3. Received {VALUE}"],
      maxLength: [25, "Max. Allowed Length is 25. Received {VALUE}"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Min. length should be 3. Received {VALUE}"],
      maxLength: [25, "Max. Allowed Length is 25. Received {VALUE}"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be of 8 characters atleast!!!!!"],
    },
    byPass: {
      type: String,
      required: true, // security question's Answer for password updatation. Question -> Hobby
      minLength: [3],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Invalid Phone No.!!!"],
      maxLength: [13, "Invalid Phone No.!!!"], // +919123118239
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["Male", "Female", "Others"],
      // in frontend, gender will be dropdown. still we're adding the enums. BE should be secured.
    },
    photoURL: {
      type: String,
      trim: true,
      default: function () {
        if (this?.gender === "Male")
          return "https://res.cloudinary.com/do5v3ss5j/image/upload/v1744469169/Male_vjshxu.png";
        else if (this?.gender === "Female")
          return "https://res.cloudinary.com/do5v3ss5j/image/upload/v1744469169/Female_vbr7fa.jpg";
        else
          return "https://res.cloudinary.com/do5v3ss5j/image/upload/v1744469169/Others_tyisa2.png";
      },
    },
  },
  {
    timestamps: true,
    // by default --> strict:true -> it doesn't allow fields not present in schema.
  }
);

const userModel = mongoose.model("user", userSchema); // JS wrapper around schema. Constructor

module.exports = {
  userModel,
};
