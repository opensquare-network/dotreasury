const { upsertChainTreasury } = require("../../mongo/service");
const { queryBifrostTreasuryBalance } = require("./bifrost");
const { queryChainTreasuryBalance } = require("./balance");
const { CHAINS } = require("../../consts");
const {
  updatePolkadotTreasuryBalance,
} = require("./polkadot/updatePolkadotTreasuryBalance");
const {
  updateKusamaTreasuryBalance,
} = require("./kusama/updateKusamaTreasuryBalance");

async function updateTreasuryBalance(chain) {
  if (CHAINS.polkadot === chain) {
    await updatePolkadotTreasuryBalance();
    return;
  }

  if (CHAINS.kusama === chain) {
    await updateKusamaTreasuryBalance();
    return;
  }

  let balance;
  if (CHAINS.bifrost === chain) {
    balance = await queryBifrostTreasuryBalance();
  } else {
    balance = await queryChainTreasuryBalance(chain);
  }
  await upsertChainTreasury(chain, balance);
}

module.exports = {
  updateTreasuryBalance,
};
