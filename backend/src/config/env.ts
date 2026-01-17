import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

interface EnvironmentConfiguration {
  nodeEnv: string;
  port: number;
  baseURL: string;

  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };

  redis: {
    host: string;
    port: number;
  };

  jwt: {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
  };

  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  cors: {
    origin: string;
  };

  app: {
    defaultUrlExpiryDays: number;
    shortCodeLength: number;
  };
}

const Configuration: EnvironmentConfiguration = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  baseURL: process.env.BASE_URL || "http://localhost:3000",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "url_shortener",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || "super-secret-key",
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions['expiresIn'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  app: {
    defaultUrlExpiryDays: parseInt(process.env.DEFAULT_URL_EXPIRY_DAYS || "365", 10),
    shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || "6", 10),
  },
};

export default Configuration;
