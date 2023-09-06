const { chain: { getApi, findBlockApi } } = require("@osn/scan-common");

async function getReferendumInfoFromStorage(referendumIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.referendumInfoOf(referendumIndex);
  return raw.toJSON();
}

async function getReferendumInfoByHeight(referendumIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return getReferendumInfoFromStorage(referendumIndex, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
};
