const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || "kusama";

const scanFileCategory = "os-scan";
const incomeKnownHeightsCategory = "income-known-heights";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/${chain}/os-scan.log` },
    [incomeKnownHeightsCategory]: {
      type: "file",
      filename: `log/${chain}/income/income-known-heights.log`,
    },
    errorFile: {
      type: "file",
      filename: `log/${chain}/errors.log`,
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
    [incomeKnownHeightsCategory]: {
      appenders: [isProduction ? incomeKnownHeightsCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const incomeKnownHeightsLogger = log4js.getLogger(incomeKnownHeightsCategory);

module.exports = {
  logger,
  incomeKnownHeightsLogger,
};
