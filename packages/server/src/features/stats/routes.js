const Router = require("koa-router");
const statsController = require("./stats.controller");

const router = new Router();

router.get("/stats/weekly", statsController.getWeeklyStatsHistory);
router.get("/stats/inout", statsController.getTreasuryInOut);

module.exports = router;
