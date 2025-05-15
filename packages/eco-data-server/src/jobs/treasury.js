const { updateTreasuryBalance } = require("../apis/treasury");
const { CHAINS } = require("../consts");

async function updateChainsTreasuryBalance() {
  const chains = Object.keys(CHAINS);
  try {
    const promises = [];
    for (const chain of chains) {
      promises.push(updateTreasuryBalance(chain));
    }
    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating chains treasury balance:", error);
  } finally {
    setTimeout(updateChainsTreasuryBalance, 6 * 1000);
  }
}

module.exports = {
  updateChainsTreasuryBalance,
};
