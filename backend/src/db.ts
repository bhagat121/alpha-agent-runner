import { Pool } from "pg";
import Redis from "ioredis";

export const pg = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables.");
}

export const redis = new Redis(redisUrl); // Now always a string
