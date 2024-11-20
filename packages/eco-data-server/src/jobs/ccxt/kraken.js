const { CronJob } = require("cron");
const { updateTokenPricesByKraken } = require("./tokens/kraken");

function startKrakenTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByKraken, null, true, "Asia/Shanghai");
}

module.exports = {
  startKrakenTickerCronJob,
}
