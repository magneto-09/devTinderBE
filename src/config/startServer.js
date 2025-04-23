const { connectDB } = require("./mongodb/db");
const { redisAcknowledge: connectRedis } = require("./redis/redisAcknowledge");

const startServer = async () => {
  const data = await Promise?.all([connectDB(), connectRedis()]);
  // if every promise inside Promise.all([]) is resolved then only this will returns a new promise.
  // else an error will be thrown by this method.
  // that is why using an await. and then returning the data. since async is used to again this returned
  // will be wrapped in the promise.

  return data;
};

module.exports = {
  startServer,
};

/*
    🌟 The Whole Idea is:- 
        1 -- Connect your node app with MongoDB at first.
        2 -- Connect your node app with RedisDB via redis Instance.
        3 -- And finally if both are done then make your node app to listen at some PORT NO. 
*/
