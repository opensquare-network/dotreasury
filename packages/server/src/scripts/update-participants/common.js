const { getParticipantCollection } = require("../../mongo");

async function saveParticipant(address, data) {
  const participantCol = await getParticipantCollection();
  await participantCol.updateOne({ address }, { $set: data }, { upsert: true });
}

module.exports = {
  saveParticipant,
};
