import express, { Application, Request, Response } from "express";
import cors from "cors";

import Configuration from "./config/env.js";
import database from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import routes from './routes/index.js';

const app: Application = express();

app.use(
  cors({
    origin: Configuration.cors.origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "URL Shortener Backend" });
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    const dbHealth = await database.testConnection();

    const health = {
      status: dbHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth ? "up" : "down",
      },
    };

    res.status(dbHealth ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({
      status: "Bad",
      timestamp: new Date().toISOString(),
      error: "Failed",
    });
  }
});

// API routes will be added below:
app.use('/api/v1', routes);

app.use(notFoundHandler);

app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(Configuration.port, () => {
      console.log(`Server running on port ${Configuration.port} in ${Configuration.nodeEnv} mode`);
      console.log(`Base URL: ${Configuration.baseURL}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  try {
    await database.close();

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  gracefulShutdown("UNHANDLED_REJECTION");
});

startServer();

export default app;
