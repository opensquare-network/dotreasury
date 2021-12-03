const { getApi } = require("./api");
let blockApiMap = {};

function setBlockApi(blockHash, api) {
  blockApiMap[blockHash] = api
}

async function findBlockApi(blockHash) {
  const maybe = blockApiMap[blockHash];
  if (maybe) {
    return maybe;
  }

  const api = await getApi();
  const blockApi = await api.at(blockHash);

  setBlockApi(blockHash, blockApi);
  return blockApi;
}

module.exports = {
  findBlockApi,
}
