const Router = require("koa-router");
const { getPrice } = require("./price.controller");
const router = new Router();
router.get("/price", getPrice);
module.exports = router;
