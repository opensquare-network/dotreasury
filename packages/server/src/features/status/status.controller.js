const { getStatusCollection } = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const statusCol = await getStatusCollection();
    const status = await statusCol.find({}).toArray();
    const result = {};
    status.forEach(item => {
      result[item.name] = item.value;
    })
    ctx.body = result;
  }
}

module.exports = new StatusController();
