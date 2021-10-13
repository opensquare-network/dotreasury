const { findBlockApi } = require("../chain/spec");
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

async function getTreasuryBalanceV2(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.query.system?.account) {
    const accountInfo = await blockApi.query.system.account(TreasuryAccount);
    return accountInfo.data.free.toString();
  }

  if (blockApi.query.balances.freeBalance) {
    const rawBalance = await blockApi.query.balances.freeBalance(TreasuryAccount);
    if (rawBalance) {
      return rawBalance.toString()
    }
  }

  return null;
}

module.exports = {
  getTreasuryBalance: getBalance,
  getTreasuryBalanceV2,
};
