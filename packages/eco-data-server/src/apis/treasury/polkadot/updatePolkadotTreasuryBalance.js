const { upsertChainTreasuryWithDetail } = require("../../../mongo/service");
const { queryChainTreasuryBalance } = require("../balance");
const { getPolkadotTreasuryData } = require(".");
const { CHAINS } = require("../../../consts");

function getTreasuryBalancesArray(treasuryData) {
  return [
    {
      token: "DOT",
      decimals: 10,
      balance: treasuryData.dot,
    },
    { token: "USDt", decimals: 6, balance: treasuryData.usdt },
    { token: "USDC", decimals: 6, balance: treasuryData.usdc },
  ];
}

async function updatePolkadotTreasuryBalance() {
  const balance = await queryChainTreasuryBalance(CHAINS.polkadot);
  const treasuryData = await getPolkadotTreasuryData();
  const balances = getTreasuryBalancesArray(treasuryData);
  await upsertChainTreasuryWithDetail(CHAINS.polkadot, balance, balances);
}

module.exports = {
  updatePolkadotTreasuryBalance,
};
