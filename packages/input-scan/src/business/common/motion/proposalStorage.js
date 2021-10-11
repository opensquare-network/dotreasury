const { normalizeCall } = require("./utils");
const {
  findDecorated,
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");
const { getApi } = require("../../../api");

async function getMotionProposal(motionHash, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  const key = [decorated.query.council.proposalOf, motionHash];

  const api = await getApi();
  return api.rpc.state.getStorage(key, blockHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(motionHash, indexer);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

async function getMotionProposalByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

  return await getMotionProposalCall(motionHash, {
    blockHeight,
    blockHash
  })
}

module.exports = {
  getMotionProposal,
  getMotionProposalCall,
  getMotionProposalByHeight,
};
