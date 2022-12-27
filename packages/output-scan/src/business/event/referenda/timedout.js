const { gov2ReferendumState } = require("./common/state");
const { queryAndUpdateFinalInfo } = require("./common/final/queryAndUpdateFinalInfo");

async function handleTimedOut(event, indexer) {
  await queryAndUpdateFinalInfo(event, indexer, gov2ReferendumState.TimedOut);
}

module.exports = {
  handleTimedOut,
}
