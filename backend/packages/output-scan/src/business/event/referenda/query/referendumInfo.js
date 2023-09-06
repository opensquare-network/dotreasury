const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function queryReferendumInfo(referendumIndex, blockHash, pallet = "referenda") {
  const blockApi = await findBlockApi(blockHash);
  const rawInfo = await blockApi.query[pallet].referendumInfoFor(referendumIndex);
  return rawInfo.toJSON();
}

module.exports = {
  queryReferendumInfo,
}
