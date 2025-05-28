const { createApiForChain } = require("@osn/polkadot-api-container");
const { statusLogger } = require("../logger");
const { endpoints: defaultEndpoints } = require("./endpoints");

async function createChainApis(chainEndpoints = defaultEndpoints) {
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
};
