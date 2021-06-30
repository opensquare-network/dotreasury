const { getBountyCollection } = require("../../../mongo");

async function updateBountyInDb(bountyIndex, updatesObj) {
  const bountyCol = await getBountyCollection();
  await bountyCol.findOneAndUpdate({ bountyIndex }, updatesObj);
}

module.exports = {
  updateBountyInDb,
};
