const Router = require("koa-router");
const beneficiaryController = require("./beneficiary.controller");
const proposerController = require("./proposer.controller");
const councilorController = require("./councilor.controller");

const router = new Router();

router.get("/account/:address/beneficiary/counts", beneficiaryController.getBeneficiaryCounts);
router.get("/account/:address/beneficiary/tips", beneficiaryController.getBeneficiaryTips);
router.get("/account/:address/beneficiary/proposals", beneficiaryController.getBeneficiaryProposals);
router.get("/account/:address/beneficiary/bounties", beneficiaryController.getBeneficiaryBounties);
router.get("/account/:address/beneficiary/child-bounties", beneficiaryController.getBeneficiaryChildBounties);

router.get("/account/:address/proposer/counts", proposerController.getProposerCounts);
router.get("/account/:address/proposer/tips", proposerController.getProposerTips);
router.get("/account/:address/proposer/proposals", proposerController.getProposerProposals);
router.get("/account/:address/proposer/bounties", proposerController.getProposerBounties);
router.get("/account/:address/proposer/child-bounties", proposerController.getProposerChildBounties);

router.get("/account/:address/councilor/terms", councilorController.getCouncilorTerms);
router.get("/account/:address/councilor/motions", councilorController.getMotionVoters);
router.get("/account/:address/councilor/tippers", councilorController.getTippers);
router.get(
  "/account/:address/councilor/rates",
  councilorController.getRates,
);
router.get(
  "/account/:address/councilor/ratestats",
  councilorController.getRateStats,
);

module.exports = router;
