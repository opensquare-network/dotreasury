const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getBurnPercent(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  return blockApi.consts.treasury?.burn.toHuman()
}

module.exports = {
  getBurnPercent,
}
