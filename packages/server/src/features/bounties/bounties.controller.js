const { extractPage } = require("../../utils");

class BountiesController {
  async getBounties(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    ctx.body = {
      items: [],
      page,
      pageSize,
      total: 0,
    };
  }

  async getBountiesCount(ctx) {
    ctx.body = 0;
  }

  async getBountyDetail(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.status = 404;
  }
}

module.exports = new BountiesController();
