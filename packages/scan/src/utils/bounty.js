const { getApi } = require("../api");
const { Modules } = require("./constants");
const {
  getBountyMeta: getBountyMetaFromStorage,
} = require("../events/treasury/bounty/utils");

async function getBountyMetaByBlockHeight(height, bountyIndex) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  return await getBountyMetaFromStorage(blockHash, bountyIndex);
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
  getBountyDescription,
  getBountyMetaByBlockHeight,
  isBountyModule,
};
