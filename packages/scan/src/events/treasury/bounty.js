const { saveNewBounty, saveBountyTimeline } = require("../../store/bounty");
const { BountyEvents } = require("../../utils/constants");

function isBountyEvent(method) {
  return BountyEvents.hasOwnProperty(method);
}

const isStateChange = isBountyEvent;

async function handleBountyEvent(method, jsonData, indexer, sort) {
  if (!isBountyEvent(method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    const [bountyIndex] = jsonData;
    await saveNewBounty(bountyIndex, indexer);
  }

  if (isStateChange(method)) {
    const bountyIndex = jsonData[0];
    const state = method;
    await saveBountyTimeline(bountyIndex, state, jsonData, indexer, sort);
  }
}

module.exports = {
  handleBountyEvent,
};
