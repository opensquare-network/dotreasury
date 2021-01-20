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
      name: "doTreasury-api",
      ...commonPart,
    },
    {
      name: "doTreasury-staging-api",
      ...commonPart,
    },
  ],
};
