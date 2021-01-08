const { getApi } = require("../api");

async function getBountyMeta(blockHash, bountyIndex) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(blockHash, bountyIndex);
  return meta.toJSON();
}

module.exports = {
  getBountyMeta,
};
