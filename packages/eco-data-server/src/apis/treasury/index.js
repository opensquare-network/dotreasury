const { upsertChainTreasury } = require("../../mongo/service");
const { queryBifrostTreasuryBalance } = require("./bifrost");
const { queryChainTreasuryBalance } = require("./balance");
const { queryKintsugiTreasuryBalance } = require("./kintsugi");
const { getPolkadotTreasuryData } = require("./polkadot");
const { CHAINS } = require("../../consts");

async function updateTreasuryBalance(chain) {
  let balance;
  if (CHAINS.polkadot === chain) {
    balance = await getPolkadotTreasuryData();
  } else if (CHAINS.bifrost === chain) {
    balance = await queryBifrostTreasuryBalance();
  } else if ([CHAINS.interlay, CHAINS.kintsugi].includes(chain)) {
    balance = await queryKintsugiTreasuryBalance(chain);
  } else {
    balance = await queryChainTreasuryBalance(chain);
  }
  await upsertChainTreasury(chain, balance);
}

module.exports = {
  updateTreasuryBalance,
};
