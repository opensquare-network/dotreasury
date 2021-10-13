const { findBlockApi } = require("../../spec");

async function getReason(reasonHash, { blockHeight, blockHash }) {
  const blockApi = await findBlockApi(blockHash);
  let rawMeta;
  if (blockApi.query.treasury?.reasons) {
    rawMeta = await blockApi.query.treasury?.reasons(reasonHash);
  } else {
    rawMeta = await blockApi.query.tips.reasons(reasonHash);
  }

  return rawMeta.toHuman();
}

module.exports = {
  getReason,
}
