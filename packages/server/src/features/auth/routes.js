const Router = require("koa-router");
const authController = require("./auth.controller");

const router = new Router();

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);

module.exports = router;
