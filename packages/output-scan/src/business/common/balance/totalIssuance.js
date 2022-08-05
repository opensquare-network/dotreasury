const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function getTotalIssuance(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.balances.totalIssuance();
  return raw.toBigInt().toString();
}

module.exports = {
  getTotalIssuance,
}
