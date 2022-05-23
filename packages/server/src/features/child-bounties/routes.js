const Router = require("koa-router");
const childBountiesController = require("./child-bounties.controller");

const router = new Router();

router.get("/child-bounties", childBountiesController.getBounties);
router.get("/child-bounties/:index", childBountiesController.getChildBounty);

module.exports = router;
