require("dotenv").config({ path: "../.env" });
const { spawn } = require("child_process");
const path = require("path");

const WEBSITE_PORT = process.env.WEBSITE_PORT || 3001;
const EXTENSION_PORT = process.env.EXTENSION_PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || "development";

let websiteProcess = null;
let extensionProcess = null;

function startWebsiteBackend() {
  console.log(`[SPAWNER] Starting website backend on port ${WEBSITE_PORT}`);

  websiteProcess = spawn("node", ["server.js"], {
    cwd: path.join(__dirname, "website"),
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: WEBSITE_PORT,
      SERVICE_NAME: "website-backend",
    },
  });

  websiteProcess.on("error", (err) => {
    console.error("[SPAWNER] Website backend error:", err);
  });

  websiteProcess.on("exit", (code, signal) => {
    console.log(
      `[SPAWNER] Website backend exited with code ${code}, signal ${signal}`
    );
    if (NODE_ENV === "production" && code !== 0) {
      console.log("[SPAWNER] Restarting website backend...");
      setTimeout(startWebsiteBackend, 5000);
    }
  });
}

function startExtensionBackend() {
  console.log(`[SPAWNER] Starting extension backend on port ${EXTENSION_PORT}`);

  extensionProcess = spawn("node", ["server.js"], {
    cwd: path.join(__dirname, "extension"),
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: EXTENSION_PORT,
      SERVICE_NAME: "extension-backend",
    },
  });

  extensionProcess.on("error", (err) => {
    console.error("[SPAWNER] Extension backend error:", err);
  });

  extensionProcess.on("exit", (code, signal) => {
    console.log(
      `[SPAWNER] Extension backend exited with code ${code}, signal ${signal}`
    );
    if (NODE_ENV === "production" && code !== 0) {
      console.log("[SPAWNER] Restarting extension backend...");
      setTimeout(startExtensionBackend, 5000);
    }
  });
}

function gracefulShutdown(signal) {
  console.log(`[SPAWNER] Received ${signal}. Shutting down gracefully...`);

  if (websiteProcess) {
    websiteProcess.kill(signal);
  }

  if (extensionProcess) {
    extensionProcess.kill(signal);
  }

  setTimeout(() => {
    console.log("[SPAWNER] Force shutdown");
    process.exit(0);
  }, 10000);
}

// Handle graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start both backends
console.log("[SPAWNER] Starting LeetBuddy unified backend...");
startWebsiteBackend();
startExtensionBackend();

console.log(`[SPAWNER] Both backends starting...`);
console.log(`[SPAWNER] Website backend: http://localhost:${WEBSITE_PORT}`);
console.log(`[SPAWNER] Extension backend: http://localhost:${EXTENSION_PORT}`);
