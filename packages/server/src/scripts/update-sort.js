const dotenv = require("dotenv");
dotenv.config();

const { getBountyCollection, getChildBountyCollection } = require("../mongo");

function getBountyStateSort(state) {
  return (
    {
      CuratorProposed: 1,
      PendingPayout: 2,
      Active: 3,
      Approved: 4,
      Proposed: 5,
      Rejected: 6,
      Canceled: 6,
      Claimed: 6,
    }[state] || 1
  );
}

function getChildBountyStateSort(state) {
  return (
    {
      CuratorProposed: 1,
      PendingPayout: 2,
      Active: 3,
      Added: 4,
      Canceled: 5,
      Claimed: 5,
    }[state] || 1
  );
}

async function updateSort(col, isChildBounty = false) {
  const items = await col.find().toArray();
  for (const item of items) {
    const state = item.state?.state;
    const stateSort = isChildBounty
      ? getChildBountyStateSort(state)
      : getBountyStateSort(state);
    await col.updateOne({ _id: item._id }, { $set: { stateSort } });
  }
}

async function updateSortForChain() {
  console.log(`Update bounty sort of ${process.env.CHAIN}`);

  const bountyCol = await getBountyCollection();
  await updateSort(bountyCol, false);

  const childBountyCol = await getChildBountyCollection();
  await updateSort(childBountyCol, true);
}

async function main() {
  await updateSortForChain();
}

module.exports = main;
