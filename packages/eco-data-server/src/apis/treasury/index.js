const {
  upsertChainTreasury,
  upsertChainTreasuryWithDetail,
} = require("../../mongo/service");
const { queryBifrostTreasuryBalance } = require("./bifrost");
const { queryChainTreasuryBalance } = require("./balance");
const { queryKintsugiTreasuryBalance } = require("./kintsugi");
const { getPolkadotTreasuryData } = require("./polkadot");
const { CHAINS } = require("../../consts");

function getTreasuryBalancesArray(treasuryData) {
  return [
    {
      token: "DOT",
      decimals: 10,
      balance: treasuryData.dot,
    },
    { token: "USDt", decimals: 6, balance: treasuryData.usdt },
    { token: "USDC", decimals: 6, balance: treasuryData.usdc },
    {
      token: "MYTH",
      decimals: 18,
      balance: treasuryData.myth,
    },
  ];
}

async function updatePolkadotTreasuryBalance() {
  const balance = await queryChainTreasuryBalance(CHAINS.polkadot);
  const treasuryData = await getPolkadotTreasuryData();
  const balances = getTreasuryBalancesArray(treasuryData);
  await upsertChainTreasuryWithDetail(CHAINS.polkadot, balance, balances);
}

async function updateTreasuryBalance(chain) {
  if (CHAINS.polkadot === chain) {
    await updatePolkadotTreasuryBalance();
    return;
  }

  let balance;
  if (CHAINS.bifrost === chain) {
    balance = await queryBifrostTreasuryBalance();
  } else if ([CHAINS.interlay, CHAINS.kintsugi].includes(chain)) {
    balance = await queryKintsugiTreasuryBalance(chain);
  } else {
    balance = await queryChainTreasuryBalance(chain);
  }
  await upsertChainTreasury(chain, balance);
}

module.exports = {
  getTreasuryBalancesArray,
  updateTreasuryBalance,
};
