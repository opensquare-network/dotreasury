const Router = require("koa-router");
const periodController = require("./period.controller");

const router = new Router();

router.get("/periods", periodController.getOutputPeriods);
router.get("/output-periods", periodController.getOutputPeriods);
router.get("/income-periods", periodController.getIncomePeriods);

module.exports = router;
