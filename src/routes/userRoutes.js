const express = require("express");

const router = express.Router();

const {
  signupController,
  loginController,
  updateProfileController,
  deleteController,
} = require("../controllers/userAuthController");

// signup API -> POST
router.post("/signup", signupController);

// login API --> POST -> need email & password
router.post("/login", loginController);

// update profile API --> PATCH --> will allow fields to update except email, age, gender.
router.patch("/profile/:email", updateProfileController);

// delete profile API -> DELETE
router.delete("/profile", deleteController);

module.exports = {
  router,
};
