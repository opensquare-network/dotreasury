const { getApi } = require("../../api");
const { getTipStateCollection } = require("../../mongo");

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
    handleTipNew(args, indexer, events);
  } else if (name === "reportAwesome") {
    handleReportAwesome(args, indexer, events);
  } else if (name === "retractTip") {
    handleRetractTip(args, indexer, events);
  } else if (name === "tip") {
    handleTip(args, indexer, events);
  } else if (name === "closeTip") {
    handleCloseTip(args, indexer, events);
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

  await saveTipState(hash, "Tip", args, indexer);
}

async function handleCloseTip(args, indexer, events) {
  const { hash } = args;
}

async function saveTipState(hash, state, args, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.tips.at(indexer.blockHash, hash);

  const tipStateCol = await getTipStateCollection();
  await tipStateCol.insertOne({
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
