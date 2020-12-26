const Router = require("koa-router");
const tipsController = require("./tips.controller");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/:hash", tipsController.getTipDetail);

module.exports = router;
