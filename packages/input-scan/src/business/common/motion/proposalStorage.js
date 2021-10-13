const { findBlockApi } = require("../../../chain/specs/blockApi");
const { normalizeCall } = require("./utils");
const {
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");
const { getApi } = require("../../../api");

async function getMotionProposal(blockHash, motionHash) {
  const blockApi = await findBlockApi(blockHash);
  return await blockApi.query.council.proposalOf(motionHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
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
