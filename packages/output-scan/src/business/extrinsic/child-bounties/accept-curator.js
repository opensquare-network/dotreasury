const { updateChildBounty } = require("../../../mongo/service/childBounty");
const { getChildBounty } = require("../../common/child-bounties/child-bounty");
const {
  consts: {
    Modules,
    ChildBountiesMethods,
    ChildBountyState,
    TimelineItemTypes,
    BalancesEvents,
  }
} = require("@osn/scan-common");

function getDeposit(wrappedEvents, curator) {
  const reservedEvent = wrappedEvents.events.find(({ event }) => {
    const { section, method } = event;
    if (Modules.Balances !== section || BalancesEvents.Reserved !== method) {
      return false
    }

    return event.data[0].toString() === curator;
  })

  if (!reservedEvent) {
    return 0;
  }

  return reservedEvent.event.data[1].toNumber();
}

async function handleAcceptCurator(call, author, indexer, wrappedEvents) {
  if (
    ![Modules.ChildBounties].includes(call.section) ||
    ChildBountiesMethods.acceptCurator !== call.method
  ) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();

  const deposit = getDeposit(wrappedEvents, author);
  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);

  const updates = {
    meta,
    curator: author,
    deposit,
    state: {
      indexer,
      state: ChildBountyState.Active,
    }
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: ChildBountiesMethods.acceptCurator,
    args: {
      curator: author,
      deposit,
    },
    indexer,
  };

  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleAcceptCurator,
}
