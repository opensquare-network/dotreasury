const Router = require("koa-router");
const participantController = require("./participant.controller");

const router = new Router();

router.get("/participants", participantController.getParticipants);
router.get("/participants/:address", participantController.getParticipant);

module.exports = router;
