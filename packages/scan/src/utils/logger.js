const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const scanFileCategory = "os-scan";
const knownHeightsCategory = "known-heights";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: "log/os-scan.log" },
    [knownHeightsCategory]: { type: "file", filename: "log/known-heights.log" },
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
      appenders: [isProduction ? scanFileCategory : "out", "errors"],
      level: logLevel,
    },
    [knownHeightsCategory]: {
      appenders: [knownHeightsCategory, "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const knownHeightsLogger = log4js.getLogger(knownHeightsCategory);

module.exports = {
  logger,
  knownHeightsLogger,
};
