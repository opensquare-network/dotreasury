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

function getEnvConfig(chainName) {
  return {
    env: {
      ...commonPart.env,
      CHAIN: chainName,
    },
    env_production: {
      ...commonPart.env_production,
      CHAIN: chainName,
    },
  };
}

const dotScanConfig = {
  ...commonPart,
  ...getEnvConfig("polkadot"),
};

const ksmScanConfig = {
  ...commonPart,
  ...getEnvConfig("kusama"),
};

module.exports = {
  apps: [
    {
      name: "doTreasury-scan",
      ...commonPart,
    },
    {
      name: "doTreasury-scan-staging",
      ...commonPart,
    },
    {
      name: "dot-scan",
      ...dotScanConfig,
    },
    {
      name: "dot-scan-staging",
      ...dotScanConfig,
    },
    {
      name: "ksm-scan",
      ...ksmScanConfig,
    },
    {
      name: "ksm-scan-staging",
      ...ksmScanConfig,
    },
    {
      name: "ksm-calc-price",
      script: "src/calcprice/index.js",
      cron_restart: "* */5 * * *",
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
        CHAIN: "kusama",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "kusama",
      },
    },
    {
      name: "dot-calc-price",
      script: "src/calcprice/index.js",
      cron_restart: "* */5 * * *",
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
        CHAIN: "polkadot",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "polkadot",
      },
    },
  ],
};
