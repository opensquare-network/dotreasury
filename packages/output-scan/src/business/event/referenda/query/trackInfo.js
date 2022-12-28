const { normalizeTrack } = require("../common/normalizeTrack");
const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function queryTrackInfo(trackId, blockHash, pallet = "referenda") {
  const blockApi = await findBlockApi(blockHash);
  const tracks = blockApi.consts[pallet].tracks.toJSON()
  const [, trackInfo] = tracks.find(([id]) => id === parseInt(trackId));
  return {
    id: trackId,
    ...normalizeTrack(trackInfo),
  };
}

module.exports = {
  queryTrackInfo,
}
