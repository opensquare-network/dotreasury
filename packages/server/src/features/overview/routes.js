const Router = require("koa-router");
const overviewController = require("./overview.controller");

const router = new Router();

router.get("/overview", overviewController.getOverview);

module.exports = router;
