const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../api");

async function getBountyDescription(bountyIndex, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  let key;
  if (decorated.query.bounties) {
    key = [decorated.query.bounties.bountyDescriptions, bountyIndex];
  } else if (decorated.query.treasury.bountyDescriptions) {
    key = [decorated.query.treasury.bountyDescriptions, bountyIndex];
  } else {
    return null;
  }

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toHuman();
}

module.exports = {
  getBountyDescription,
}
