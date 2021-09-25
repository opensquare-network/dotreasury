const { findDecorated } = require("../../../mongo/service/specs");
const { getApi } = require("../../../api");

async function getTipMeta(tipHash, { blockHeight, blockHash }) {
  const decorated = await findDecorated(blockHeight);
  let key;
  if (decorated.query.treasury?.tips) {
    key = [decorated.query.treasury.tips, tipHash];
  } else {
    key = [decorated.query.tips.tips, tipHash];
  }

  const api = await getApi();
  const rawMeta = await api.rpc.state.getStorage(key, blockHash);
  return rawMeta.toJSON();
}

module.exports = {
  getTipMeta,
}
