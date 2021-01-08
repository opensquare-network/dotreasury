const { getApi } = require("../api");

async function getBountyMeta(blockHash, bountyIndex) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(blockHash, bountyIndex);
  return meta.toJSON();
}

async function getBountyDescription(blockHash, bountyIndex) {
  const api = await getApi();
  const description = await api.query.treasury.bountyDescriptions.at(
    blockHash,
    bountyIndex
  );
  return description.toHuman();
}

module.exports = {
  getBountyMeta,
  getBountyDescription,
};
