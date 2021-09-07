const { HttpError } = require("../../exc");
const rateService = require("../../services/rate.service");

class RateController {
  async rate(ctx) {
    const { data, address, signature } = ctx.request.body;
    if (!data) {
      throw new HttpError(400, "Data is missing");
    }

    if (!signature) {
      throw new HttpError(400, "Signature is missing");
    }

    ctx.body = await rateService.addRate(data, address, signature);
  }

  async setRateReaction(ctx) {
    const rateId = ctx.params.rateId;
    const { reaction } = ctx.request.body;
    const user = ctx.request.user;
    ctx.body = await rateService.setRateReaction(
      rateId,
      reaction,
      user
    );
  }

  async unsetRateReaction(ctx) {
    const rateId = ctx.params.rateId;
    const user = ctx.request.user;
    ctx.body = await rateService.unsetRateReaction(rateId, user);
  }
}

module.exports = new RateController();
