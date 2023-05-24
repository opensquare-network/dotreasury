const { toDecimal128 } = require("../../../utils");
const { insertBounty } = require("../../../mongo/service/bounty");
const { getBountyDescription } = require("../../common/bounty/description");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  consts: {
    TimelineItemTypes,
    BountyMethods,
    BountyStatus,
  }
} = require("@osn/scan-common");

async function handleProposed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  const description = await getBountyDescription(indexer.blockHash, bountyIndex);

  const proposer = meta.proposer;
  const args = {
    proposer,
    value: meta.value,
    description,
  }

  const timeline = [
    {
      type: TimelineItemTypes.extrinsic,
      name: BountyMethods.proposeBounty,
      args,
      indexer,
    },
  ];

  const state = {
    indexer,
    state: BountyStatus.Proposed,
    data: event.data.toJSON(),
  }

  const bountyObj = {
    indexer,
    bountyIndex,
    description,
    meta,
    value: meta.value,
    dValue: toDecimal128(meta.value),
    state,
    timeline,
    motions: [],
  }

  await insertBounty(bountyObj);
}

module.exports = {
  handleProposed,
}
