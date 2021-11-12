const { findBlockApi } = require("../../../chain/specs/blockApi");

async function getBurnPercent(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  return blockApi.consts.treasury?.burn.toHuman()
}

module.exports = {
  getBurnPercent,
}
