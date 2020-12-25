const {
  getBountyTimelineCollection,
  getBountyCollection,
} = require("../mongo");
const { getApi } = require("../api");

async function saveNewBounty(bountyIndex, indexer) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(
    indexer.blockHash,
    bountyIndex
  );

  const bountyCol = await getBountyCollection();
  await bountyCol.insertOne({
    indexer,
    bountyIndex,
    meta: meta.toJSON(),
  });
}

async function saveBountyTimeline(bountyIndex, state, data, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(
    indexer.blockHash,
    bountyIndex
  );

  const bountyTimelineCol = await getBountyTimelineCollection();
  await bountyTimelineCol.insertOne({
    indexer,
    sort,
    bountyIndex,
    state,
    data,
    meta: meta.toJSON(),
  });
}

module.exports = {
  saveNewBounty,
  saveBountyTimeline,
};
