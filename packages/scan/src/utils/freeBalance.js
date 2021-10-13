const { findDecorated, } = require("../mongo/service/specs");
const { TreasuryAccount } = require("./constants");

async function getBalance(api, metadata, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);

  if (decorated.query.system.account) {
    const accountInfo = await api.query.system.account.at(blockHash, TreasuryAccount);
    return accountInfo.data.free.toString();
  }

  const key = [decorated.query.balances.freeBalance, TreasuryAccount];
  const freeBalanceValue = await api.rpc.state.getStorage(key, blockHash);
  if (freeBalanceValue) {
    return freeBalanceValue.toJSON();
  }

  return null;
}

module.exports = {
  getTreasuryBalance: getBalance,
};
