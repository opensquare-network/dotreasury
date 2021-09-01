const { bnToBn } = require("@polkadot/util");
const { getWeeklyStatsCollection } = require("../../mongo");
const { getOverview } = require("../../websocket/store");

class StatsController {
  async getWeeklyStatsHistory(ctx) {
    const { chain } = ctx.params;
    const statsCol = await getWeeklyStatsCollection(chain);
    const statsHistory = await statsCol.find({}).toArray();
    ctx.body = statsHistory;
  }

  async getTreasuryInOut(ctx) {
    const { chain } = ctx.params;
    const overview = getOverview(chain);
    if (!overview) {
      ctx.body = {};
      return;
    }

    const income = overview.income;
    const incomeTotal = bnToBn(income.inflation ?? 0)
      .add(bnToBn(income.slash ?? 0))
      .add(bnToBn(income.transfer ?? 0))
      .add(bnToBn(income.others ?? 0))
      .toString();

    const output = overview.output;
    const outputTotal = bnToBn(output.proposal ?? 0)
      .add(bnToBn(output.tip ?? 0))
      .add(bnToBn(output.bounty ?? 0))
      .add(bnToBn(output.burnt ?? 0))
      .add(bnToBn(output.transfer ?? 0))
      .toString();

    ctx.body = {
      income: {...income, total: incomeTotal},
      output: {...output, total: outputTotal},
    };
  }
}

module.exports = new StatsController();
