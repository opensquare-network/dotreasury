const {
  getBountyCollection,
  getBountyStateCollection,
} = require("../../mongo");
const { getApi } = require("../../api");

function isBountyEvent(method) {
  return [
    "BountyProposed",
    "BountyRejected",
    "BountyBecameActive",
    "BountyAwarded",
    "BountyClaimed",
    "BountyCanceled",
    "BountyExtended",
  ].includes(method);
}

const isStateChange = isBountyEvent;

async function handleBountyEvent(method, jsonData, indexer, sort) {
  if (!isBountyEvent(method)) {
    return;
  }

  if (method === "BountyProposed") {
    const [bountyIndex] = jsonData;
    await saveNewBounty(bountyIndex, indexer);
  } else if (method === "BountyRejected") {
    const [bountyIndex, balance] = jsonData;
  } else if (method === "BountyBecameActive") {
    const [bountyIndex] = jsonData;
  } else if (method === "BountyAwarded") {
    const [bountyIndex, accountId] = jsonData;
  } else if (method === "BountyClaimed") {
    const [bountyIndex, balance, accountId] = jsonData;
  } else if (method === "BountyCanceled") {
    const [bountyIndex] = jsonData;
  } else if (method === "BountyExtended") {
    const [bountyIndex] = jsonData;
  }

  if (isStateChange(method)) {
    const bountyIndex = jsonData[0];
    const state = method;
    await saveBountyState(bountyIndex, state, indexer, sort);
  }
}

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

async function saveBountyState(bountyIndex, state, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(
    indexer.blockHash,
    bountyIndex
  );

  const bountyStateCol = await getBountyStateCollection();
  await bountyStateCol.insertOne({
    indexer,
    sort,
    bountyIndex,
    state,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleBountyEvent,
};
