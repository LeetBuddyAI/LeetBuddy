const SERVICE_NAME = process.env.SERVICE_NAME || "unknown";
const NODE_ENV = process.env.NODE_ENV || "development";

function logInfo(message, data = {}) {
  // Extract the important flag from data if it exists
  const { important, ...restData } = data;

  // Only show in production if marked as important
  if (NODE_ENV === "production" && !important) {
    return;
  }

  console.log(
    `[${SERVICE_NAME.toUpperCase()}] [INFO] ${message}`,
    Object.keys(restData).length ? restData : ""
  );
}

function logWarning(message, data = {}) {
  console.warn(
    `[${SERVICE_NAME.toUpperCase()}] [WARN] ${message}`,
    Object.keys(data).length ? data : ""
  );
}

function logError(message, data = {}) {
  console.error(
    `[${SERVICE_NAME.toUpperCase()}] [ERROR] ${message}`,
    Object.keys(data).length ? data : ""
  );
}

function logFatal(message, data = {}) {
  console.error(
    `[${SERVICE_NAME.toUpperCase()}] [FATAL] ${message}`,
    Object.keys(data).length ? data : ""
  );
}

module.exports = {
  logInfo,
  logWarning,
  logError,
  logFatal,
};
