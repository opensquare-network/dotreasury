const { getApi } = require("./api");

let latestHeight = null;

async function subscribeChainHeight() {
  const api = await getApi();

  await new Promise((resolve) => {
    api.rpc.chain.subscribeFinalizedHeads((header) => {
      latestHeight = header.number.toNumber();
      resolve();
    });
  });
}

function getLatestHeight() {
  return latestHeight;
}

module.exports = {
  subscribeChainHeight,
  getLatestHeight,
};
