const Router = require("koa-router");
const proposalsController = require("./proposals.controller");
const requireAuth = require("../../middleware/require-auth");
const maybeAuth = require("../../middleware/maybe-auth");

const router = new Router();

router.get("/proposals", proposalsController.getProposals);
router.get("/proposals/summary", proposalsController.getProposalSummary);
router.get("/proposals/beneficiaries", proposalsController.getProposalBeneficiaries);
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
  maybeAuth,
  proposalsController.getProposalComments
);
router.post(
  "/proposals/:proposalIndex/comments",
  requireAuth,
  proposalsController.postProposalComment
);

router.get(
  "/proposals/:proposalIndex/rates",
  maybeAuth,
  proposalsController.getRates,
);

router.get(
  "/proposals/:proposalIndex/ratestats",
  proposalsController.getRateStats,
);

router.get(
  "/proposals/:proposalIndex/description",
  proposalsController.getProposalDescription
);
router.put(
  "/proposals/:proposalIndex/description",
  proposalsController.setProposalDescription
);


module.exports = router;
