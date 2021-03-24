const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || "kusama";

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
    [treasurySlashCategory]: {
      type: "file",
      filename: `log/${chain}/income/slash/treasury-slash.log`,
    },
    [stakingSlashCategory]: {
      type: "file",
      filename: `log/${chain}/income/slash/staking-slash.log`,
    },
    [democracySlashCategory]: {
      type: "file",
      filename: `log/${chain}/income/slash/democracy-slash.log`,
    },
    [electionsPhragmenSlashCategory]: {
      type: "file",
      filename: `log/${chain}/income/slash/elections-phragmen-slash.log`,
    },
    [identitySlashCategory]: {
      type: "file",
      filename: `log/${chain}/income/slash/identity-slash.log`,
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
    [treasurySlashCategory]: {
      appenders: [isProduction ? treasurySlashCategory : "out", "errors"],
      level: logLevel,
    },
    [stakingSlashCategory]: {
      appenders: [isProduction ? stakingSlashCategory : "out", "errors"],
      level: logLevel,
    },
    [democracySlashCategory]: {
      appenders: [isProduction ? democracySlashCategory : "out", "errors"],
      level: logLevel,
    },
    [identitySlashCategory]: {
      appenders: [isProduction ? identitySlashCategory : "out", "errors"],
      level: logLevel,
    },
    [electionsPhragmenSlashCategory]: {
      appenders: [
        isProduction ? electionsPhragmenSlashCategory : "out",
        "errors",
      ],
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

const treasurySlashLogger = log4js.getLogger(treasurySlashCategory);
const stakingSlashLogger = log4js.getLogger(stakingSlashCategory);
const democracySlashLogger = log4js.getLogger(democracySlashCategory);
const identitySlashLogger = log4js.getLogger(identitySlashCategory);
const electionsPhragmenLogger = log4js.getLogger(
  electionsPhragmenSlashCategory
);

const inflationLogger = log4js.getLogger(inflationCategory);

const abnormalOthersLogger = log4js.getLogger(abnormalOthersCategory);

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
  abnormalOthersLogger,
};
