const { getApi } = require("../api");
const { getBlockCollection } = require("../mongo");

async function findNonForkHeight(nowHeight) {
  const api = await getApi();

  let trialHeight = nowHeight;
  let blockInDb = null;
  let chainHash = null;

  do {
    trialHeight -= 1;
    const blockCol = await getBlockCollection();
    blockInDb = await blockCol.findOne({ "header.number": trialHeight });
    chainHash = await api.rpc.chain.getBlockHash(trialHeight);
  } while (blockInDb.hash !== chainHash.toString());

  return trialHeight;
}

async function deleteDataFrom(blockHeight) {
  // TODO: delete the data been rolled back
}

module.exports = {
  findNonForkHeight,
  deleteDataFrom,
};
