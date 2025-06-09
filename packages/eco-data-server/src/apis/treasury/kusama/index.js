const BigNumber = require("bignumber.js");
const { getTreasuryKsmOnRelayChain } = require("./treasuryOnRelay");

function calcTotalBalance({ treasuryKsmOnRelay }) {
  return new BigNumber(treasuryKsmOnRelay?.data.free || 0).toFixed();
}

async function getKusamaTreasuryData() {
  const treasuryKsmOnRelay = await getTreasuryKsmOnRelayChain();

  return calcTotalBalance({
    treasuryKsmOnRelay,
    //TODO: Add KSM on Asset hub
    //TODO: Add Loans KSM on Hydration
  });
}

module.exports = {
  calcTotalBalance,
  getKusamaTreasuryData,
};
