const Router = require("koa-router");
const scanController = require("./scan.controller");

const router = new Router();

router.get("/scan", scanController.getStatus);

module.exports = router;
