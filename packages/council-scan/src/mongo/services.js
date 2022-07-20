const { getTermsCollection } = require("./index");

async function insertNewTermData(indexer, data) {
  const col = await getTermsCollection();
  await col.insertOne({
    indexer,
    ...data,
  })
}

module.exports = {
  insertNewTermData,
}
