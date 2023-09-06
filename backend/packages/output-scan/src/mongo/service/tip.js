const { getTipCollection } = require("../index");

async function insertTip(tip) {
  const tipCol = await getTipCollection();
  const {
    indexer: { blockHeight },
    hash,
  } = tip;
  const maybeInDb = await tipCol.findOne({
    "indexer.blockHeight": blockHeight,
    hash,
  });
  if (maybeInDb) {
    return;
  }

  await tipCol.insertOne(tip);
}

async function getActiveTipByHash(hash) {
  const tipCol = await getTipCollection();
  return await tipCol.findOne({ hash, isFinal: false });
}

async function updateTipByHash(hash, updates, timelineItem) {
  const tipCol = await getTipCollection();

  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  await tipCol.updateOne({ hash: hash, isFinal: false }, update);
}

module.exports = {
  insertTip,
  getActiveTipByHash,
  updateTipByHash,
}
