const Router = require("koa-router");
const incomeController = require("./income.controller");

const router = new Router();

router.get("/income/slash/treasury", incomeController.getTreasurySlash);
router.get("/income/slash/democracy", incomeController.getDemocracySlash);
router.get(
  "/income/slash/electionphragmen",
  incomeController.getElectionPhragmenSlash
);
router.get("/income/slash/staking", incomeController.getStakingSlash);
router.get("/income/slash/identity", incomeController.getIdentitySlash);
router.get("/income/inflation", incomeController.getInflation);
router.get("/income/transfer", incomeController.getIncomeTransfer);
router.get("/income/others", incomeController.getOthers);
router.get("/income/count", incomeController.getCount);

module.exports = router;
