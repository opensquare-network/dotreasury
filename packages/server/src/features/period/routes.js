const Router = require("koa-router");
const periodController = require("./period.controller");

const router = new Router();

router.get("/periods", periodController.getPeriods);

module.exports = router;
