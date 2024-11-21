const Router = require("koa-router");
const { getOutputStatusCollection } = require("../../mongo");

const router = new Router();

router.get("/assethub/assets", async (ctx) => {
  const col = await getOutputStatusCollection();
  const record = await col.findOne({ name: "assethub-treasury-stats" })
  ctx.body = record?.value;
});

module.exports = router;
