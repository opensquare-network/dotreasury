const { toDecimal128 } = require("../../../../utils");
const { findExtrinsicRealAuthor } = require("../../../common/extrinsic/author");
const { insertChildBounty } = require("../../../../mongo/service/childBounty");
const {
  consts: {
    ChildBountyState,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");
const { getChildBounty, getChildBountyDescriptions } = require("../../../common/child-bounties/child-bounty");
const { getValueAndDescriptionFromCall } = require("./description");

async function handleAdded(event, indexer, extrinsic, blockEvents) {
  const data = event.data.toJSON()
  const [parentBountyId, childBountyId] = data;

  const [meta, description] = await Promise.all([
    getChildBounty(parentBountyId, childBountyId, indexer),
    getChildBountyDescriptions(parentBountyId, childBountyId, indexer),
  ]);

  let childBountyValue = meta?.value;
  let childBountyDescription = description;
  let childBountyMeta = meta;
  if (!description && extrinsic) {
    const { value, description } = await getValueAndDescriptionFromCall(blockEvents, indexer, extrinsic, childBountyId);
    childBountyValue = value;
    childBountyDescription = description;
    if (!meta) {
      childBountyMeta = {
        parentBounty: parentBountyId,
        value: childBountyValue,
        fee: 0,
        curatorDeposit: 0,
        status: {
          added: null,
        },
      }
    }
  }

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
        value: childBountyValue,
        description: childBountyDescription,
      },
      indexer,
    },
  ];

  const bountyObj = {
    indexer,
    parentBountyId,
    proposer,
    index: childBountyId,
    value: childBountyValue,
    dValue: toDecimal128(childBountyValue),
    fee: childBountyMeta?.fee,
    curator: null,
    beneficiary: null,
    unlockAt: null,
    description: childBountyDescription,
    meta: childBountyMeta,
    state,
    timeline,
    isFinal: false,
  }

  await insertChildBounty(bountyObj);
}

module.exports = {
  handleAdded,
}
