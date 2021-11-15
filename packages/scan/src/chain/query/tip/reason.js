const { findBlockApi } = require("../../spec");
const { isHex, hexToString } = require("@polkadot/util");

async function getReason(reasonHash, { blockHeight, blockHash }) {
  const blockApi = await findBlockApi(blockHash);
  let rawMeta;
  if (blockApi.query.treasury?.reasons) {
    rawMeta = await blockApi.query.treasury?.reasons(reasonHash);
  } else {
    rawMeta = await blockApi.query.tips.reasons(reasonHash);
  }

  const maybeTxt = rawMeta.toHuman();
  if (isHex(maybeTxt)) {
    return hexToString(maybeTxt);
  } else {
    return maybeTxt;
  }
}

module.exports = {
  getReason,
}
