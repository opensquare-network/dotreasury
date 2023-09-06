const { gov2ReferendumState } = require("./common/state");
const { queryAndUpdateFinalInfo } = require("./common/final/queryAndUpdateFinalInfo");

async function handleKilled(event, indexer) {
  await queryAndUpdateFinalInfo(event, indexer, gov2ReferendumState.Killed);
}

module.exports = {
  handleKilled,
}
