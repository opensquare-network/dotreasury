const Router = require("koa-router");
const bountiesController = require("./bounties.controller");
const childBountiesController = require("../child-bounties/child-bounties.controller")
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

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
  maybeAuth,
  bountiesController.getBountyComments
);
router.post(
  "/bounties/:bountyIndex/comments",
  requireAuth,
  bountiesController.postBountyComment
);

module.exports = router;
