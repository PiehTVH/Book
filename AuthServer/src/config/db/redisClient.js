const redis = require("redis");

// Configure Redis client connection
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
console.log("Redis Host:", host);
console.log("Redis Port:", port);
const redisClient = redis.createClient({
  url: `redis://${host}:${port}`,
  // include other options if necessary, like password, TLS, etc.
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Function to connect Redis
async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis client connected successfully");
  } catch (err) {
    console.error("Failed to connect to Redis", err);
    process.exit(1); // Exit in case of connection failure
  }
}

module.exports = { redisClient, connectRedis };
