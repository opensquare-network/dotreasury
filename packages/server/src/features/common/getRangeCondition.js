const isEmpty = require("lodash.isempty");
const { HttpError } = require("../../exc");

function getRangeCondition(ctx) {
  const { range_type, min, max } = ctx.request.query;

  if (!range_type) {
    return {};
  }

  if (range_type !== "fiat") {
    throw new HttpError(400, `Invalid range_type: ${range_type}`);
  }

  const fiatValue = {};
  if (min) {
    fiatValue.$gte = Number(min);
  }
  if (max) {
    fiatValue.$lte = Number(max);
  }

  if (isEmpty(fiatValue)) {
    return {};
  }

  return { fiatValue };
}

module.exports = {
  getRangeCondition,
};
