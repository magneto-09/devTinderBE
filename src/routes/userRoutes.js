const express = require("express");

const router = express.Router();

const {
  signupController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteController,
} = require("../controllers/user-auth/userAuthController");

const {
  newAccessTokenController,
} = require("../controllers/user-auth/generateNewAccessTokenController");
const { jwtAuth } = require("../middlewares/jwtAuthMiddleware");

// signup API -> POST
router.post("/signup", signupController);

// login API --> POST -> need email & password
router.post("/login", loginController);

// new access token generate API -> GET
router.get("/newAccessToken", newAccessTokenController); // will automate the call of this in FE

// ----------- PROTECTED ROUTES ----------------------------------------

// get profile
router.get("/profile", jwtAuth, getProfileController);

// update profile API --> PATCH --> will allow fields to update except email, age, gender.
router.patch("/profile", jwtAuth, updateProfileController);

// delete profile API -> DELETE
router.delete("/profile", jwtAuth, deleteController);

module.exports = {
  router,
};
