const BigNumber = require("bignumber.js");
const { getTreasuryOnHydration } = require("./treasuryOnHydration");
const {
  getFellowshipTreasuryDotOnAssetHub,
} = require("./fellowshipTreasuryOnAssetHub");
const {
  getFellowshipSalaryUsdtOnAssetHub,
} = require("./fellowshipSalaryOnAssetHub");
const {
  getTreasuryDotOnRelayChain,
  getBountyTreasuryOnRelayChain,
} = require("./treasuryOnRelay");
const { getMythTreasuryOnMythos } = require("./treasuryOnMythos");
const { getTreasuryOnAssetHub } = require("./treasuryOnAssetHub");

async function getPolkadotTreasuryData() {
  const treasuryDotOnRelay = await getTreasuryDotOnRelayChain();

  const bountyTreasuryOnRelay = await getBountyTreasuryOnRelayChain();

  const fellowshipTreasuryDotOnAssetHub =
    await getFellowshipTreasuryDotOnAssetHub();

  const fellowshipSalaryUsdtBalance = await getFellowshipSalaryUsdtOnAssetHub();

  const {
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
  } = await getTreasuryOnAssetHub();

  const mythTreasuryBalance = await getMythTreasuryOnMythos();

  const { hydrationTreasuryAccount1, hydrationTreasuryAccount2 } =
    await getTreasuryOnHydration();

  const {
    accountUsdt: hydrationAccount1Usdt,
    accountUsdc: hydrationAccount1Usdc,
    accountDot: hydrationAccount1Dot,
  } = hydrationTreasuryAccount1;

  const {
    accountUsdt: hydrationAccount2Usdt,
    accountUsdc: hydrationAccount2Usdc,
    accountDot: hydrationAccount2Dot,
  } = hydrationTreasuryAccount2;

  const dot = bountyTreasuryOnRelay
    .reduce((acc, item) => acc.plus(item.data.free || 0), new BigNumber(0))
    .plus(treasuryDotOnRelay?.data.free || 0)
    .plus(fellowshipTreasuryDotOnAssetHub?.data.free || 0)
    .plus(dotTreasuryBalanceOnAssetHub?.data.free || 0)
    .plus(hydrationAccount1Dot?.free || 0)
    .plus(hydrationAccount2Dot?.free || 0)
    .toFixed();

  const usdt = new BigNumber(fellowshipSalaryUsdtBalance?.balance || 0)
    .plus(usdtTreasuryBalanceOnAssetHub?.balance || 0)
    .plus(hydrationAccount1Usdt?.free || 0)
    .plus(hydrationAccount2Usdt?.free || 0)
    .toFixed();

  const usdc = new BigNumber(usdcTreasuryBalanceOnAssetHub?.balance || 0)
    .plus(hydrationAccount1Usdc?.free || 0)
    .plus(hydrationAccount2Usdc?.free || 0)
    .toFixed();

  const myth = new BigNumber(mythTreasuryBalance?.balance || 0).toFixed();

  return {
    dot,
    usdt,
    usdc,
    myth,
  };
}

module.exports = {
  getPolkadotTreasuryData,
};
