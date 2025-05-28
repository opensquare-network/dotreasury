const { getTreasuryHistoryCol } = require("../../mongo");

async function treasuryHistory(_, _args) {
  const { chain } = _args;
  const col = await getTreasuryHistoryCol();
  const q = {};
  if (chain) {
    Object.assign(q, { chain });
  }

  return await col
    .find(q, { projection: { _id: 0 } })
    .sort({ date: -1 })
    .limit(30)
    .toArray();
}

module.exports = {
  treasuryHistory,
};
