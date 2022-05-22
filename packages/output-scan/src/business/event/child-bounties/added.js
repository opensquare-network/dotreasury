const { insertChildBounty } = require("../../../mongo/service/childBounty");
const {
  ChildBountyState,
  TimelineItemTypes,
} = require("../../common/constants");
const { getChildBounty, getChildBountyDescriptions } = require("../../common/child-bounties/child-bounty");

async function handleAdded(event, indexer) {
  const data = event.data.toJSON()
  const [parentBountyId, childBountyId] = data;

  const [meta, description] = await Promise.all([
    getChildBounty(parentBountyId, childBountyId, indexer),
    getChildBountyDescriptions(childBountyId, indexer),
  ])

  const state = {
    indexer,
    state: ChildBountyState.Added,
    data: event.data.toJSON(),
  }

  const timeline = [
    {
      type: TimelineItemTypes.extrinsic,
      name: ChildBountyState.Added,
      args: {
        parentBountyId,
        childBountyId,
        value: meta?.value,
        description,
      },
      indexer,
    },
  ];

  const bountyObj = {
    indexer,
    parentBountyId,
    index: childBountyId,
    description,
    meta,
    state,
    timeline,
  }

  await insertChildBounty(bountyObj);
}

module.exports = {
  handleAdded,
}
