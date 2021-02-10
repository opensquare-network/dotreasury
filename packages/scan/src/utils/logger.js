const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const scanFileCategory = "os-scan";
const knownHeightsCategory = "known-heights";
const incomeCategory = "income";
const incomeKnownHeightsCategory = "income-known-heights";

const treasurySlashCategory = "treasury-slash";
const stakingSlashCategory = "staking-slash";
const democracySlashCategory = "democracy-slash";
const electionsPhragmenSlashCategory = "electionsPhragmen-slash";
const identitySlashCategory = "identity-slash";

const inflationCategory = "inflation";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: "log/os-scan.log" },
    [knownHeightsCategory]: { type: "file", filename: "log/known-heights.log" },
    [incomeCategory]: { type: "file", filename: "log/income.log" },
    [inflationCategory]: { type: "file", filename: "log/inflation.log" },
    [incomeKnownHeightsCategory]: {
      type: "file",
      filename: "log/income-known-heights.log",
    },
    [treasurySlashCategory]: {
      type: "file",
      filename: "log/slash/treasury-slash.log",
    },
    [stakingSlashCategory]: {
      type: "file",
      filename: "log/slash/staking-slash.log",
    },
    [democracySlashCategory]: {
      type: "file",
      filename: "log/slash/democracy-slash.log",
    },
    [electionsPhragmenSlashCategory]: {
      type: "file",
      filename: "log/slash/elections-phragmen-slash.log",
    },
    [identitySlashCategory]: {
      type: "file",
      filename: "log/slash/identity-slash.log",
    },
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
    [incomeCategory]: {
      appenders: [incomeCategory, "errors"],
      level: logLevel,
    },
    [incomeKnownHeightsCategory]: {
      appenders: [incomeKnownHeightsCategory, "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const knownHeightsLogger = log4js.getLogger(knownHeightsCategory);
const incomeLogger = log4js.getLogger(incomeCategory);
const incomeKnownHeightsLogger = log4js.getLogger(incomeKnownHeightsCategory);

const treasurySlashLogger = log4js.getLogger(treasurySlashCategory);
const stakingSlashLogger = log4js.getLogger(stakingSlashCategory);
const democracySlashLogger = log4js.getLogger(democracySlashCategory);
const identitySlashLogger = log4js.getLogger(identitySlashCategory);
const electionsPhragmenLogger = log4js.getLogger(
  electionsPhragmenSlashCategory
);

const inflationLogger = log4js.getLogger(inflationCategory);

module.exports = {
  logger,
  knownHeightsLogger,
  incomeLogger,
  incomeKnownHeightsLogger,
  treasurySlashLogger,
  stakingSlashLogger,
  democracySlashLogger,
  identitySlashLogger,
  electionsPhragmenLogger,
  inflationLogger,
};
