const { getStateFromGov2ReferendumState } = require("./getState");
const { queryReferendumInfo } = require("../query/referendumInfo");
const { logger } = require("@osn/scan-common");
const { queryActiveIssuance } = require("./issuance");

async function getOngoingUpdates(referendumIndex, indexer) {
  const onChainInfo = await queryReferendumInfo(referendumIndex, indexer.blockHash);
  if (!onChainInfo?.ongoing) {
    logger.error(`No referendum info found at ${ indexer.blockHeight }`);
    return
  }

  const ongoing = onChainInfo.ongoing;
  const stateName = getStateFromGov2ReferendumState(ongoing, indexer);
  const electorate = await queryActiveIssuance(indexer.blockHash);
  const updates = {
    info: ongoing,
    tally: {
      ...ongoing.tally,
      electorate,
    },
  };
  if (stateName) {
    Object.assign(updates, {
      state: { name: stateName, indexer }
    });
  }

  return updates;
}

module.exports = {
  getOngoingUpdates,
}
