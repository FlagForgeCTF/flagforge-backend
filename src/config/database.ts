import mongoose from "mongoose";
import { config } from "../utils/config";
import Redis from "ioredis";

const dbURL = config.MONGODB_URL;
const redis = new Redis({
  host: process.env.REDIS_HOST ,
  port: Number(process.env.REDIS_PORT) ,
});

if (!dbURL) {
  throw new Error("MONGO_URL is not defined in the .env file");
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const connectRedis = async () => {
  try {
    redis.on("connect", () => {
      console.log("Connected to Redis");
    });

    redis.on("error", (error) => {
      console.error("Redis Connection Error:", error);
    });
  } catch (error) {
    console.error("Error initializing Redis:", error);
    throw error;
  }
};

export { connectDB, connectRedis, redis };
