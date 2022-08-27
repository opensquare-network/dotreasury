const { extractPage } = require("../../utils");
const { getProjectCollection } = require("../../mongo-admin");

class ProjectV2Controller {
  async getProjects(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const q = chain === 'kusama' ? { 'funds.kusama': { $gt: 0 } } : { 'funds.polkadot': { $gt: 0 } }

    const projectCol = await getProjectCollection();
    const items = await projectCol
      .find(q)
      .sort({ latestTime: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await projectCol.count(q);

    ctx.body = {
      items,
      page,
      pageSize,
      total,
    }
  }
}

module.exports = new ProjectV2Controller();
