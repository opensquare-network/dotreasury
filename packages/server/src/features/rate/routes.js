const Router = require("koa-router");
const rateController = require("./rate.controller");

const router = new Router();

router.post("/rates", rateController.rate);

module.exports = router;
