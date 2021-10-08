const { currentChain, CHAINS, } = require("../../../env");
const { findDecorated } = require("../../../chain/specs");
const { KsmTreasuryAccount, DotTreasuryAccount } = require("../constants")
const { getApi } = require("../../../api")

async function getBalance({ blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);

  const api = await getApi();
  const account = currentChain() === CHAINS.POLKADOT ? DotTreasuryAccount : KsmTreasuryAccount;
  if (decorated.query.system.account) {
    const key = [decorated.query.system.account, account];
    const systemValue = await api.rpc.state.getStorage(key, blockHash);
    if (systemValue) {
      return systemValue.data.free.toString();
    }
  }

  const key = [decorated.query.balances.freeBalance, account];
  const freeBalanceValue = await api.rpc.state.getStorage(key, blockHash);
  if (freeBalanceValue) {
    return freeBalanceValue.toString();
  }

  return null;
}

module.exports = {
  getTreasuryBalance: getBalance,
};
