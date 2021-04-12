const { getStatusCollection } = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const { chain } = ctx.params;
    const statusCol = await getStatusCollection(chain);
    const status = await statusCol.find({}).toArray();
    const result = {};
    status.forEach(item => {
      result[item.name] = item.value;
    })
    ctx.body = result;
  }
}

module.exports = new StatusController();
