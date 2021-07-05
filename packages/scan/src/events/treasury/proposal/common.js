const { getProposalCollection } = require("../../../mongo");

async function updateProposalInDb(proposalIndex, updatesObj) {
  const proposalCol = await getProposalCollection();
  await proposalCol.findOneAndUpdate({ proposalIndex }, updatesObj);
}

module.exports = {
  updateProposalInDb,
};
