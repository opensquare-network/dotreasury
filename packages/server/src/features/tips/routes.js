const Router = require("koa-router");
const tipsController = require("./tips.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/count", tipsController.getTipsCount);
router.get("/tips/:blockHeight(\\d+)_:tipHash", tipsController.getTipDetail);

router.get("/tips/:blockHeight(\\d+)_:tipHash/links", tipsController.getTipLinks);
router.post("/tips/:blockHeight(\\d+)_:tipHash/links", tipsController.createTipLink);
router.delete("/tips/:blockHeight(\\d+)_:tipHash/links/:linkIndex", tipsController.deleteTipLink);

router.get("/tips/:blockHeight(\\d+)_:tipHash/comments", tipsController.getTipComments);
router.post("/tips/:blockHeight(\\d+)_:tipHash/comments", requireAuth, tipsController.postTipComment);
router.patch("/tips/:blockHeight(\\d+)_:tipHash/comments/:commentId", requireAuth, tipsController.updateTipComment);
router.delete("/tips/:blockHeight(\\d+)_:tipHash/comments/:commentId", requireAuth, tipsController.deleteTipComment);

module.exports = router;
