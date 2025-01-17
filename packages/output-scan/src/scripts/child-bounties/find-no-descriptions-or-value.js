require("dotenv").config();
const { getChildBountyCollection } = require("../../mongo");

(async () => {
  const col = await getChildBountyCollection();
  const bounties = await col.find(
    {},
    { projection: { _id: 0 } }
  ).sort({ index: 1 }).toArray();

  const filteredBounties = bounties.filter((b) => !b.description);
  const indexesStr = filteredBounties.map(b => b.index).join(",");
  console.log(`No description bounties: ${indexesStr}`);

  process.exit(0);
})();
