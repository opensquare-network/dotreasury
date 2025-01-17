const { updateChildBounty, updateChildBountyTimeline } = require("../../../mongo/service/childBounty");
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
const { getHeightBlockEvents } = require("../../../store/block");
const { isChildBountyFinished } = require("./common");

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
  const updates = {
    curator: author,
    deposit,
    state: {
      indexer,
      state: ChildBountyState.Active,
    }
  };
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: ChildBountiesMethods.acceptCurator,
    args: {
      curator: author,
      deposit,
    },
    indexer,
  };

  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);
  const blockEvents = getHeightBlockEvents(indexer.blockHeight);
  if (!meta && isChildBountyFinished(childBountyId, blockEvents)) {
    await updateChildBountyTimeline(childBountyId, timelineItem);
    return;
  }

  if (meta) {
    Object.assign(updates, { meta });
  }
  await updateChildBounty(childBountyId, updates, timelineItem);
}

module.exports = {
  handleAcceptCurator,
}
