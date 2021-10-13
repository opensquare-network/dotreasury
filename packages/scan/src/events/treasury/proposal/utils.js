const { findBlockApi } = require("../../../chain/spec");

async function getProposalMeta(blockHash, proposalIndex) {
  const blockApi = await findBlockApi(blockHash);
  const rawMeta = await blockApi.query.treasury.proposals(proposalIndex);
  return rawMeta.toJSON();
}

module.exports = {
  getProposalMeta,
};
