const { endpoints } = require("../apis/endpoints");
const { queryTreasuryBalance } = require("../apis/treasury");

async function updateTreasuryBalance() {
  const chains = Object.keys(endpoints);
  try {
    const promises = [];
    for (const chain of chains) {
      promises.push(queryTreasuryBalance(chain));
    }
    await Promise.all(promises);
  } finally {
    setTimeout(updateTreasuryBalance, 6 * 1000);
  }
}

module.exports = {
  updateTreasuryBalance,
}
