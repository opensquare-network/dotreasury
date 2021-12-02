const { getApi } = require("@dotreasury/common");

let latestHeight = null;

async function updateHeight() {
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
  updateHeight,
  getLatestHeight,
};
