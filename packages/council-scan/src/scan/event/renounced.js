const { getTermCouncilorCollection } = require("../../mongo");
const { getTermDuration } = require("../common/councilMembers");
const { upsertRenouncement } = require("../../mongo/services");
const { getSwitchedCouncilMembers } = require("../common/councilMembers");
const { isElectionModule } = require("./common");

async function handleRenounced(event, indexer) {
  const { section, method } = event;

  if (!isElectionModule(section) || "Renounced" !== method) {
    return
  }

  const {
    removedMembers,
    addedMembers,
  } = await getSwitchedCouncilMembers(indexer.blockHeight);
  await upsertRenouncement(indexer.blockHeight, addedMembers, removedMembers);

  const termDuration = await getTermDuration(indexer.blockHash);
  const termHeight = indexer.blockHeight - indexer.blockHeight % termDuration;
  const col = await getTermCouncilorCollection();
  for (const addedMember of addedMembers) {
    await col.update(
      {
        blockHeight: termHeight,
        address: addedMember,
      }, {
        "$set": {
          joinAt: indexer.blockHeight,
        }
      },
      { upsert: true },
    )
  }

  for (const removedMember of removedMembers) {
    await col.update(
      {
        blockHeight: termHeight,
        address: removedMember,
      }, {
        "$set": {
          renounceAt: indexer.blockHeight,
        }
      },
      { upsert: true },
    )
  }
}

module.exports = {
  handleRenounced,
}
