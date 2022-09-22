
const { getTermCouncilorCollection } = require("../../mongo");

async function statCouncilors(chain) {
  const termCouncilorCol = await getTermCouncilorCollection(chain);
  const councilors = await termCouncilorCol.distinct("address");

  return { councilors: new Set(councilors) };
}

module.exports = {
  statCouncilors,
};
