const Router = require("koa-router");
const referendaController = require("./referenda.controller");

const router = new Router();

router.get("/referenda", referendaController.getReferenda);
router.get("/referenda/count", referendaController.getReferendaCount);
router.get("/referenda/summary", referendaController.getSummary);

module.exports = router;
