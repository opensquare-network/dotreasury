const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getTreasuryProposalMeta(blockHash, proposalIndex) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
