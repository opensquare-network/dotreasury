const { insertBounty } = require("../../../mongo/service/bounty");
const { getBountyDescription } = require("../../common/bounty/description");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  TimelineItemTypes,
  BountyMethods,
  BountyStatus,
} = require("../../common/constants")

async function handleProposed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(bountyIndex, indexer);
  const description = await getBountyDescription(bountyIndex, indexer,);

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
    state,
    timeline
  }

  await insertBounty(bountyObj);
}

module.exports = {
  handleProposed,
}
