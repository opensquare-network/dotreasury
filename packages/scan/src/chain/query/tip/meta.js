const { findBlockApi } = require("../../spec");

async function getTipMeta(tipHash, { blockHeight, blockHash }) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.tips) {
    rawMeta = await blockApi.query.treasury?.tips(tipHash);
  } else {
    rawMeta = await blockApi.query.tips.tips(tipHash);
  }

  return rawMeta.toJSON();
}

module.exports = {
  getTipMeta,
}
