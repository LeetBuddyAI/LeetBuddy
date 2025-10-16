const Redis = require("ioredis");
const { logInfo, logError } = require("./logger");

class SharedRedisService {
  constructor(redisUrl, keyPrefix = "") {
    this.keyPrefix = keyPrefix;

    // Configure Redis - now always uses connection string directly
    this.redis = new Redis(redisUrl, {
      retryStrategy: (times) => Math.min(times * 100, 3000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on("error", (err) => logError(`Redis Error: ${err.message}`));
    this.redis.on("connect", () =>
      logInfo("Redis Connected successfully", { important: true })
    );
    this.redis.on("reconnecting", (ms) =>
      logInfo(`Redis Reconnecting in ${ms}ms`, { important: true })
    );

    // Add connection promise
    this.connectionPromise = this.redis.connect();
  }

  // Add method to ensure connection
  async ensureConnected() {
    await this.connectionPromise;
  }

  prefixKey(key) {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }

  async set(key, value, ...args) {
    try {
      return await this.redis.set(this.prefixKey(key), value, ...args);
    } catch (error) {
      logError(`Redis set error: ${error.message}`);
      throw new Error("Service temporarily unavailable");
    }
  }

  async get(key) {
    try {
      return await this.redis.get(this.prefixKey(key));
    } catch (error) {
      logError(`Redis get error: ${error.message}`);
      throw new Error("Service temporarily unavailable");
    }
  }

  async del(key) {
    return this.redis.del(this.prefixKey(key));
  }

  async expire(key, seconds) {
    return this.redis.expire(this.prefixKey(key), seconds);
  }

  get status() {
    return this.redis.status;
  }

  async quit() {
    return this.redis.quit();
  }
}

module.exports = SharedRedisService;
