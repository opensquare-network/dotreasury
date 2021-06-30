const { getApi } = require("../api");
const { Modules } = require("./constants");

async function getBountyMetaByBlockHeight(height, bountyIndex) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  return await getBountyMeta(blockHash, bountyIndex);
}

async function getBountyMeta(blockHash, bountyIndex) {
  const api = await getApi();
  const meta = await api.query.bounties.bounties.at(blockHash, bountyIndex);
  return meta.toJSON();
}

async function getBountyDescription(blockHash, bountyIndex) {
  const api = await getApi();
  const description = await api.query.bounties.bountyDescriptions.at(
    blockHash,
    bountyIndex
  );
  return description.toHuman();
}

function isBountyModule(section) {
  return [Modules.Treasury, Modules.Bounties].includes(section);
}

module.exports = {
  getBountyMeta,
  getBountyDescription,
  getBountyMetaByBlockHeight,
  isBountyModule,
};
