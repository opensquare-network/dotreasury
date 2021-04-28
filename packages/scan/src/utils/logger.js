const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || "kusama";

const scanFileCategory = "os-scan";
const knownHeightsCategory = "known-heights";
const incomeCategory = "income";
const incomeKnownHeightsCategory = "income-known-heights";

const inflationCategory = "inflation";

const abnormalOthersCategory = "abnormal-others";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/${chain}/os-scan.log` },
    [knownHeightsCategory]: {
      type: "file",
      filename: `log/${chain}/known-heights.log`,
    },
    [incomeCategory]: {
      type: "file",
      filename: `log/${chain}/income/income.log`,
    },
    [inflationCategory]: {
      type: "file",
      filename: `log/${chain}/income/inflation.log`,
    },
    [incomeKnownHeightsCategory]: {
      type: "file",
      filename: `log/${chain}/income/income-known-heights.log`,
    },
    [abnormalOthersCategory]: {
      type: "file",
      filename: `log/${chain}/income/abnormal-others.log`,
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
    [knownHeightsCategory]: {
      appenders: [isProduction ? knownHeightsCategory : "out", "errors"],
      level: logLevel,
    },
    [incomeCategory]: {
      appenders: [isProduction ? incomeCategory : "out", "errors"],
      level: logLevel,
    },
    [incomeKnownHeightsCategory]: {
      appenders: [isProduction ? incomeKnownHeightsCategory : "out", "errors"],
      level: logLevel,
    },
    [abnormalOthersCategory]: {
      appenders: [isProduction ? abnormalOthersCategory : "out", "errors"],
      level: logLevel,
    },
    [inflationCategory]: {
      appenders: [isProduction ? inflationCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const knownHeightsLogger = log4js.getLogger(knownHeightsCategory);
const incomeLogger = log4js.getLogger(incomeCategory);
const incomeKnownHeightsLogger = log4js.getLogger(incomeKnownHeightsCategory);

const inflationLogger = log4js.getLogger(inflationCategory);

const abnormalOthersLogger = log4js.getLogger(abnormalOthersCategory);

module.exports = {
  logger,
  knownHeightsLogger,
  incomeLogger,
  incomeKnownHeightsLogger,
  inflationLogger,
  abnormalOthersLogger,
};
