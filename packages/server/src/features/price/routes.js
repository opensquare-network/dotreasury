const Router = require("koa-router");
const priceController = require("./price.controller");

const router = new Router();

router.get("/price", priceController.getPrice);

module.exports = router;
