const { bnToBn } = require("@polkadot/util");
const {
  getInputWeeklyStatsCollection,
  getOutputWeeklyStatsCollection,
} = require("../../mongo");
const { getOverview } = require("../../websocket/store");

class StatsController {
  async getWeeklyStatsHistory(ctx) {
    const { chain } = ctx.params;
    const inputWeeklyStatsCol = await getInputWeeklyStatsCollection(chain);
    const outputWeeklyStatsCol = await getOutputWeeklyStatsCollection(chain);

    const inputWeeklyStats = await inputWeeklyStatsCol.find({}).toArray();
    const outputWeeklyStats = await outputWeeklyStatsCol.find({}).toArray();

    // Merge result
    const result = [];
    for (let i = 0, o = 0; i < inputWeeklyStats.length && o < outputWeeklyStats.length;) {
      const input = inputWeeklyStats[i];
      const output =  outputWeeklyStats[o];
      if (input.indexer.blockHeight === output.indexer.blockHeight) {
        result.push({
          ...input,
          ...output,
        });

        i++;
        o++;
      } else if (input.indexer.blockHeight < output.indexer.blockHeight) {
        i++;
      } else if (input.indexer.blockHeight > output.indexer.blockHeight) {
        o++;
      } else {
        // Impossible to go here
      }
    }

    ctx.body = result;
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
