const JWT = require("jsonwebtoken");

// generate new access token with 15 min exp after validating the refreshToken stored in httpOnly cookie
// and, present in user's browser.
const newAccessTokenController = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies; // need cookieParser

    if (!refreshToken) throw new Error("Token Not Valid."); // if authCookie is cleared.

    const decodedObj = JWT?.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET
    );

    const payload = {
      _id: decodedObj?._id,
    };

    const newAccessToken = JWT?.sign(
      payload,
      process.env.ACCESS_TOKEN_JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      message: "New accessToken Generated.",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newAccessTokenController,
};
