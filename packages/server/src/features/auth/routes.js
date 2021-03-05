const Router = require("koa-router");
const authController = require("./auth.controller");

const router = new Router();

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);

router.get(
  "/auth/login/:chain(kusama|polkadot)/:address",
  authController.addressLoginStart
);
router.post("/auth/login/:attemptId", authController.addressLoginConfirm);

router.post("/auth/verify", authController.verify);
router.post("/auth/forget", authController.forgetPassword);
router.post("/auth/reset", authController.resetPassword);

module.exports = router;
