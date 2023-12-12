const { CHAINS } = require("../endpoints");
const { Kintsugi, Interlay } = require("@interlay/monetary-js");
const {
  utils: { bigAdd },
} = require("@osn/scan-common");
const { getApis } = require("@osn/polkadot-api-container");

const treasuryAccounts = [
  "wd9yNSwR5jsJWJoLHrMKt4K2T7R5392YmZoRdpqijnpLGzEcT", // modlmod/trsy
  "wd9yNSwR5jsJWJmaV4ccaRqdxXFTJUS4shu7RMuSVk3c5F3f4", // modlmod/supl
  "wd9yNSwR7YL4Y4PEtY4pUxYR2jeVdsgwyoN8fwVc9196VMAt4", // modlvlt/annu
  "wd9yNSwR495PKYxKfdeuMcNyu6kqay7wKeWcLMvQ8muuWVPYj", // modlesc/annu
];

async function queryKintsugiAccountBalance(api, chain, account) {
  const token = CHAINS.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;
  const accountData = await api.query.tokens.accounts(account, { token });
  return accountData ? accountData.free.toString() : "0";
}

async function queryKintsugiFromApi(api, chain) {
  let balance = 0;
  for (const account of treasuryAccounts) {
    const accountBalance = await queryKintsugiAccountBalance(api, chain, account);
    balance = bigAdd(balance, accountBalance);
  }
  return balance;
}

async function queryKintsugiTreasuryBalance(chain) {
  const apis = getApis(chain);
  const promises = [];
  for (const api of apis) {
    promises.push(queryKintsugiFromApi(api, chain));
  }

  return await Promise.any(promises);
}

module.exports = {
  queryKintsugiTreasuryBalance,
}
