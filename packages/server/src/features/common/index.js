const { fromUint } = require("../../utils");

async function updateFiatValues(col) {
  const items = await col.find({ fiatValue: null, tokenValue: { $ne: null }, symbolPrice: { $ne: null } }).toArray();
  if (!items.length) {
    return;
  }
  const bulk = col.initializeUnorderedBulkOp();
  for (const item of items) {
    const fiatValue = fromUint(item.tokenValue).multipliedBy(item.symbolPrice || 0).toString();
    bulk.find({ _id: item._id }).updateOne({
      $set: {
        fiatValue: Decimal128.fromString(fiatValue),
      }
    });
  }
  await bulk.execute();
}

module.exports = {
  updateFiatValues,
};
