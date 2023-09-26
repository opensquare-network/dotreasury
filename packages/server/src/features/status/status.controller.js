const {
  getStatusCollection,
  getOutputStatusCollection,
} = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const statusCol = await getStatusCollection();
    const outputStatusCol = await getOutputStatusCollection();
    const output = await outputStatusCol.find({}).toArray();
    const income = await statusCol.find({}).toArray();
    ctx.body = {
      income,
      output,
    };
  }
}

module.exports = new StatusController();
