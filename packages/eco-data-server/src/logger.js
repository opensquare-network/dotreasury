const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const statusCategory = "status";

log4js.configure({
  appenders: {
    [statusCategory]: { type: "file", filename: "log/status.log" },
    errorFile: {
      type: "file",
      filename: "log/errors.log",
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: [isProduction ? statusCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const statusLogger = log4js.getLogger(statusCategory);

module.exports = {
  statusLogger,
};
