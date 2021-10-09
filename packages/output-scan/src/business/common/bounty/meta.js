const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../api");

async function getBountyMeta(bountyIndex, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  let key;
  if (decorated.query.bounties) {
    key = [decorated.query.bounties.bounties, bountyIndex];
  } else if (decorated.query.treasury.bounties) {
    key = [decorated.query.treasury.bounties, bountyIndex];
  } else {
    return null;
  }

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

module.exports = {
  getBountyMeta,
}
