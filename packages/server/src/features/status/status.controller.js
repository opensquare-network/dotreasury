const { getStatusCollection } = require("../../mongo");

class StatusController {
  async getStatus(ctx) {
    const { name } = ctx.params;

    const statusCol = await getStatusCollection();
    const status = await statusCol.findOne({ name });
    if (!status) {
      ctx.status = 404;
      return;
    }

    ctx.body = status.value;
  }
}

module.exports = new StatusController();
