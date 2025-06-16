const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function getChildBounty(parentBountyId, childBountyId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const bounty = await blockApi.query.childBounties.childBounties(parentBountyId, childBountyId);
  return bounty.toJSON();
}

async function getChildBountyDescriptions(parentBountyId, childBountyId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  let descriptions;
  if (blockApi.query.childBounties?.childBountyDescriptions) {
    descriptions = await blockApi.query.childBounties.childBountyDescriptions(childBountyId);
  } else if (blockApi.query.childBounties?.childBountyDescriptionsV1) {
    descriptions = await blockApi.query.childBounties.childBountyDescriptionsV1(parentBountyId, childBountyId);
  } else {
    return null;
  }
  return descriptions.toHuman();
}

module.exports = {
  getChildBounty,
  getChildBountyDescriptions,
}
