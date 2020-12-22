const { getApi } = require("../api");

let latestHeight = null;
let unsubscribeNewHead = null;

function getUnSubscribeNewHeadFunction() {
  return unsubscribeNewHead;
}

async function updateHeight() {
  const api = await getApi();

  unsubscribeNewHead = await api.rpc.chain.subscribeFinalizedHeads((header) => {
    latestHeight = header.number.toNumber();
    console.log(`latest finalized height: ${latestHeight}`);
  });
}

function getLatestHeight() {
  return latestHeight;
}

module.exports = {
  getUnSubscribeNewHeadFunction,
  updateHeight,
  getLatestHeight,
};
