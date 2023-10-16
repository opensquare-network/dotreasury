async function getLatestPrice(col) {
  const prices = await col.find({}).sort({ openTime: -1 }).limit(1).toArray()
  return prices[0];
}

module.exports = {
  getLatestPrice,
}
