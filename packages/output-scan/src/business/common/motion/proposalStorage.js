const { findBlockApi } = require("@dotreasury/common");
const { normalizeCall } = require("./utils");
const {
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(blockHash, motionHash) {
  const blockApi = await findBlockApi(blockHash);
  return await blockApi.query.council.proposalOf(motionHash);
}

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionCall,
  getMotionProposalCall,
};
