import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "";
const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("Connected to Redis");
});
redis.on("error", (err) => {
  console.error("Redis error:", err);
});


export default redis;
