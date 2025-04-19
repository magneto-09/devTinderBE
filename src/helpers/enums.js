const loginAllowedFields = ["email", "password"];

const updateProfileAllowedFields = [
  "firstName",
  "lastName",
  "password",
  "byPass",
  "phone",
  "photoURL",
];

module.exports = {
  updateProfileAllowedFields,
  loginAllowedFields,
};
