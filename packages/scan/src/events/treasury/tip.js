const { getTipCollection, getTipTimelineCollection } = require("../../mongo");
const { getApi } = require("../../api");
const { computeTipValue } = require("../../utils");

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
    await saveTipTimeline(hash, state, jsonData, indexer, sort);
  }
}

async function saveNewTip(hash, indexer) {
  const api = await getApi();
  let meta = await api.query.treasury.tips.at(indexer.blockHash, hash);
  meta = meta.toJSON();

  const medianValue = computeTipValue((meta && meta.tips) || []);

  const tipCol = await getTipCollection();
  await tipCol.insertOne({
    indexer,
    hash,
    medianValue,
    meta,
  });
}

async function saveTipTimeline(hash, state, data, indexer, sort) {
  const api = await getApi();
  let meta = await api.query.treasury.tips.at(indexer.blockHash, hash);
  meta = meta.toJSON();

  const tipTimelineCol = await getTipTimelineCollection();
  await tipTimelineCol.insertOne({
    indexer,
    sort,
    hash,
    state,
    data,
    meta,
  });

  let updates = {};
  if ("TipClosed" !== state && "TipRetracted" !== state) {
    const medianValue = computeTipValue((meta && meta.tips) || []);
    updates = { meta, medianValue };
  }

  const tipCol = await getTipCollection();
  await tipCol.updateOne(
    { hash },
    {
      $set: {
        ...updates,
        state: {
          indexer,
          state,
          data,
        },
      },
    }
  );
}

module.exports = {
  handleTipEvent,
};
