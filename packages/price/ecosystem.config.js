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
      name: "ksm-price-tracker",
      args: "--symbol=KSM",
      ...commonPart,
    },
    {
      name: "dot-price-tracker",
      args: "--symbol=DOT",
      ...commonPart,
    },
    {
      name: "calc-price",
      script: "src/calcprice/index.js",
      cron_restart: "*/3 * * * *",
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    }
  ],
};
