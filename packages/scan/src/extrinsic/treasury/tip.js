const { getApi } = require("../../api");
const { getTipTimelineCollection } = require("../../mongo");

async function handleTipExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== "treasury") {
    return;
  }

  if (!isSuccess) {
    return;
  }

  // Tip methods
  if (name === "tipNew") {
    await handleTipNew(args, indexer, events);
  } else if (name === "reportAwesome") {
    await handleReportAwesome(args, indexer, events);
  } else if (name === "retractTip") {
    await handleRetractTip(args, indexer, events);
  } else if (name === "tip") {
    await handleTip(args, indexer, events);
  } else if (name === "closeTip") {
    await handleCloseTip(args, indexer, events);
  }
}

async function handleTipNew(args, indexer, events) {
  const { reason, who, tip_value: tipValue } = args;

  for (let sort = 0; sort < events.length; sort++) {
    const { event } = events[sort];
    const method = event.method;
    const data = event.data.toJSON();

    if (method === "NewTip") {
      const [hash] = data;
    }
  }
}

async function handleReportAwesome(args, indexer, events) {
  const { reason, who } = args;
}

async function handleRetractTip(args, indexer, events) {
  const { hash } = args;
}

async function handleTip(args, indexer, events) {
  const { hash, tip_value: tipValue } = args;

  await saveTipTimeline(hash, "Tip", args, indexer);
}

async function handleCloseTip(args, indexer, events) {
  const { hash } = args;
}

async function saveTipTimeline(hash, state, args, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.tips.at(indexer.blockHash, hash);

  const tipTimelineCol = await getTipTimelineCollection();
  await tipTimelineCol.insertOne({
    indexer,
    sort,
    hash,
    args,
    state,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleTipExtrinsic,
};
