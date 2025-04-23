const { connectRedisClient } = require("./redisClient"); // this is the place when it get called for
// first time.
// so next time when this module will get called to do some op then due to caching, redisClient
// will already ready to do your Job.

const redisAcknowledge = () => {
  const redisClient = connectRedisClient(); // when this funcn called then a redisInstance will be
  // created and a connection will start to connect with redisDB.

  return new Promise((resolve, reject) => {
    redisClient.on("ready", () => resolve(redisClient));
    redisClient.on("error", (err) => reject(err));
  });
};

module.exports = {
  redisAcknowledge,
};
