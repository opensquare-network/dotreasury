const Router = require("koa-router");
const userController = require("./user.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.get("/user/linkaddr/:address", requireAuth, userController.linkAddressStart);
router.post("/user/linkaddr/:address", requireAuth, userController.linkAddressConfirm);

module.exports = router;
