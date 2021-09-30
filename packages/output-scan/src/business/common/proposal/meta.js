const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../api");

async function getTreasuryProposalMeta(
  proposalIndex,
  { blockHeight, blockHash }
) {
  const decorated = await findDecorated(blockHeight);
  const key = [decorated.query.treasury.proposals, proposalIndex];

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
