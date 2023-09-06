const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function getChildBounty(parentBountyId, childBountyId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const bounty = await blockApi.query.childBounties.childBounties(parentBountyId, childBountyId);
  return bounty.toJSON();
}

async function getChildBountyDescriptions(childBountyId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const descriptions = await blockApi.query.childBounties.childBountyDescriptions(childBountyId);
  return descriptions.toHuman();
}

module.exports = {
  getChildBounty,
  getChildBountyDescriptions,
}
