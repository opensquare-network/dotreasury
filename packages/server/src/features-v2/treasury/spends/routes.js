const Router = require("koa-router");
const { getSpends } = require("./getSpends");
const { getSpendsTotalExpenditure } = require("./getSpendsTotalExpenditure");

const router = new Router();

router.get("/v2/treasury/spends", getSpends);
router.get("/v2/treasury/spends/total-expenditure", getSpendsTotalExpenditure);

module.exports = router;
