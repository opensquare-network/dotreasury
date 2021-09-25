const { findDecorated } = require("../../../mongo/service/specs");
const { getApi } = require("../../../api");

async function getReason(reasonHash, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  let key;
  if (decorated.query.treasury?.reasons) {
    key = [decorated.query.treasury.reasons, reasonHash];
  } else {
    key = [decorated.query.tips.reasons, reasonHash];
  }

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toHuman();
}

module.exports = {
  getReason,
}
