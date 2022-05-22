const { getChildBountyCollection } = require("../../mongo");

class ChildBountiesController {
  async getChildBounty(ctx) {
    const { chain } = ctx.params;
    const index = parseInt(ctx.params.index);

    const col = await getChildBountyCollection(chain);
    const bounty = await col.findOne({ index });

    if (!bounty) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      ...bounty
    }
  }
}

module.exports = new ChildBountiesController();
