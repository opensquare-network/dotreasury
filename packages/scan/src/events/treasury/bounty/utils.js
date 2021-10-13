const { findBlockApi } = require("../../../chain/spec");

async function getBountyMeta(blockHash, bountyIndex) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.bounties) {
    rawMeta = await blockApi.query.treasury?.bounties(bountyIndex);
  } else {
    rawMeta = await blockApi.query.bounties.bounties(bountyIndex);
  }

  return rawMeta.toJSON();
}

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
  getBountyMeta,
  getBountyDescription,
};
