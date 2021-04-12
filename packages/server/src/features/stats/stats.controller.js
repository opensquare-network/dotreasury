const { getStatsCollection } = require("../../mongo");

class StatsController {
  async getWeeklyStatsHistory(ctx) {
    const { chain } = ctx.params;
    const statsCol = await getStatsCollection(chain);
    const statsHistory = await statsCol.find({}).toArray();
    ctx.body = statsHistory;
  }
}

module.exports = new StatsController();
