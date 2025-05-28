const zip = require("lodash.zip");
const { updateTreasuryBalance } = require("../apis/treasury");
const { CHAINS } = require("../consts");

async function updateChainsTreasuryBalance() {
  const chains = Object.keys(CHAINS);
  try {
    const promises = [];
    for (const chain of chains) {
      promises.push(updateTreasuryBalance(chain));
    }
    const result = await Promise.allSettled(promises);
    const errors = zip(result, chains)
      .filter(([res]) => res.status === "rejected")
      .map(([, chain]) => chain);
    if (errors.length) {
      console.error("Failed to update treasury balance for chains:", errors);
    }
  } finally {
    setTimeout(updateChainsTreasuryBalance, 6 * 1000);
  }
}

module.exports = {
  updateChainsTreasuryBalance,
};
