module.exports = {
  apps: [
    {
      name: "doTreasury link migration",
      script: "src/migration/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      exec_mode: 'fork',
      cron_restart: "*/3 * * * *",
      watch: false,
      autorestart: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
