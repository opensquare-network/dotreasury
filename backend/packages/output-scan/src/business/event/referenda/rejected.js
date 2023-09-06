const { gov2ReferendumState } = require("./common/state");
const { queryAndUpdateFinalInfo } = require("./common/final/queryAndUpdateFinalInfo");

async function handleRejected(event, indexer) {
  await queryAndUpdateFinalInfo(event, indexer, gov2ReferendumState.Rejected);
}

module.exports = {
  handleRejected,
}
