const { toDecimal128 } = require("../../../utils");
const { findExtrinsicRealAuthor } = require("../../common/extrinsic/author");
const { insertChildBounty } = require("../../../mongo/service/childBounty");
const {
  consts: {
    ChildBountyState,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");
const { getChildBounty, getChildBountyDescriptions } = require("../../common/child-bounties/child-bounty");

async function handleAdded(event, indexer, extrinsic) {
  const data = event.data.toJSON()
  const [parentBountyId, childBountyId] = data;

  const [meta, description] = await Promise.all([
    getChildBounty(parentBountyId, childBountyId, indexer),
    getChildBountyDescriptions(childBountyId, indexer),
  ])

  const proposer = await findExtrinsicRealAuthor(extrinsic, indexer);

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
    proposer,
    index: childBountyId,
    value: meta?.value,
    dValue: toDecimal128(meta?.value),
    fee: meta?.fee,
    curator: null,
    beneficiary: null,
    unlockAt: null,
    description,
    meta,
    state,
    timeline,
    isFinal: false,
  }

  await insertChildBounty(bountyObj);
}

module.exports = {
  handleAdded,
}
