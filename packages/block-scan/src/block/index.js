const extractBlockTime = require('./extractBlockTime')
const { getBlockCollection } = require("../mongo");

async function handleBlock(block, blockEvents) {
  const hash = block.hash.toHex()
  const blockJson = block.toJSON()
  const blockTime = extractBlockTime(block.extrinsics)

  const blockCol = await getBlockCollection()
  const result = await blockCol.insertOne({
    hash,
    blockTime,
    eventsCount: (blockEvents || []).length,
    ...blockJson
  })

  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }
}

module.exports = {
  handleBlock
}
