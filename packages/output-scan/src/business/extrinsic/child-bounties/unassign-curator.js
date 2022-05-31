const {
  consts: {
    Modules,
    ChildBountiesMethods,
    ChildBountyState,
    TimelineItemTypes,
  }
} = require("@osn/scan-common")
const { updateChildBounty } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");

async function handleUnassignChildBountyCurator(call, author, indexer) {
  if (
    ![Modules.ChildBounties].includes(call.section) ||
    ChildBountiesMethods.unassignCurator !== call.method
  ) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();

  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);

  const updates = {
    meta,
    curator: null,
    beneficiary: null,
    fee: null,
    unlockAt: null,
    state: {
      indexer,
      state: ChildBountyState.Added,
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: ChildBountiesMethods.unassignCurator,
    args: {},
    indexer,
  };

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleUnassignChildBountyCurator,
}
