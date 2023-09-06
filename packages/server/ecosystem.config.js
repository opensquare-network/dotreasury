const common = {
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
}

const commonPart = {
  script: "src/index.js",
  ...common,
};

const pinCommon = {
  script: "src/scripts/pin-rate-to-ipfs.js",
  ...common,
}

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
      name: "doTreasury-pin-rate-prod",
      ...pinCommon,
    },
    {
      name: "doTreasury-pin-rate-staging",
      ...pinCommon,
    },
  ],
};
