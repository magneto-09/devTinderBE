require("colors");
const { userModel: User } = require("../../models/user");
const {
  authSignupValidation,
  authLoginValidation,
  authUpdateProfileValidation,
} = require("../../helpers/validations");
const bcrypt = require("bcrypt");

// signUp controller - POST
const signupController = async (req, res, next) => {
  try {
    const dataObj = req.body; // raw JSON parsed into JS object by expres.json() present in app.js file.

    authSignupValidation(dataObj); // API level checks

    // hash the password and byPass
    const hashedPassword = await bcrypt?.hash(dataObj?.password, 10);

    const hashedBypass = await bcrypt?.hash(dataObj?.byPass, 10);

    const newUser = new User({
      ...dataObj,
      password: hashedPassword,
      byPass: hashedBypass,
    }); // instance of model -> document

    await newUser?.save();

    return res?.status(200)?.json({
      message: "Data Added Successfully!!!!!!!!",
      newUser,
    });
  } catch (error) {
    next(error); // default error middleware
  }
};

// login controller - POST (cuz, we've to pass email & password)
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    authLoginValidation(req.body); // API level checks.

    const ifUserExists = await User?.findOne({ email }); // returns document if exists else undefined

    if (!ifUserExists) throw new Error("Invalid Credentials");
    else {
      const isMatched = await ifUserExists?.validatePassword(password); // schema methods

      if (!isMatched) throw new Error("Invalid Credentials.");
      else {
        // 2 token strategy (refresh token + access token)
        const accessToken = ifUserExists?.generateAccessToken(); // send it as res
        const refreshToken = ifUserExists?.generateRefreshToken(); // store in httpOnly cookies.

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // cookie will be stored in user's browser but invisible to user.
          path: "/api/v1/auth/newAccessToken",
          maxAge: 24 * 60 * 60 * 1000, // 1d vaildity matching with refreshToken.
        });

        return res.status(200).json({
          message: "Log In Successful",
          accessToken: accessToken,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// ----------------- PROTECTED ROUTES 🚀🚀 ---------------------------------------
const getProfileController = async (req, res, next) => {
  try {
    const userID = req.userID;

    const user = await User?.findById(userID);

    return res.status(200).json({
      "user-profile": user,
    });
  } catch (error) {
    next(error);
  }
};

// updateController - PATCH --> possibility -> user will update few allowed fields only at a time.
const updateProfileController = async (req, res, next) => {
  // jwtAuth is getting called first. so coming to this handler, it means user is authentic.

  try {
    const userID = req.userID;

    let receivedObj = req?.body;
    authUpdateProfileValidation(receivedObj); // API level validation and sanitization

    // if password and byPass update is in the receivedObj then we've to hash it first;
    const { password, byPass } = receivedObj;

    if ("password" in receivedObj) {
      const newHashedPassword = await bcrypt?.hash(password, 10);
      receivedObj = { ...receivedObj, password: newHashedPassword };
    }

    if ("byPass" in receivedObj) {
      const newHashedBypass = await bcrypt?.hash(byPass, 10);
      receivedObj = { ...receivedObj, byPass: newHashedBypass };
    }

    const updatedUser = await User?.findByIdAndUpdate(userID, receivedObj, {
      runValidators: true, // to run DB level validation and sanitization
      new: true,
    });

    return res.status(200).json({
      message: "User Updated Successfully.",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// deleteController - DELETE - logic password, byPass should match before deleting.
const deleteController = async (req, res, next) => {
  try {
    const userID = req.userID;

    const deletedUser = await User?.findByIdAndDelete(userID);

    return res.status(200).json({
      message: "User Deleted.",
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteController,
};
