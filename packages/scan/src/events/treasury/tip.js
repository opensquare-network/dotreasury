const { getTipCollection, getTipTimelineCollection } = require("../../mongo");
const { getApi } = require("../../api");

function isTipEvent(method) {
  return ["NewTip", "TipClosing", "TipClosed", "TipRetracted"].includes(method);
}

isStateChange = isTipEvent;

async function handleTipEvent(method, jsonData, indexer, sort) {
  if (!isTipEvent(method)) {
    return;
  }

  if (method === "NewTip") {
    const [hash] = jsonData;
    await saveNewTip(hash, indexer);
  } else if (method === "TipClosing") {
    const [hash] = jsonData;
  } else if (method === "TipClosed") {
    const [hash, accountId, balance] = jsonData;
  } else if (method === "TipRetracted") {
    const [hash] = jsonData;
  }

  if (isStateChange(method)) {
    const hash = jsonData[0];
    const state = method;
    await saveTipTimeline(hash, state, indexer, sort);
  }
}

async function saveNewTip(hash, indexer) {
  const api = await getApi();
  const meta = await api.query.treasury.tips.at(indexer.blockHash, hash);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer,
    hash,
    meta: meta.toJSON(),
  });
}

async function saveTipTimeline(hash, state, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.tips.at(indexer.blockHash, hash);

  const tipTimelineCol = await getTipTimelineCollection();
  await tipTimelineCol.insertOne({
    indexer,
    sort,
    hash,
    state,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleTipEvent,
};
