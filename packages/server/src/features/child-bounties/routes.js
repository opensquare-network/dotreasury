const Router = require("koa-router");
const childBountiesController = require("./child-bounties.controller");

const router = new Router();

router.get("/child-bounties", childBountiesController.getBounties);
router.get("/child-bounties/:bountyIndex", childBountiesController.getBountyDetail);

router.get("/child-bounties/:bountyIndex/links", childBountiesController.getBountyLinks);
router.post(
  "/child-bounties/:bountyIndex/links",
  childBountiesController.createBountyLink
);
router.delete(
  "/child-bounties/:bountyIndex/links/:linkIndex",
  childBountiesController.deleteBountyLink
);

router.get(
  "/child-bounties/:bountyIndex/comments",
  childBountiesController.getBountyComments
);

module.exports = router;
