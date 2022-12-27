const {
  getReferendaReferendumCol,
  getReferendaReferendumTimelineCol,
} = require("../mongo/data");
const { mongo: { known: { saveKnownHeights } } } = require("@osn/scan-common");

async function getReferendumHeights() {
  const col = await getReferendaReferendumCol();
  const referenda = await col.find({}).toArray();

  const heights = [];
  for (const referendum of referenda) {
    if (referendum.indexer?.blockHeight) {
      heights.push(referendum.indexer?.blockHeight);
    }
  }

  return [...new Set(heights)];
}

async function getTimelineHeights() {
  const col = await getReferendaReferendumTimelineCol();
  const items = await col.find({}).toArray();

  const heights = [];
  for (const item of items) {
    if (item.indexer?.blockHeight) {
      heights.push(item.indexer.blockHeight);
    }
  }

  return [...new Set(heights)];
}

async function saveGov2Heights() {
  const referendaHeights = await getReferendumHeights();
  await saveKnownHeights(referendaHeights);

  const timelineHeights = await getTimelineHeights();
  await saveKnownHeights(timelineHeights);
}

module.exports = {
  saveGov2Heights,
}
