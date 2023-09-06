const { gov2ReferendumState } = require("./common/state");
const { queryAndUpdateFinalInfo } = require("./common/final/queryAndUpdateFinalInfo");

async function handleCancelled(event, indexer) {
  await queryAndUpdateFinalInfo(event, indexer, gov2ReferendumState.Cancelled);
}

module.exports = {
  handleCancelled,
}
