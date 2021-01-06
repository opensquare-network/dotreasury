const Router = require("koa-router");
const bountiesController = require("./bounties.controller");

const router = new Router();

router.get("/bounties", bountiesController.getBounties);
router.get("/bounties/count", bountiesController.getBountiesCount);
router.get("/bounties/:bountyIndex", bountiesController.getBountyDetail);

module.exports = router;
