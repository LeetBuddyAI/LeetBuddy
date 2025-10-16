const { logError, logFatal } = require("./logger");

/**
 * Shared Error Handlers for LeetBuddy backends
 *
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Request timeout in milliseconds (default: 30000)
 * @param {string} options.serviceName - Service name for logging context
 */
const createErrorHandlers = (options = {}) => {
  const { timeout = 30000, serviceName = "unknown" } = options;

  const timeoutMiddleware = (req, res, next) => {
    // Skip timeout for SSE endpoints
    if (req.path === "/LLM" && req.method === "POST") {
      next();
      return;
    }

    res.setTimeout(timeout, () => {
      const message = `Request timeout (${timeout}ms)`;
      logError(`[${serviceName}] ${message}`, { path: req.path });
      res.status(408).json({ error: message });
    });
    next();
  };

  const errorHandlerMiddleware = (err, req, res, next) => {
    const logFn = serviceName === "website-backend" ? logFatal : logError;
    logFn(`[${serviceName}] Unhandled error: ${err.message}`, {
      path: req.path,
      method: req.method,
      stack: err.stack,
    });

    // Don't leak error details in production
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message;

    res.status(err.status || 500).json({ error: message });
  };

  return {
    timeoutMiddleware,
    errorHandlerMiddleware,
  };
};

module.exports = createErrorHandlers;
