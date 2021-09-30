const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../api");

async function getMotionVoting(motionHash, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  const key = [decorated.query.council.voting, motionHash];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, blockHash);
  return raw.toJSON();
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getMotionVoting(motionHash, { blockHash, blockHeight });
}

module.exports = {
  getVotingFromStorage: getMotionVoting,
  getVotingFromStorageByHeight,
  getMotionVoting,
};
