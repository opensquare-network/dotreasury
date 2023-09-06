const { getStatusCollection, getOutputStatusCollection } = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const { chain } = ctx.params;
    const statusCol = await getStatusCollection(chain);
    const outputStatusCol = await getOutputStatusCollection(chain)
    const output = await outputStatusCol.find({}).toArray();
    const income = await statusCol.find({}).toArray();
    ctx.body = {
      income,
      output
    }
  }
}

module.exports = new StatusController();
