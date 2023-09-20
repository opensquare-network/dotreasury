const { u8aConcat } = require("@polkadot/util");
const { getApis } = require("@osn/polkadot-api-container");
const { upsertChainTreasury } = require("../mongo/service");
const { CHAINS } = require("./endpoints");
const { Kintsugi, Interlay } = require("@interlay/monetary-js");

const EMPTY_U8A_32 = new Uint8Array(32);

function getAccount(api, chain) {
  if (CHAINS.interlay === chain) {
    return "wd9yNSwR7YL4Y4PEtY4pUxYR2jeVdsgwyoN8fwVc9196VMAt4";
  } else if (CHAINS.kintsugi === chain) {
    return "a3cgeH7D28bBsHY4hGLzxkMFUcFQmjGgDa2kmxg3D9Z6AyhtL";
  }

  return u8aConcat(
    "modl",
    api?.consts.treasury && api.consts.treasury.palletId
      ? api.consts.treasury.palletId.toU8a(true)
      : "py/trsry",
    EMPTY_U8A_32,
  ).subarray(0, 32);
}

async function queryKintsugiBalance(api, chain) {
  const token = CHAINS.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;
  const accountData = await api.query.tokens.accounts(getAccount(api, chain), { token });
  return accountData ? accountData.free.toString() : "0";
}

async function queryBalanceFromApi(api, chain) {
  if ([CHAINS.interlay, CHAINS.kintsugi].includes(chain)) {
    return await queryKintsugiBalance(api, chain);
  }
  const accountData = await api?.query.system.account(getAccount(api, chain));
  return accountData ? accountData.data.free.toString() : "0";
}

async function updateTreasuryBalance(chain) {
  const promises = [];
  const apis = getApis(chain);
  for (const api of apis) {
    promises.push(queryBalanceFromApi(api, chain));
  }

  const balance = await Promise.any(promises);
  await upsertChainTreasury(chain, balance);
}

module.exports = {
  updateTreasuryBalance,
}
