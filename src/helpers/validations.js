const validator = require("validator");

const { updateProfileAllowedFields: ALLOWED_FIELDS } = require("./enums");

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

const authUpdateProfileValidation = (receivedObj, receivedQueryParams) => {
  const { email } = receivedQueryParams;
  if (!validator?.isEmail(email)) throw new Error("Invalid Email.");

  // receivedObj --> if no fields are given by the user. hence, no keys
  if (Object?.keys(receivedObj)?.length === 0)
    throw new Error("Add required fileds to update.");

  //  if received obj contain allowed fields only.
  const isAllowed = Object?.keys(receivedObj)?.every((k) =>
    ALLOWED_FIELDS?.includes(k)
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

const authDeleteProfileValidation = (deleteQueryParams) => {
  const { email, byPass, password } = deleteQueryParams;

  // checks if deleteQueryParams is not empty. now although if it is empty then it'll found
  // when fineOne() funcn will run. but it's better to catch it in API level.
  if (Object?.keys(deleteQueryParams)?.length === 0)
    throw new Error("Delete operation failed.");

  // protecting from data leaking
  if (!validator?.isEmail(email)) throw new Error("Delete operation failed.");

  if (!validator?.isAlpha(byPass)) throw new Error("Delete operation failed.");

  if (!validator?.isStrongPassword(password))
    throw new Error("Delete operation failed."); // checking for valid password
  // this is for the case where someone is giving password of less than 8 char or not adding 1 alphabet,
  // and other checks of validator.
};

module.exports = {
  authSignupValidation,
  authUpdateProfileValidation,
  authDeleteProfileValidation,
};
