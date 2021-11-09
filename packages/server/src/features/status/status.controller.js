const { getStatusCollection } = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const { chain } = ctx.params;
    const statusCol = await getStatusCollection(chain);
    ctx.body = await statusCol.find({}).toArray();
  }
}

module.exports = new StatusController();
