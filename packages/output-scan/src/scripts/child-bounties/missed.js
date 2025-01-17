require("dotenv").config();

const { getChildBountyCollection } = require("../../mongo");
const isNil = require("lodash.isnil");

(async () => {
  const col = await getChildBountyCollection();
  const bounties = await col.find(
    {},
    { projection: { _id: 0, index: 1 } }
  ).sort({ index: 1 }).toArray();

  let iter = null;
  let count = 0;
  for (const bounty of bounties) {
    const { index } = bounty;
    if (!isNil(iter) && index !== iter + 1) {
      console.error(`${iter + 1} missed`);
      count += 1;
    } else {
      // console.log(`${index} Ok`);
    }
    iter = index;
  }
  console.log(`Total ${count} missed`);

  process.exit(0);
})();
