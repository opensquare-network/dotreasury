const { hasPeriodMark, clearPeriodMark } = require("../../store");

async function handlePeriod(indexer) {
  if (!hasPeriodMark(indexer.blockHeight)) {
    return
  }

  // todo: calc statistics data in this period and save it to database

  clearPeriodMark(indexer.blockHeight);
}

module.exports = {
  handlePeriod,
}
