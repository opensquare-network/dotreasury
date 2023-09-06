const Router = require("koa-router");
const transferController = require("./outputtransfer.controller");

const router = new Router();

router.get("/outputtransfers", transferController.getOutputTransfers);
router.get(
  "/outputtransfers/count",
  transferController.getOutputTransfersCount
);

module.exports = router;
