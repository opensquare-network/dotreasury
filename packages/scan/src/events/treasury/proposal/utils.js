const { expandMetadata } = require("@polkadot/types");

async function getProposalMeta(api, metadata, blockHash, proposalIndex) {
  const decorated = expandMetadata(metadata.registry, metadata);
  const key = [decorated.query.treasury.proposals, proposalIndex];
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

module.exports = {
  getProposalMeta,
};
