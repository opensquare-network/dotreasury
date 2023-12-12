const { queryChainTreasuryBalance } = require("./balance");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");

async function queryBifrostTreasuryBalance() {
  const balanceOnKusama = await queryChainTreasuryBalance("bifrostKusama");
  const balanceOnPolkadot = await queryChainTreasuryBalance("bifrostPolkadot");
  return bigAdd(balanceOnKusama, balanceOnPolkadot);
}

module.exports = {
  queryBifrostTreasuryBalance,
}
