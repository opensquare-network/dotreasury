const { getAccount } = require("./account");
const { getApis } = require("@osn/polkadot-api-container");

async function queryBalanceFromApi(api) {
  const accountData = await api?.query.system.account(getAccount(api));
  return accountData ? accountData.data.free.toString() : "0";
}

async function queryChainTreasuryBalance(chain) {
  const promises = [];
  const apis = getApis(chain);
  for (const api of apis) {
    promises.push(queryBalanceFromApi(api));
  }

  return await Promise.any(promises);
}

module.exports = {
  queryChainTreasuryBalance,
}
