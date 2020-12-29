const Router = require("koa-router");
const tipsController = require("./tips.controller");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/count", tipsController.getTipsCount);
router.get("/tips/:blockHeight(\\d+)_:tipHash", tipsController.getTipDetail);
router.get("/tips/:blockHeight(\\d+)_:tipHash/timeline", tipsController.getTipTimeline);

module.exports = router;
