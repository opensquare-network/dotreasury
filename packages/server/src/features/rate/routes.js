const Router = require("koa-router");
const rateController = require("./rate.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.post("/rates", rateController.rate);
router.put(
  "/rates/:rateId/reaction",
  requireAuth,
  rateController.setRateReaction
);
router.delete(
  "/rates/:rateId/reaction",
  requireAuth,
  rateController.unsetRateReaction
);

module.exports = router;
