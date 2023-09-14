const { u8aConcat } = require("@polkadot/util");
const { getApis } = require("@osn/polkadot-api-container");
const { upsertChainTreasury } = require("../mongo/service");

const EMPTY_U8A_32 = new Uint8Array(32);

function getAccount(api) {
  return u8aConcat(
    "modl",
    api?.consts.treasury && api.consts.treasury.palletId
      ? api.consts.treasury.palletId.toU8a(true)
      : "py/trsry",
    EMPTY_U8A_32,
  ).subarray(0, 32);
}

async function queryBalanceFromApi(api) {
  const accountData = await api?.query.system.account(getAccount(api));
  return accountData ? accountData.data.free.toString() : "0";
}

async function updateTreasuryBalance(chain) {
  const promises = [];
  const apis = getApis(chain);
  for (const api of apis) {
    promises.push(queryBalanceFromApi(api));
  }

  const balance = await Promise.any(promises);
  await upsertChainTreasury(chain, balance);
}

module.exports = {
  updateTreasuryBalance,
}
