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

const calcPriceCommonPart = {
  script: "src/calcprice/index.js",
  cron_restart: "* */5 * * *",
  autorestart: false,
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
}

function getCalcPriceEnvConfig(chainName) {
  return {
    env: {
      ...calcPriceCommonPart.env,
      CHAIN: chainName,
    },
    env_production: {
      ...calcPriceCommonPart.env_production,
      CHAIN: chainName,
    },
  };
}

const dotCalcPriceConfig = {
  ...calcPriceCommonPart,
  ...getCalcPriceEnvConfig("polkadot")
}

const ksmCalcPriceConfig = {
  ...calcPriceCommonPart,
  ...getCalcPriceEnvConfig("kusama")
}

module.exports = {
  apps: [
    // prod-scan
    {
      name: "dot-scan-prod",
      ...dotScanConfig,
    },
    {
      name: "ksm-scan-prod",
      ...ksmScanConfig,
    },

    // staging-scan
    {
      name: "dot-scan-staging",
      ...dotScanConfig,
    },
    {
      name: "ksm-scan-staging",
      ...ksmScanConfig,
    },

    // dev-scan
    {
      name: "dot-scan-dev",
      ...dotScanConfig,
    },
    {
      name: "ksm-scan-dev",
      ...ksmScanConfig,
    },

    /**
     * *****************  calc price  ******************
     */
    // prod-calc-price
    {
      name: "dot-calc-price-prod",
      ...dotCalcPriceConfig,
    },
    {
      name: "ksm-calc-price-prod",
      ...ksmCalcPriceConfig,
    },

    // staging-calc-price
    {
      name: "dot-calc-price-staging",
      ...dotCalcPriceConfig,
    },
    {
      name: "ksm-calc-price-staging",
      ...ksmCalcPriceConfig,
    },

    // dev-calc-price
    {
      name: "dot-calc-price-dev",
      ...dotCalcPriceConfig,
    },
    {
      name: "ksm-calc-price-dev",
      ...ksmCalcPriceConfig,
    },
  ],
};
