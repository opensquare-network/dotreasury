const { getChildBountyCollection } = require("../index");

async function insertChildBounty(childBountyObj = {}) {
  const { index } = childBountyObj;
  const col = await getChildBountyCollection();
  const maybeInDb = await col.findOne({ index });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(childBountyObj);
}

module.exports = {
  insertChildBounty,
}
