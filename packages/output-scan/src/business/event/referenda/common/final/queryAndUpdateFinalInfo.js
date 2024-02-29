const { getBlockHash } = require("../../../../common");
const { updateReferendaReferendum } = require("../../../../../mongo/service/referendaReferendum");
const { queryTrackInfo } = require("../../query/trackInfo");
const { getReferendaReferendumCol, getReferendaReferendumTimelineCol } = require("../../../../../mongo");
const { queryReferendumInfo } = require("../../query/referendumInfo");
const { gov2ReferendumState } = require("../state");
const { stringLowerFirst } = require("@polkadot/util");
const { queryActiveIssuance } = require("../issuance");

const possibleKeys = [
  gov2ReferendumState.Cancelled,
  gov2ReferendumState.Approved,
  gov2ReferendumState.Killed,
  gov2ReferendumState.TimedOut,
  gov2ReferendumState.Rejected,
];

async function getTrackInfo(indexer, referendumIndex) {
  const referendumCol = await getReferendaReferendumCol();
  const referendum = await referendumCol.findOne({ referendumIndex, isFinal: false });
  if (!referendum) {
    return null;
  }

  return await queryTrackInfo(referendum.trackId, indexer.blockHash);
}

async function queryAndUpdateFinalInfo(event, indexer, stateKey) {
  const referendumIndex = event.data[0].toNumber();
  const tally = event.data[1].toJSON();

  if (!possibleKeys.includes(stateKey)) {
    throw new Error(`Invalid stateKey when update referenda ${ referendumIndex } final info`);
  }

  const infoKey = stringLowerFirst(stateKey);
  const onChainInfo = await queryReferendumInfo(referendumIndex, indexer.blockHash);
  if (!onChainInfo || !onChainInfo[infoKey]) {
    throw new Error(`No referendum ${ infoKey } info found at ${ indexer.blockHeight } when referendum ${ referendumIndex } ${ infoKey }`);
  }

  let updates = {};
  const preBlockHash = await getBlockHash(indexer.blockHeight - 1);
  const preBlockOnChainInfo = await queryReferendumInfo(referendumIndex, preBlockHash);
  if (preBlockOnChainInfo?.ongoing) {
    updates = { ...updates, info: preBlockOnChainInfo.ongoing }
  }

  // We save the track info when referendum finished, because the track's parameters maybe changed afterward.
  const trackInfo = await getTrackInfo(indexer, referendumIndex);
  const electorate = await queryActiveIssuance(indexer.blockHash);
  await updateReferendaReferendum(referendumIndex, {
    ...updates,
    [infoKey]: onChainInfo[infoKey],
    state: {
      name: stateKey,
      indexer,
      args: { tally }
    },
    tally: {
      ...tally,
      electorate,
    },
    trackInfo,
    isFinal: true,
  })

  const timelineCol = await getReferendaReferendumTimelineCol();
  await timelineCol.insertOne({
    referendumIndex,
    indexer,
    name: event.method,
    args: {
      tally,
    },
  });
}

module.exports = {
  queryAndUpdateFinalInfo,
  getTrackInfo,
}
