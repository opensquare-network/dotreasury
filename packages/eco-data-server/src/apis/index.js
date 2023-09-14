const { createApiForChain } = require("@osn/polkadot-api-container");
const { statusLogger } = require("../logger");
const { endpoints: chainEndpoints } = require("./endpoints");

async function createChainApis() {
  const promises = [];
  for (const [chain, endpoints] of Object.entries(chainEndpoints)) {
    if ((endpoints || []).length > 0) {
      promises.push(createApiForChain(chain, endpoints, statusLogger));
    }
  }

  return Promise.all(promises);
}

module.exports = {
  createChainApis,
}
