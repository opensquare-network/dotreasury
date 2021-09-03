const Router = require("koa-router");
const tipsController = require("./tips.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/:tipId", tipsController.getTipDetail);

router.get(
  "/tips/:blockHeight(\\d+)_:tipHash/links",
  tipsController.getTipLinks
);
router.post(
  "/tips/:blockHeight(\\d+)_:tipHash/links",
  tipsController.createTipLink
);
router.delete(
  "/tips/:blockHeight(\\d+)_:tipHash/links/:linkIndex",
  tipsController.deleteTipLink
);

router.get(
  "/tips/:blockHeight(\\d+)_:tipHash/comments",
  maybeAuth,
  tipsController.getTipComments
);
router.post(
  "/tips/:blockHeight(\\d+)_:tipHash/comments",
  requireAuth,
  tipsController.postTipComment
);

router.get(
  "/tips/:blockHeight(\\d+)_:tipHash/rates",
  maybeAuth,
  tipsController.getRates,
);

router.get(
  "/tips/:blockHeight(\\d+)_:tipHash/ratestats",
  tipsController.getRateStats,
);


module.exports = router;
