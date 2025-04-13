require("colors");
const { userModel: User } = require("../models/user");
const {
  authSignupValidation,
  authUpdateProfileValidation,
  authDeleteProfileValidation,
} = require("../helpers/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

// signUp controller - POST
const signupController = async (req, res, next) => {
  try {
    const dataObj = req.body; // raw JSON parsed into JS object by expres.json() present in app.js file.

    authSignupValidation(dataObj); // checks API level checks

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

    if (!validator?.isEmail(email)) throw new Error("Invalid Credentials.");

    const ifExists = await User?.findOne({ email }); // returns document if exists else undefined

    if (!ifExists) throw new Error("Invalid Credentials");
    else {
      const isMatched = await bcrypt?.compare(password, ifExists?.password);

      if (!isMatched) throw new Error("Invalid Credentials.");
      else
        return res.status(200).json({
          message: "Logging In",
          user: ifExists,
        });
    }
  } catch (error) {
    next(error);
  }
};

// updateController - PATCH --> possibility -> user will update few allowed fields only at a time.
const updateProfileController = async (req, res, next) => {
  try {
    const { email } = req.params;
    let receivedDataObj = req.body;

    authUpdateProfileValidation(receivedDataObj, req.params); // API level checks are perfomed for both

    const ifExists = await User?.findOne({ email });

    if (!ifExists) throw new Error("User not found.");
    else {
      // again hash the password & bypass if exists in receivedDataObj
      const { password, byPass } = receivedDataObj;

      let newHashedPassword, newHashedBypass;
      if ("password" in receivedDataObj) {
        newHashedPassword = await bcrypt?.hash(password, 10);
        receivedDataObj = { ...receivedDataObj, password: newHashedPassword };
      }

      if ("byPass" in receivedDataObj) {
        newHashedBypass = await bcrypt.hash(byPass, 10);
        receivedDataObj = { ...receivedDataObj, byPass: newHashedBypass };
      }

      const updatedUser = await User?.findOneAndUpdate(
        { email },
        receivedDataObj,
        {
          runValidators: true,
          new: true, // returns updated document
        }
      );

      return res.status(200).json({
        message: "Data Updated Successfully.",
        updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// deleteController - DELETE - logic password, byPass should match before deleting.
const deleteController = async (req, res, next) => {
  try {
    const { email, byPass, password } = req.query;

    authDeleteProfileValidation(req.query); // API level validation & sanitization checks.

    const ifExists = await User?.findOne({ email }); // returns a document

    if (!ifExists) throw new Error("Delete operation failed.");
    else {
      const isPasswordMatched = await bcrypt?.compare(
        password,
        ifExists?.password
      );
      const isBypassMatched = await bcrypt?.compare(byPass, ifExists?.byPass);

      if (!isPasswordMatched || !isBypassMatched)
        throw new Error("Delete operation failed.");
      else {
        const deletedUser = await User?.findOneAndDelete({ email });

        return res.status(200).json({
          message: "User deleted successfully",
          deletedUser,
        });
      }
    }
  } catch (error) {
    next(error); // default error middleware
  }
};

module.exports = {
  signupController,
  loginController,
  updateProfileController,
  deleteController,
};
