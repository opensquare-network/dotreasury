const { upsertChainTreasury } = require("../../../mongo/service");
const { getKusamaTreasuryData } = require(".");

async function updateKusamaTreasuryBalance() {
  const balance = await getKusamaTreasuryData();
  await upsertChainTreasury("kusama", balance);
}

module.exports = {
  updateKusamaTreasuryBalance,
};
