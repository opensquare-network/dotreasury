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
const {
  loansCentrifugeUsdcBalance,
  loansBifrostDotBalance,
  loansPendulumDotBalance,
  loansHydrationDotBalance,
} = require("./loans");
const {
  getAmbassadorTreasuryOnAssetHub,
} = require("./ambassadorTreasuryOnAssetHub");

function calcTotalBalance({
  treasuryDotOnRelay,
  bountyTreasuryOnRelay,
  fellowshipTreasuryDotOnAssetHub,
  fellowshipSalaryUsdtBalance,
  ambassadorTreasuryUsdtBalance,
  dotTreasuryBalanceOnAssetHub,
  usdtTreasuryBalanceOnAssetHub,
  usdcTreasuryBalanceOnAssetHub,
  mythTreasuryBalance,
  hydrationTreasuryAccount1,
  hydrationTreasuryAccount2,
  hydrationTreasuryAccount3,
  hydrationTreasuryAccount4,
}) {
  const {
    accountUsdt: hydrationAccount1Usdt,
    accountUsdc: hydrationAccount1Usdc,
    accountDot: hydrationAccount1Dot,
    accountADot: hydrationAccount1ADot,
  } = hydrationTreasuryAccount1;

  const {
    accountUsdt: hydrationAccount2Usdt,
    accountUsdc: hydrationAccount2Usdc,
    accountDot: hydrationAccount2Dot,
    accountADot: hydrationAccount2ADot,
  } = hydrationTreasuryAccount2;

  const {
    accountUsdt: hydrationAccount3Usdt,
    accountUsdc: hydrationAccount3Usdc,
    accountDot: hydrationAccount3Dot,
    accountADot: hydrationAccount3ADot,
  } = hydrationTreasuryAccount3;

  const {
    accountUsdt: hydrationAccount4Usdt,
    accountUsdc: hydrationAccount4Usdc,
    accountDot: hydrationAccount4Dot,
    accountADot: hydrationAccount4ADot,
  } = hydrationTreasuryAccount4;

  const getTotal = (balance) =>
    new BigNumber(balance?.free || 0).plus(balance?.reserved || 0);

  const dot = bountyTreasuryOnRelay
    .reduce((acc, item) => acc.plus(item.data.free || 0), new BigNumber(0))
    .plus(treasuryDotOnRelay?.data.free || 0)
    .plus(fellowshipTreasuryDotOnAssetHub?.data.free || 0)
    .plus(dotTreasuryBalanceOnAssetHub?.data.free || 0)
    .plus(getTotal(hydrationAccount1Dot))
    .plus(getTotal(hydrationAccount1ADot))
    .plus(getTotal(hydrationAccount2Dot))
    .plus(getTotal(hydrationAccount2ADot))
    .plus(getTotal(hydrationAccount3Dot))
    .plus(getTotal(hydrationAccount3ADot))
    .plus(getTotal(hydrationAccount4Dot))
    .plus(getTotal(hydrationAccount4ADot))
    .plus(loansBifrostDotBalance || 0)
    .plus(loansPendulumDotBalance || 0)
    .plus(loansHydrationDotBalance || 0)
    .toFixed();

  const usdt = new BigNumber(fellowshipSalaryUsdtBalance?.balance || 0)
    .plus(usdtTreasuryBalanceOnAssetHub?.balance || 0)
    .plus(ambassadorTreasuryUsdtBalance?.balance || 0)
    .plus(getTotal(hydrationAccount1Usdt))
    .plus(getTotal(hydrationAccount2Usdt))
    .plus(getTotal(hydrationAccount3Usdt))
    .plus(getTotal(hydrationAccount4Usdt))
    .toFixed();

  const usdc = new BigNumber(usdcTreasuryBalanceOnAssetHub?.balance || 0)
    .plus(getTotal(hydrationAccount1Usdc))
    .plus(getTotal(hydrationAccount2Usdc))
    .plus(getTotal(hydrationAccount3Usdc))
    .plus(getTotal(hydrationAccount4Usdc))
    .plus(loansCentrifugeUsdcBalance || 0)
    .toFixed();

  const myth = new BigNumber(mythTreasuryBalance?.balance || 0).toFixed();

  return {
    dot,
    usdt,
    usdc,
    myth,
  };
}

async function getPolkadotTreasuryData() {
  const treasuryDotOnRelay = await getTreasuryDotOnRelayChain();

  const bountyTreasuryOnRelay = await getBountyTreasuryOnRelayChain();

  const fellowshipTreasuryDotOnAssetHub =
    await getFellowshipTreasuryDotOnAssetHub();

  const fellowshipSalaryUsdtBalance = await getFellowshipSalaryUsdtOnAssetHub();

  const ambassadorTreasuryUsdtBalance = await getAmbassadorTreasuryOnAssetHub();

  const {
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
  } = await getTreasuryOnAssetHub();

  const mythTreasuryBalance = await getMythTreasuryOnMythos();

  const {
    hydrationTreasuryAccount1,
    hydrationTreasuryAccount2,
    hydrationTreasuryAccount3,
    hydrationTreasuryAccount4,
  } = await getTreasuryOnHydration();

  return calcTotalBalance({
    treasuryDotOnRelay,
    bountyTreasuryOnRelay,
    fellowshipTreasuryDotOnAssetHub,
    fellowshipSalaryUsdtBalance,
    ambassadorTreasuryUsdtBalance,
    dotTreasuryBalanceOnAssetHub,
    usdtTreasuryBalanceOnAssetHub,
    usdcTreasuryBalanceOnAssetHub,
    mythTreasuryBalance,
    hydrationTreasuryAccount1,
    hydrationTreasuryAccount2,
    hydrationTreasuryAccount3,
    hydrationTreasuryAccount4,
  });
}

module.exports = {
  calcTotalBalance,
  getPolkadotTreasuryData,
};
