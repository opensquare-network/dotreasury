const { getStateFromGov2ReferendumState } = require("./getState");
const { queryReferendumInfo } = require("../query/referendumInfo");
const { logger } = require("@osn/scan-common");

async function getOngoingUpdates(referendumIndex, indexer) {
  const onChainInfo = await queryReferendumInfo(referendumIndex, indexer.blockHash);
  if (!onChainInfo?.ongoing) {
    logger.error(`No referendum info found at ${ indexer.blockHeight }`);
    return
  }

  const stateName = getStateFromGov2ReferendumState(onChainInfo.ongoing, indexer);
  const updates = { info: onChainInfo.ongoing };
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
