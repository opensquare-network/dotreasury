const Router = require("koa-router");
const proposalsController = require("./proposals.controller");

const router = new Router();

router.get("/proposals", proposalsController.getProposals);
router.get("/proposals/count", proposalsController.getProposalsCount);

module.exports = router;
