const {
  findBlockApi,
  env: { currentChain, CHAINS }
} = require("@dotreasury/common");
const { KsmTreasuryAccount, DotTreasuryAccount } = require("../constants")

async function getBalance(blockHash) {
  const account = currentChain() === CHAINS.POLKADOT ? DotTreasuryAccount : KsmTreasuryAccount;
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.query.system?.account) {
    const accountInfo = await blockApi.query.system.account(account);
    return accountInfo.data.free.toString();
  }

  if (blockApi.query.balances.freeBalance) {
    const rawBalance = await blockApi.query.balances.freeBalance(account);
    if (rawBalance) {
      return rawBalance.toString()
    }
  }

  return null;
}

module.exports = {
  getTreasuryBalance: getBalance,
};
