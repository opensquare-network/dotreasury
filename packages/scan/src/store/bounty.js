const { getBountyTimelineCollection } = require("../mongo");
const { getApi } = require("../api");

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
