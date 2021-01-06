const Router = require("koa-router");
const statusController = require("./status.controller");

const router = new Router();

router.get("/status", statusController.getStatus);

module.exports = router;
