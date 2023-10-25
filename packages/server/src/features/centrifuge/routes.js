const Router = require("koa-router");
const { getBlockRewards } = require("./controllers/block-rewards");
const { getTxFees } = require("./controllers/tx-fees");

const router = new Router();

router.get("/centrifuge/block-rewards", getBlockRewards);
router.get("/centrifuge/tx-fees", getTxFees);

module.exports = router;
