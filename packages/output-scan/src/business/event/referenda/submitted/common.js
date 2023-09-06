const { gov2ReferendumState } = require("../common/state");
const { queryTrackInfo } = require("../query/trackInfo");
const { queryReferendumInfo } = require("../query/referendumInfo");
const { queryActiveIssuance } = require("../common/issuance");

async function getCommonData(referendumIndex, trackId, indexer) {
  const onChainInfo = await queryReferendumInfo(referendumIndex, indexer.blockHash);
  if (!onChainInfo?.ongoing) {
    throw new Error(`No referendum info found at ${ indexer.blockHeight }`);
  }

  const info = onChainInfo.ongoing;
  const { who: proposer } = info.submissionDeposit || {};
  const trackInfo = await queryTrackInfo(trackId, indexer.blockHash);
  const electorate = await queryActiveIssuance(indexer.blockHash);

  return {
    referendumIndex,
    trackId,
    proposer,
    info,
    trackInfo,
    indexer,
    state: {
      name: gov2ReferendumState.Submitted,
      indexer,
    },
    tally: {
      ...info.tally,
      electorate,
    },
    isFinal: false,
  }
}

module.exports = {
  getCommonData,
}
