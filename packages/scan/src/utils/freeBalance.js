const { TreasuryAccount } = require("./constants");
const { expandMetadata } = require("@polkadot/types");

async function getBalance(api, metadata, blockHash) {
  const decorated = expandMetadata(metadata.registry, metadata);

  if (decorated.query.system.account) {
    const key = [decorated.query.system.account, TreasuryAccount];
    const systemValue = await api.rpc.state.getStorage(key, blockHash);
    if (systemValue) {
      return systemValue.data.free.toJSON();
    }
  }

  const key = [decorated.query.balances.freeBalance, TreasuryAccount];
  const freeBalanceValue = await api.rpc.state.getStorage(key, blockHash);
  if (freeBalanceValue) {
    return freeBalanceValue.toJSON();
  }

  return 0;
}

module.exports = {
  getBalance,
};
