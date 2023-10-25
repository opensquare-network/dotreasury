async function saveCoinGeckoKlines(col, klines) {
  if (!klines || klines?.length <= 0) {
    return
  }

  const bulk = col.initializeUnorderedBulkOp();
  for (const item of klines) {
    const [openTime, open] = item;

    bulk.insert({ openTime, open });
  }
  await bulk.execute();
}

module.exports = {
  saveCoinGeckoKlines,
}
