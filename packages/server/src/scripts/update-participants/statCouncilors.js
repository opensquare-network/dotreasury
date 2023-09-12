const { getTermCouncilorCollection } = require("../../mongo");

async function statCouncilors() {
  const termCouncilorCol = await getTermCouncilorCollection();
  const councilors = await termCouncilorCol.distinct("address");

  return { councilors: new Set(councilors) };
}

module.exports = {
  statCouncilors,
};
