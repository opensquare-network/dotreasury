const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const BigNumber = require("bignumber.js");

async function queryTotalIssuance(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  const value = await blockApi.query.balances.totalIssuance();
  return value.toBigInt().toString()
}

async function queryInactiveIssuance(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (!blockApi.query.balances.inactiveIssuance) {
    return 0;
  }

  const issuance = await blockApi.query.balances.inactiveIssuance();
  return issuance.toBigInt().toString();
}

async function queryActiveIssuance(blockHash) {
  const total = await queryTotalIssuance(blockHash);
  const inactive = await queryInactiveIssuance(blockHash);
  return new BigNumber(total).minus(inactive).toString();
}

module.exports = {
  queryActiveIssuance,
}
