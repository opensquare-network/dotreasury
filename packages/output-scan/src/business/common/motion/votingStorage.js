const { getApi, findBlockApi } = require("@dotreasury/common");

async function getMotionVoting(blockHash, motionHash) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.council.voting(motionHash);
  return raw.toJSON();
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getMotionVoting(blockHash, motionHash);
}

module.exports = {
  getVotingFromStorage: getMotionVoting,
  getVotingFromStorageByHeight,
  getMotionVoting,
};
