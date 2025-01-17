const { extractChildBountiesAddCalls } = require("../../../common/call/childBounties/add");

function getChildBountyAddedEventIndex(blockEvents = [], extrinsicIndex, childBountyId) {
  const targetEvents = blockEvents.filter(e =>
    e.phase.value.toJSON() === extrinsicIndex &&
    e.event.section === "childBounties" &&
    e.event.method === "Added"
  );
  return targetEvents.findIndex(e => {
    if (e.event.data.length < 2 || !e.event.data[1].toNumber) {
      return false;
    }
    return e.event.data[1].toNumber() === childBountyId;
  });
}

async function getValueAndDescriptionFromCall(blockEvents, indexer, extrinsic, childBountyId) {
  const eventIndexInExtrinsic = getChildBountyAddedEventIndex(blockEvents, indexer.extrinsicIndex, childBountyId);
  const calls = await extractChildBountiesAddCalls(extrinsic.method, indexer);
  const call = calls[eventIndexInExtrinsic];
  if (!call) {
    return null;
  }

  const value = call.args[1].toJSON();
  const description = call.args[2].toHuman();
  return { value, description };
}

module.exports = {
  getValueAndDescriptionFromCall,
}
