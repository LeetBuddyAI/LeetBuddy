const cors = require("cors");
const { logWarning } = require("./logger");

/**
 * Shared CORS Handler for LeetBuddy backends
 *
 * CORS Policies:
 * - open: Allow all origins (public endpoints)
 * - extensionOnly: Only allow Chrome extension origin
 */
class SharedCorsHandler {
  constructor() {
    // Define CORS configurations
    this.configs = {
      // Allow all origins - for public endpoints
      open: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Requested-With"],
        credentials: false,
      },

      // Extension-only - for protected LLM endpoints
      extensionOnly: (allowedOrigin) => ({
        origin: (origin, callback) => {
          // Allow requests without origin in development (like Postman)
          if (!origin && process.env.NODE_ENV === "development") {
            return callback(null, true);
          }

          // In development, allow any Chrome extension
          if (
            process.env.NODE_ENV === "development" &&
            origin &&
            origin.startsWith("chrome-extension://")
          ) {
            logWarning(`Allowing dev Chrome extension: ${origin}`);
            return callback(null, true);
          }

          // Check if origin matches allowed extension origin
          if (origin === allowedOrigin) {
            return callback(null, true);
          }

          // Log and reject other origins
          logWarning(
            `CORS rejected origin: ${origin} (expected: ${allowedOrigin})`
          );
          callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Requested-With"],
      }),
    };
  }

  // Get CORS middleware for a specific configuration
  getCorsMiddleware(configName, options = {}) {
    const config = this.configs[configName];
    if (!config) {
      logWarning(
        `CORS config '${configName}' not found, using 'open' as fallback`
      );
      return cors(this.configs.open);
    }

    // Handle function configs (like extensionOnly)
    if (typeof config === "function") {
      return cors(config(options.allowedOrigin));
    }

    return cors(config);
  }

  // Convenience methods
  openCors() {
    return this.getCorsMiddleware("open");
  }

  extensionOnly(allowedOrigin) {
    return this.getCorsMiddleware("extensionOnly", { allowedOrigin });
  }
}

module.exports = SharedCorsHandler;
