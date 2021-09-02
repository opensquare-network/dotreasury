const { expandMetadata } = require("@polkadot/types");

async function getBountyMeta(api, blockHash, bountyIndex) {
  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);
  let key;
  if (decorated.query.bounties) {
    key = [decorated.query.bounties.bounties, bountyIndex];
  } else if (decorated.query.treasury.bounties) {
    key = [decorated.query.treasury.bounties, bountyIndex];
  } else {
    return null;
  }

  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

async function getBountyDescription(api, blockHash, bountyIndex) {
  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);
  let key;
  if (decorated.query.bounties) {
    key = [decorated.query.bounties.bountyDescriptions, bountyIndex];
  } else if (decorated.query.treasury.bountyDescriptions) {
    key = [decorated.query.treasury.bountyDescriptions, bountyIndex];
  } else {
    return null;
  }

  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toHuman();
}

module.exports = {
  getBountyMeta,
  getBountyDescription,
};
