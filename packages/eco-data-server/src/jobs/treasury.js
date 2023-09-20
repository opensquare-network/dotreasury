const { endpoints } = require("../apis/endpoints");
const { updateTreasuryBalance } = require("../apis/treasury");

async function updateChainsTreasuryBalance() {
  const chains = Object.keys(endpoints);
  try {
    const promises = [];
    for (const chain of chains) {
      promises.push(updateTreasuryBalance(chain));
    }
    await Promise.all(promises);
  } finally {
    setTimeout(updateChainsTreasuryBalance, 6 * 1000);
  }
}

module.exports = {
  updateChainsTreasuryBalance,
};
