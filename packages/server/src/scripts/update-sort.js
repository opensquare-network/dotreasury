const dotenv = require("dotenv");
dotenv.config();

const { getBountyCollection, getChildBountyCollection } = require("../mongo");

function getStateSort(state) {
  switch (state) {
    case "CuratorProposed": {
      return 1;
    }
    case "PendingPayout": {
      return 2;
    }
    case "Active": {
      return 3;
    }
    case "Added":
    case "Proposed": {
      return 4;
    }
    case "Canceled":
    case "Rejected":
    case "Claimed": {
      return 5;
    }
    default: {
      return 6;
    }
  }
}

async function updateSort(col) {
  const items = await col.find().toArray();
  for (const item of items) {
    const stateSort = getStateSort(item.state?.state)
    await col.updateOne({ _id: item._id }, { $set: { stateSort } });
  }
}

async function updateSortForChain(chain) {
  const bountyCol = await getBountyCollection(chain);
  await updateSort(bountyCol);

  const childBountyCol = await getChildBountyCollection(chain);
  await updateSort(childBountyCol);
}

async function main() {
  await updateSortForChain("kusama");
  await updateSortForChain("polkadot");
}

main().finally(() => process.exit());
