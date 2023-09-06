const Router = require("koa-router");
const burntController = require("./burnt.controller");

const router = new Router();

router.get("/burnt", burntController.getBurntList);
router.get("/burnt/count", burntController.getBurntCount);
router.get("/burnt/chart", burntController.getBurntDataForChart);

module.exports = router;
