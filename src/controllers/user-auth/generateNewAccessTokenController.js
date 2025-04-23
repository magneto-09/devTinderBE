const JWT = require("jsonwebtoken");

const { connectRedisClient } = require("../../config/redis/redisClient");

// generate new access token with 15 min exp after validating the refreshToken stored in httpOnly cookie
// and, present in user's browser.
const newAccessTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies; // need cookieParser

    if (!refreshToken) throw new Error("Token Not Valid."); // if authCookie is cleared.

    // validating the refreshToken
    const decodedObj = JWT?.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET
    );

    // after this we'll get the _id in the decodedObj.
    // but we've to check if this refreshToken is blacklisted or something.
    // so basically whole idea is :-
    // if user have logged out then remove the token from redisDB. OR,
    // if it expires then it'll automatically will be deleted from redisDB.
    // Both equally means we've blacklisted it.
    // If not blacklisted (then it'll still present in redisDB).
    // Hence, then only allow the user to generate new Access Token.  🚀🚀🚀

    const redisClient = connectRedisClient();
    const ifTokenExistsInRedis = await redisClient.exists(
      `refreshToken:UserID:${decodedObj?._id}`
    );

    if (!ifTokenExistsInRedis)
      throw new Error("Please Login Again. Token Blacklisted.");

    // start generating new access token
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
