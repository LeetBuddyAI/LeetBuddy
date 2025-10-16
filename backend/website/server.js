require("dotenv").config({ path: "../../.env" });
const express = require("express");
const compression = require("compression");

// Import shared logger
const { logInfo, logError } = require("../shared/logger");

// Import shared rate limiter
const SharedRateLimiter = require("../shared/rateLimiter");

// Import shared CORS handler
const SharedCorsHandler = require("../shared/cors");

// Import shared middleware
const { createHelmetMiddleware } = require("../shared/security");
const createErrorHandlers = require("../shared/errorHandlers");

// Import controllers
const HealthController = require("./controllers/healthController");

// Import route creators
const createHealthRoutes = require("./routes/healthRoutes");

// === Config ===
const PORT = process.env.PORT || 3001;

// Initialize services
const rateLimiter = new SharedRateLimiter();
const corsHandler = new SharedCorsHandler();

// Initialize controllers
const healthController = new HealthController();

// Initialize error handlers with service-specific config
const { timeoutMiddleware, errorHandlerMiddleware } = createErrorHandlers({
  timeout: 10000, // 10 seconds for website operations
  serviceName: "website-backend",
});

// Initialize Express app
const app = express();

// Apply middleware
app.use(createHelmetMiddleware());
app.set("trust proxy", 1);
app.use(express.json({ limit: "5kb" }));
app.use(compression());
app.use(timeoutMiddleware);

// Register routes with specific rate limits and CORS
app.use(createHealthRoutes(healthController, rateLimiter, corsHandler));

// 404 handler
app.use((req, res, next) => {
  logInfo(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    status: 404,
  });
});

// Error handling
app.use(errorHandlerMiddleware);

// Start server
async function startServer() {
  try {
    // Bind to all interfaces within container (NGINX handles external access)
    app.listen(PORT, "0.0.0.0", () =>
      logInfo(`Website backend running on port ${PORT}`, { important: true })
    );
  } catch (error) {
    logError(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

// Handle process events
process.on("uncaughtException", (err) => {
  logError(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logError("Unhandled rejection:", reason);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logInfo("SIGTERM received. Shutting down...", { important: true });
  process.exit(0);
});

process.on("SIGINT", () => {
  logInfo("SIGINT received. Shutting down...", { important: true });
  process.exit(0);
});

process.on("SIGQUIT", () => {
  logInfo("SIGQUIT received. Shutting down...", { important: true });
  process.exit(0);
});
