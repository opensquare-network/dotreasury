const commonPart = {
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
};

const outputScanPart = {
  script: "src/index.js",
  ...commonPart,
};

module.exports = {
  apps: [
    {
      name: "doTreasury-scan",
      ...outputScanPart,
    },
    {
      name: "doTreasury-scan-staging",
      ...outputScanPart,
    },
    {
      name: "doTreasury-scan-dev",
      ...outputScanPart,
    },
  ],
};
