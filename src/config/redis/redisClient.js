const Redis = require("ioredis");

const connectRedisClient = () => {
  const client = new Redis(process.env.REDIS_URI);
  // creating redis client that'll instantiate the connection.
  // but it'll take some time to conenct with redisDB and become ready to use.
  // by look it feels that connection will happen instantly but no!!!

  return client;
};

module.exports = {
  connectRedisClient,
};
