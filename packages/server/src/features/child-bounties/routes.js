const Router = require("koa-router");
const childBountiesController = require("./child-bounties.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

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
  maybeAuth,
  childBountiesController.getBountyComments
);
router.post(
  "/child-bounties/:bountyIndex/comments",
  requireAuth,
  childBountiesController.postBountyComment
);

module.exports = router;
