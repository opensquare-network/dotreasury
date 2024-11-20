const { CronJob } = require("cron");
const { updateTokenPricesByGate } = require("./tokens/gate");
const { updateTokenPricesByKraken } = require("./tokens/kraken");

function startGateTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByGate, null, true, "Asia/Shanghai");
}

function startKrakenTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByKraken, null, true, "Asia/Shanghai");
}

module.exports = {
  startGateTickerCronJob,
  startKrakenTickerCronJob,
}
