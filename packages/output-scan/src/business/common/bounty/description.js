const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getBountyDescription(blockHash, bountyIndex) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.bountyDescriptions) {
    rawMeta = await blockApi.query.treasury?.bountyDescriptions(bountyIndex);
  } else {
    rawMeta = await blockApi.query.bounties.bountyDescriptions(bountyIndex);
  }

  return rawMeta.toHuman();
}

module.exports = {
  getBountyDescription,
}
