const {
  Modules,
  BountyEvents,
} = require("../../common/constants");
const {
  handleProposed,
} = require("./proposed");

function isBountyEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    BountyEvents.hasOwnProperty(method)
  );
}

async function handleBountyEventWithExtrinsic(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isBountyEvent(section, method)) {
    return;
  }

  if (BountyEvents.BountyProposed === method) {
    await handleProposed(event, extrinsic, indexer);
  }

}

module.exports = {
  handleBountyEventWithExtrinsic,
}
