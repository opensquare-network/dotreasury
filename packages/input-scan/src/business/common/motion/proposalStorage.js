const { normalizeCall } = require("./utils");
const { GenericCall } = require("@polkadot/types");
const {
  getApi, findBlockApi,
  specs: { findRegistry }
} = require("@dotreasury/common");

async function getMotionProposal(blockHash, motionHash) {
  const blockApi = await findBlockApi(blockHash);
  return await blockApi.query.council.proposalOf(motionHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer);
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
