const Router = require("koa-router");
const { getSpends } = require("./spends.controller");

const router = new Router();

router.get("/v2/treasury/spends", getSpends);

module.exports = router;
