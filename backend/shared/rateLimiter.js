const rateLimit = require("express-rate-limit");
const { logWarning } = require("./logger");

class SharedRateLimiter {
  constructor() {
    // Define rate limit configurations
    this.configs = {
      health: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // 1000 requests per IP per 15 minutes
        message: JSON.stringify({ error: "Too many health check requests" }),
      },
      llm: {
        windowMs: 60 * 60 * 1000, // 60 minutes
        max: 20, // 20 requests per IP per 60 minutes
        message: JSON.stringify({
          res: "Too many requests, please try again later",
        }),
      },
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per IP per 15 minutes (fallback)
        message: JSON.stringify({
          error: "Too many requests, please try again later",
        }),
      },
    };
  }

  getClientIp(req) {
    // Check if request came through Cloudflare
    const cfRay = req.headers["cf-ray"];
    const cfIp = req.headers["cf-connecting-ip"];

    // Only trust Cloudflare headers if cf-ray is present
    // cf-ray is always added by Cloudflare and can't be spoofed from outside
    if (cfRay && cfIp) {
      // Request legitimately came through Cloudflare
      return cfIp;
    }

    // For non-Cloudflare requests or when cf-ray is missing
    // Use the most immediate connection IP to prevent spoofing

    // If there's an x-forwarded-for header, get the LAST IP (most recent proxy)
    // This prevents clients from injecting fake IPs at the beginning
    const forwardedFor = req.headers["x-forwarded-for"];
    if (forwardedFor) {
      const ips = forwardedFor.split(",").map((ip) => ip.trim());
      // Get the last IP in the chain (Render's view of the connection)
      const lastIp = ips[ips.length - 1];
      if (lastIp) {
        return lastIp;
      }
    }

    // Try Render's real IP header
    const realIp = req.headers["x-real-ip"];
    if (realIp) {
      return realIp;
    }

    // Fallback to direct connection
    const directIp =
      req.connection.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection.socket?.remoteAddress;

    // Handle IPv6 localhost
    if (directIp === "::1" || directIp === "::ffff:127.0.0.1") {
      return "127.0.0.1";
    }

    return directIp || "unknown";
  }

  // Helper method to check if request is from Cloudflare
  isCloudflareRequest(req) {
    return !!(req.headers["cf-ray"] && req.headers["cf-connecting-ip"]);
  }

  createLimiter(configName) {
    const config = this.configs[configName];
    if (!config) {
      logWarning(
        `Rate limiter config '${configName}' not found, using general config`
      );
      return this.createLimiter("general");
    }

    return rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      message: config.message,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        const ip = this.getClientIp(req);

        // Development logging
        if (process.env.NODE_ENV === "development") {
          if (this.isCloudflareRequest(req)) {
            logWarning(`Rate limiting Cloudflare IP: ${ip} for ${req.path}`);
          } else {
            logWarning(`Rate limiting direct IP: ${ip} for ${req.path}`);
          }
        }

        // For sensitive endpoints, add additional fingerprinting
        if (configName === "llm") {
          // Include user agent to catch bots changing IPs
          const userAgent = req.headers["user-agent"] || "no-agent";
          const fingerprint = `${ip}|${userAgent.substring(0, 50)}`;
          return fingerprint;
        }

        return ip;
      },
      skip: (req) => {
        // Skip rate limiting for localhost and chrome extensions in development
        if (process.env.NODE_ENV === "development") {
          const ip = this.getClientIp(req);

          // Check for various localhost formats
          if (
            ip === "127.0.0.1" ||
            ip === "::1" ||
            ip === "::ffff:127.0.0.1" ||
            ip === "localhost"
          ) {
            return true;
          }

          // Skip for Docker internal IPs (common ranges)
          if (
            ip.startsWith("172.") || // Docker bridge network
            ip.startsWith("192.168.") || // Docker for Mac/Windows
            ip.startsWith("10.") // Docker swarm
          ) {
            logWarning(`Skipping rate limit for Docker internal IP: ${ip}`);
            return true;
          }

          // Also skip for Chrome extensions in development
          const origin = req.headers.origin;
          if (origin && origin.startsWith("chrome-extension://")) {
            logWarning(`Skipping rate limit for Chrome extension: ${origin}`);
            return true;
          }
        }
        return false;
      },
      handler: (req, res) => {
        // Log rate limit hits with context
        const ip = this.getClientIp(req);
        const isCloudflare = this.isCloudflareRequest(req);

        logWarning(
          `Rate limit exceeded for IP: ${ip} on ${req.path}` +
            ` (via ${isCloudflare ? "Cloudflare" : "Direct access"})`
        );

        // Send the configured error message
        res.status(429).send(config.message);
      },
    });
  }

  // Convenience methods for common limiters
  healthLimiter() {
    return this.createLimiter("health");
  }

  llmLimiter() {
    return this.createLimiter("llm");
  }

  generalLimiter() {
    return this.createLimiter("general");
  }
}

module.exports = SharedRateLimiter;
