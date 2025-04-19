const validator = require("validator");

const {
  updateProfileAllowedFields: UPDATE_ALLOWED_FIELDS,
  loginAllowedFields: LOGIN_ALLOWED_FIELDS,
} = require("./enums");

const authSignupValidation = (dataObj) => {
  const {
    firstName,
    lastName,
    email,
    password,
    byPass,
    phone,
    gender,
    photoURL,
  } = dataObj;

  if (
    !firstName ||
    !validator?.isAlpha(firstName) ||
    !lastName ||
    !validator?.isAlpha(lastName)
  )
    throw new Error("Invalid Name. Please Enter a Valid Name.");

  if (!validator?.isEmail(email))
    throw new Error("Invalid email. Please Enter a Valid Email.");

  if (!validator?.isStrongPassword(password))
    throw new Error("Please enter a strong password.");

  if (!validator?.isAlpha(byPass)) throw new Error("Invalid Hobby.");

  if (
    !validator?.isMobilePhone(phone, "en-IN", {
      strictMode: true,
    })
  )
    throw new Error("Please enter a valid Phone no.");

  if (!validator?.isAlpha(gender)) throw new Error("Invalid Gender.");

  if ("photoURL" in dataObj && !validator?.isURL(photoURL))
    throw new Error("Invalid photo URL.");
  // since, photoURL is optional field, so we've to check if it is coming or not. if yes then check it.
};

const authLoginValidation = (receivedObj) => {
  // user should pass email & password only.
  const isAllowed = Object?.keys(receivedObj)?.every((k) =>
    LOGIN_ALLOWED_FIELDS?.includes(k)
  );

  if (!isAllowed) throw new Error("Invalid Credentials.");

  // make sure user is not passing empty json.
  if (Object?.keys(receivedObj)?.length === 0)
    throw new Error("Invalid Credentials.");

  if (!validator?.isEmail(receivedObj?.email))
    throw new Error("Invalid Credentials.");

  if (!validator?.isStrongPassword(receivedObj?.password))
    throw new Error("Invalid Credentials.");
};

const authUpdateProfileValidation = (receivedObj) => {
  // receivedObj --> if no fields are given by the user. hence, no keys
  if (Object?.keys(receivedObj)?.length === 0)
    throw new Error("Add required fileds to update.");

  //  if received obj contain allowed fields only.
  const isAllowed = Object?.keys(receivedObj)?.every((k) =>
    UPDATE_ALLOWED_FIELDS?.includes(k)
  );

  if (!isAllowed) throw new Error("Update Not Allowed.");
  else {
    // means user has sent the allowed fields. again API level validation
    const { firstName, lastName, password, byPass, phone, photoURL } =
      receivedObj;

    if (
      "firstName" in receivedObj &&
      (!firstName || !validator?.isAlpha(firstName))
    )
      throw new Error("Invalid Name. Please Enter a Valid Name.");

    if (
      "lastName" in receivedObj &&
      (!lastName || !validator?.isAlpha(lastName))
    )
      throw new Error("Invalid Name. Please Enter a Valid Name.");

    if ("password" in receivedObj && !validator?.isStrongPassword(password))
      throw new Error("Please enter a strong password.");

    if ("byPass" in receivedObj && !validator?.isAlpha(byPass))
      throw new Error("Invalid Hobby.");

    if (
      "phone" in receivedObj &&
      !validator?.isMobilePhone(phone, "en-IN", {
        strictMode: true,
      })
    )
      throw new Error("Please enter a valid Phone no.");

    if ("photoURL" in receivedObj && !validator?.isURL(photoURL))
      throw new Error("Invalid Image URL.");
  }
};

module.exports = {
  authSignupValidation,
  authLoginValidation,
  authUpdateProfileValidation,
};
