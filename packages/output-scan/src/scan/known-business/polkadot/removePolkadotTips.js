const {
  consts: { TimelineItemTypes, CHAINS },
  env: { currentChain },
} = require("@osn/scan-common");
const { updateAllTips } = require("../../../mongo/service/tip");

const knownHeight = 18407475;

async function removePolkadotTips(indexer) {
  if (knownHeight !== indexer.blockHeight || CHAINS.POLKADOT !== currentChain()) {
    return;
  }

  const state = {
    indexer,
    state: "Removed",
  };

  const timelineItem = {
    type: TimelineItemTypes.block,
    method: "Removed",
    args: {},
    indexer,
  };

  await updateAllTips({ state, isFinal: true }, timelineItem);
}

module.exports = {
  removePolkadotTips,
}
