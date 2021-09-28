const { getApi } = require("../../api");

async function getBlockHash(height) {
  const api = await getApi();
  return await api.rpc.chain.getBlockHash(height);
}

module.exports = {
  getBlockHash,
};
