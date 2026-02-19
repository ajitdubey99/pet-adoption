/**
 * @fileoverview Express server entry point.
 * Mounts middleware, routes, error handlers. Handles graceful shutdown.
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const config = require("./config/config");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

if (!fs.existsSync(config.upload.path)) fs.mkdirSync(config.upload.path, { recursive: true });

app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.server.env === "development") app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, config.upload.path)));
app.get("/api/health", (req, res) => res.json({ success: true, message: "API running." }));
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();
  const server = app.listen(config.server.port, () =>
    console.log(`Server running on port ${config.server.port} [${config.server.env}]`)
  );
  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => { await disconnectDatabase(); process.exit(0); });
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
module.exports = app;
