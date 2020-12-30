const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
} = require("../mongo");

async function deleteDataFrom(blockHeight) {
  await deleteBlocksFrom(blockHeight)
  await deleteExtrinsicsFrom(blockHeight)
  await deleteEventsFrom(blockHeight)
}

async function deleteBlocksFrom(blockHeight) {
  const blockCol = await getBlockCollection()
  await blockCol.deleteMany({ 'header.number': { $gte: blockHeight } })
}

async function deleteExtrinsicsFrom(blockHeight) {
  const col = await getExtrinsicCollection()
  await col.deleteMany({ 'indexer.blockHeight': { $gte: blockHeight } })
}

async function deleteEventsFrom(blockHeight) {
  const col = await getEventCollection()
  await col.deleteMany({ 'indexer.blockHeight': { $gte: blockHeight } })
}

module.exports = {
  deleteDataFrom,
}
