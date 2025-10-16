const express = require("express");

function createLLMRoutes(llmController) {
  const router = express.Router();

  // Main LLM endpoint
  router.post("/", (req, res) => llmController.handleLLMRequest(req, res));

  return router;
}

module.exports = createLLMRoutes;
