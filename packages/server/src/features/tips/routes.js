const Router = require("koa-router");
const tipsController = require("./tips.controller");

const router = new Router();

router.get("/tips", tipsController.getTips);
router.get("/tips/finders", tipsController.getTipFinders);
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
  tipsController.getTipComments
);
router.get("/tipping", tipsController.getTippings);

module.exports = router;
