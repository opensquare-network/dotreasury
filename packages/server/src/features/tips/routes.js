const Router = require("koa-router");
const tipsController = require("./tips.controller");
const { handler } = require("../../utils");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/count", tipsController.getTipsCount);
router.get("/tips/:blockHeight(\\d+)_:tipHash", tipsController.getTipDetail);

router.get("/tips/:blockHeight(\\d+)_:tipHash/links", tipsController.getTipLinks);
router.post("/tips/:blockHeight(\\d+)_:tipHash/links", handler(tipsController, "createTipLink"));
router.delete("/tips/:blockHeight(\\d+)_:tipHash/links/:linkIndex", handler(tipsController, "deleteTipLink"));

module.exports = router;
