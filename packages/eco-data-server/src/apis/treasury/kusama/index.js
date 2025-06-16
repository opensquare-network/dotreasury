const BigNumber = require("bignumber.js");
const { getTreasuryKsmOnRelayChain } = require("./treasuryOnRelay");
const { getTreasuryKsmOnAssetHub } = require("./treasuryOnAssethub");
const { loansHydrationKsmBalance } = require("./loans");

function calcTotalBalance({
  treasuryKsmOnRelay,
  treasuryKsmOnAssetHub,
  loansHydrationKsmBalance,
}) {
  return new BigNumber(treasuryKsmOnRelay?.data.free || 0)
    .plus(treasuryKsmOnAssetHub?.data.free || 0)
    .plus(loansHydrationKsmBalance)
    .toFixed();
}

async function getKusamaTreasuryData() {
  const treasuryKsmOnRelay = await getTreasuryKsmOnRelayChain();
  const treasuryKsmOnAssetHub = await getTreasuryKsmOnAssetHub();

  return calcTotalBalance({
    treasuryKsmOnRelay,
    treasuryKsmOnAssetHub,
    loansHydrationKsmBalance,
  });
}

module.exports = {
  calcTotalBalance,
  getKusamaTreasuryData,
};
