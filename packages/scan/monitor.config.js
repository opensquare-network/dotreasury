const commonPart = {
  script: "src/monitor/index.js",
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
};

module.exports = {
  apps: [
    {
      name: "doTreasury-scanmon",
      args: "doTreasury-scan",
      ...commonPart,
    },
    {
      name: "doTreasury-scanmon-staging",
      args: "doTreasury-scan-staging",
      ...commonPart,
    },
    {
      name: "doTreasury-scanmon-dev",
      args: "doTreasury-scan-dev",
      ...commonPart,
    },
  ],
};
