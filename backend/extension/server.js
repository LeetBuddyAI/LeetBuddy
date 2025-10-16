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

// Import services
const LLMService = require("./services/llmService");

// Import controllers
const LLMController = require("./controllers/llmController");
const HealthController = require("./controllers/healthController");

// Import route creators
const createLLMRoutes = require("./routes/llmRoutes");
const createHealthRoutes = require("./routes/healthRoutes");

// === Config ===
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.MODEL || "gemini-2.0-flash";
const INSTRUCTIONS = process.env.INSTRUCTIONS;
const REDIS_URL = process.env.REDIS_URL;
const EXTENSION_ORIGIN = process.env.CHROME_EXTENSION_ORIGIN;
const PORT = process.env.PORT || 3002;

// Environment validation
function validateEnv() {
  const required = ["REDIS_URL", "GEMINI_API_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    logError(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

validateEnv();

// Initialize services
const llmService = new LLMService(
  GEMINI_API_KEY,
  MODEL,
  INSTRUCTIONS,
  REDIS_URL
);
const rateLimiter = new SharedRateLimiter();
const corsHandler = new SharedCorsHandler();

// Initialize controllers
const llmController = new LLMController(llmService);
const healthController = new HealthController();

// Initialize error handlers with service-specific config
const { timeoutMiddleware, errorHandlerMiddleware } = createErrorHandlers({
  timeout: 60000, // 60 seconds for LLM streaming operations
  serviceName: "extension-backend",
});

// Initialize Express app
const app = express();

// Apply middleware
app.use(createHelmetMiddleware());
app.set("trust proxy", 1);
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ limit: "4mb", extended: true }));

// Conditionally apply compression - skip for SSE endpoints
app.use((req, res, next) => {
  if (req.path === "/LLM" && req.method === "POST") {
    // Skip compression for SSE
    next();
  } else {
    compression()(req, res, next);
  }
});

app.use(timeoutMiddleware);

// Register routes with proper CORS and rate limiting
// IMPORTANT: Apply CORS at the route level BEFORE rate limiting
// This ensures OPTIONS preflight requests get proper CORS headers
app.use("/LLM", corsHandler.extensionOnly(EXTENSION_ORIGIN));
app.use("/LLM", rateLimiter.llmLimiter());
app.use("/LLM", createLLMRoutes(llmController));
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

// Start server with Redis connection
async function startServer() {
  try {
    // Ensure Redis is connected before starting
    await llmService.redisService.ensureConnected();

    // Bind to all interfaces within container (NGINX handles external access)
    app.listen(PORT, "0.0.0.0", () =>
      logInfo(`Extension backend running on port ${PORT}`, { important: true })
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

process.on("SIGTERM", async () => {
  logInfo("SIGTERM received. Shutting down...", { important: true });
  try {
    await llmService.cleanup();
  } catch (err) {
    logError(`Error during cleanup: ${err.message}`);
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  logInfo("SIGINT received. Shutting down...", { important: true });
  try {
    await llmService.cleanup();
  } catch (err) {
    logError(`Error during cleanup: ${err.message}`);
  }
  process.exit(0);
});

process.on("SIGQUIT", async () => {
  logInfo("SIGQUIT received. Shutting down...", { important: true });
  try {
    await llmService.cleanup();
  } catch (err) {
    logError(`Error during cleanup: ${err.message}`);
  }
  process.exit(0);
});
