const JWT = require("jsonwebtoken");

// access token will be passed as BEARER from req. headers authorization and we've to validate it
// and store the _id in req.userID (super safe -> see the nature of req. object)
const jwtAuth = (req, _, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    const accessToken = authHeader?.split(" ")?.[1];

    if (!accessToken) throw new Error("Unauthorized Access.");

    const decodedObj = JWT?.verify(
      accessToken,
      process.env.ACCESS_TOKEN_JWT_SECRET
    );

    const { _id } = decodedObj;

    req.userID = _id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  jwtAuth,
};
