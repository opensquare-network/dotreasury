const { HttpError } = require("../../exc");
const { QueryFieldsMap } = require("./query");

function getRangeCondition(ctx) {
  const { range_type, min, max } = ctx.request.query;

  const condition = {}

  if (range_type) {
    const fieldName = QueryFieldsMap[range_type];
    if (!fieldName) {
      throw new HttpError(400, `Invalid range_type: ${range_type}`);
    }
    condition[fieldName] = {};
    if (min) {
      condition[fieldName]["$gte"] = Number(min);
    }
    if (max) {
      condition[fieldName]["$lte"] = Number(max);
    }
  }

  return condition;
}

module.exports = {
  getRangeCondition,
};
