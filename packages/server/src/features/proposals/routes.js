const Router = require("koa-router");
const proposalsController = require("./proposals.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.get("/proposals", proposalsController.getProposals);
router.get("/proposals/count", proposalsController.getProposalsCount);
router.get("/proposals/summary", proposalsController.getProposalSummary);
router.get("/proposals/:proposalIndex", proposalsController.getProposalDetail);

router.get(
  "/proposals/:proposalIndex/links",
  proposalsController.getProposalLinks
);
router.post(
  "/proposals/:proposalIndex/links",
  proposalsController.createProposalLink
);
router.delete(
  "/proposals/:proposalIndex/links/:linkIndex",
  proposalsController.deleteProposalLink
);

router.get(
  "/proposals/:proposalIndex/comments",
  proposalsController.getProposalComments
);
router.post(
  "/proposals/:proposalIndex/comments",
  requireAuth,
  proposalsController.postProposalComment
);

module.exports = router;
