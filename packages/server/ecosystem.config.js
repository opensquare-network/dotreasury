const commonPart = {
  script: "src/index.js",
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
      name: "doTreasury-api-prod",
      ...commonPart,
    },
    {
      name: "doTreasury-api-staging",
      ...commonPart,
    },
    {
      name: "doTreasury-api-dev",
      ...commonPart,
    },
  ],
};
