const express = require("express");

function createHealthRoutes(healthController, rateLimiter, corsHandler) {
  const router = express.Router();

  router.get(
    "/health",
    corsHandler.openCors(),
    rateLimiter.healthLimiter(),
    async (req, res) => await healthController.healthCheck(req, res)
  );

  return router;
}

module.exports = createHealthRoutes;
