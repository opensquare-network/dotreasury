const { getProposalCollection } = require("../index");

async function insertProposal(proposalObj) {
  const col = await getProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

async function updateProposal(proposalIndex, updates, timelineItem, motionInfo) {
  const col = await getProposalCollection();
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (motionInfo) {
    update = {
      ...update,
      $push: { motions: motionInfo }
    }
  }

  await col.updateOne({ proposalIndex }, update);
}

module.exports = {
  insertProposal,
  updateProposal,
};
