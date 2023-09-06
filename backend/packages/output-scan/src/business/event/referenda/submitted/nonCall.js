const { insertReferendaPendingReferendum } = require("../../../../mongo/service");
const { getCommonData } = require("./common");

async function handlePendingReferendum(referendumIndex, trackId, proposalHash, indexer) {
  const commonData = await getCommonData(referendumIndex, trackId, indexer);

  await insertReferendaPendingReferendum({
    ...commonData,
    proposalHash,
  });
}

module.exports = {
  handlePendingReferendum,
}
