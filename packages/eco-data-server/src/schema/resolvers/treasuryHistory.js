const { getTreasuryHistoryCol } = require("../../mongo");

async function normalizeTreasury(treasury) {
  return {
    ...treasury,
    balanceUpdateAt: treasury.balanceUpdateAt.getTime(),
  };
}

async function treasuryHistory(_, _args) {
  const { chain } = _args;
  const col = await getTreasuryHistoryCol();
  const q = {};
  if (chain) {
    Object.assign(q, { chain });
  }

  const treasuryHistory = await col
    .find(q, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .limit(30)
    .toArray();

  return await Promise.all(
    treasuryHistory.map(async (treasury) => normalizeTreasury(treasury)),
  );
}

module.exports = {
  treasuryHistory,
};
