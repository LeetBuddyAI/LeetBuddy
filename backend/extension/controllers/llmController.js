const { logInfo, logError } = require("../../shared/logger");

class LLMController {
  constructor(llmService) {
    this.llmService = llmService;
  }

  async handleLLMRequest(req, res) {
    try {
      const { question, image, context, sessionID } = req.body;

      // Validate required fields
      if (!question) {
        return res.status(400).json({ error: "User Question is required." });
      }

      if (!sessionID) {
        return res.status(400).json({ error: "Session ID is required." });
      }

      // Check if Redis is available
      if (!this.llmService.isRedisReady()) {
        throw new Error("Redis client not initialized");
      }

      logInfo(`LLM request for session: ${sessionID}`);

      // Set up SSE headers
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "X-Accel-Buffering": "no", // Disable Nginx buffering
      });

      // Send initial connection message
      res.write(":ok\n\n");
      res.flushHeaders();

      let formattedimage = null;
      if (image) {
        formattedimage = image.replace(/^data:image\/\w+;base64,/, "");
      }

      // Stream the response
      try {
        for await (const chunk of this.llmService.generateStreamingResponse({
          question,
          image: formattedimage,
          context,
          sessionID,
        })) {
          // Send chunk as SSE event
          const message = `data: ${JSON.stringify({ chunk })}\n\n`;
          res.write(message);

          // Force flush the response
          if (res.flush) res.flush();
        }

        // Send completion event
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        if (res.flush) res.flush();

        res.end();
      } catch (streamError) {
        // Send error event
        res.write(
          `data: ${JSON.stringify({ error: streamError.message })}\n\n`
        );
        res.end();
      }
    } catch (error) {
      logError(`LLM generation error: ${error.message}`);

      // If headers haven't been sent yet, send JSON error
      if (!res.headersSent) {
        if (error.message.includes("Redis")) {
          res.status(503).json({ error: "Service temporarily unavailable" });
        } else if (error.message.includes("rate limit")) {
          res.status(429).json({ error: "Too many requests" });
        } else {
          res
            .status(500)
            .json({
              error: "An error occurred while generating the response.",
            });
        }
      } else {
        // If streaming already started, send error event
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  }
}

module.exports = LLMController;
