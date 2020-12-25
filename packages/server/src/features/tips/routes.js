const Router = require("koa-router");
const tipsController = require("./tips.controller");

const router = new Router();

// API for Explorer
router.get("/tips", tipsController.getTips);

module.exports = router;
