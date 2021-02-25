const Router = require("koa-router");
const statsController = require("./stats.controller");

const router = new Router();

router.get("/stats/weekly", statsController.getWeeklyStatsHistory);

module.exports = router;
