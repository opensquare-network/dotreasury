const { getStatsCollection } = require("../../mongo");

class StatsController {
  async getWeeklyStatsHistory(ctx) {
    const statsCol = await getStatsCollection();
    const statsHistory = await statsCol.find({}).toArray();
    ctx.body = statsHistory;
  }
}

module.exports = new StatsController();
