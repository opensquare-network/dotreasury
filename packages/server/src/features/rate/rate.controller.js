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
}

module.exports = new RateController();
