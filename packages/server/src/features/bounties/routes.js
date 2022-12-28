const Router = require("koa-router");
const bountiesController = require("./bounties.controller");
const childBountiesController = require("../child-bounties/child-bounties.controller")

const router = new Router();

router.get("/bounties", bountiesController.getBounties);
router.get("/bounties/:bountyIndex", bountiesController.getBountyDetail);
router.get("/bounties/:bountyIndex/child-bounties", childBountiesController.getBountiesByParent);

router.get("/bounties/:bountyIndex/links", bountiesController.getBountyLinks);
router.post(
  "/bounties/:bountyIndex/links",
  bountiesController.createBountyLink
);
router.delete(
  "/bounties/:bountyIndex/links/:linkIndex",
  bountiesController.deleteBountyLink
);

router.get(
  "/bounties/:bountyIndex/comments",
  bountiesController.getBountyComments
);

module.exports = router;
