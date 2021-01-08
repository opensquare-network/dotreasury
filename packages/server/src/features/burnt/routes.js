const Router = require("koa-router");
const burntController = require("./burnt.controller");

const router = new Router();

router.get("/burnt", burntController.getBurntList);
router.get("/burnt/count", burntController.getBurntCount);

module.exports = router;
