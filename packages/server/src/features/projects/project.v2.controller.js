const { extractPage } = require("../../utils");
const { getProjectCollection, getProjectFundCollection } = require("../../mongo-admin");

class ProjectV2Controller {
  async getProjects(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const q = chain === 'kusama' ? { 'fundsCount.kusama': { $gt: 0 } } : { 'fundsCount.polkadot': { $gt: 0 } }

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

  async getProject(ctx) {
    const projectId = ctx.params.projectId;
    const projectCol = await getProjectCollection();
    const project = await projectCol.findOne({ id: projectId });

    const fundsCol = await getProjectFundCollection();
    const funds = await fundsCol.find({ projectId }).sort({
      'indexer.blockTime': -1,
    }).toArray();

    ctx.body = {
      ...project,
      funds,
    }
  }
}

module.exports = new ProjectV2Controller();
