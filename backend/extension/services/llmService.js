const { GoogleGenAI } = require("@google/genai");
const SharedRedisService = require("../../shared/redis");
const { logInfo, logError, logWarning } = require("../../shared/logger");

class LLMService {
  constructor(apiKey, model, instructions, redisUrl) {
    this.ai = new GoogleGenAI({ apiKey });
    this.modelName = model;
    this.instructions = instructions;

    // Initialize Redis with extension prefix
    this.redisService = new SharedRedisService(redisUrl, "extension");

    logInfo(`LLM Service initialized with model: ${this.modelName}`);
  }

  isRedisReady() {
    return this.redisService.status === "ready";
  }

  async getChatHistory(sessionID) {
    try {
      const redisKey = `chat:${sessionID}`;
      const chatHistoryStr = await this.redisService.get(redisKey);

      if (chatHistoryStr) {
        return JSON.parse(chatHistoryStr);
      }

      return [];
    } catch (error) {
      logWarning(
        `Failed to get chat history for session ${sessionID}: ${error.message}`
      );
      return [];
    }
  }

  async saveChatHistory(sessionID, chatHistory) {
    try {
      const redisKey = `chat:${sessionID}`;
      await this.redisService.set(redisKey, JSON.stringify(chatHistory));
      await this.redisService.expire(redisKey, 10800); // 3 hour TTL

      logInfo(`Chat history saved for session: ${sessionID}`);
    } catch (error) {
      logError(
        `Failed to save chat history for session ${sessionID}: ${error.message}`
      );
      throw error;
    }
  }

  async *generateStreamingResponse({ question, image, context, sessionID }) {
    try {
      // Get existing chat history
      const chatHistory = await this.getChatHistory(sessionID);

      // Build prompt
      let prompt = "";
      if (context) {
        prompt += `Context: ${context}\n\n`;
      }
      prompt += `User Question: ${question}`;

      // Build the message parts
      const messageParts = [{ text: prompt }];
      if (image) {
        // Validate image data
        if (typeof image !== "string" || image.length === 0) {
          logError(`Invalid image data provided for session ${sessionID}`);
          throw new Error("Invalid image data format");
        }

        messageParts.push({
          inlineData: {
            mimeType: "image/png",
            data: image,
          },
        });

        logInfo(`Processing request with image for session: ${sessionID}`);
      }

      // Add user message to history
      chatHistory.push({
        role: "user",
        parts: messageParts,
      });

      // Create chat session with history and system instructions
      const chatConfig = {
        model: this.modelName,
        history: chatHistory.slice(0, -1), // All messages except the last one we just added
      };

      // Add system instructions if available
      if (this.instructions) {
        chatConfig.config = {
          systemInstruction: this.instructions,
        };
      }

      const chat = this.ai.chats.create(chatConfig);

      // Stream the response with proper message format
      let messageContent;
      if (image) {
        // For multimodal content, send parts array
        messageContent = messageParts;
      } else {
        // For text-only, send just the prompt string
        messageContent = prompt;
      }

      const stream = await chat.sendMessageStream({
        message: messageContent,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        fullResponse += chunkText;
        yield chunkText;
      }

      // Add AI response to history
      chatHistory.push({
        role: "model",
        parts: [{ text: fullResponse }],
      });

      // Save updated chat history
      await this.saveChatHistory(sessionID, chatHistory);

      logInfo(`Generated streaming response for session: ${sessionID}`);
    } catch (error) {
      logError(`Response generation failed: ${error.message}`);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.redisService.quit();
      logInfo("LLM Service cleanup completed");
    } catch (error) {
      logError(`Cleanup error: ${error.message}`);
    }
  }
}

module.exports = LLMService;
