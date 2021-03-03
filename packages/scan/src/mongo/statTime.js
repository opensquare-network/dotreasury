const { getStatusCollection } = require("./index");
const { asyncLocalStorage } = require("../utils");

const statusName = "last-stat-time";

async function getLastStatTime() {
  const statusCol = await getStatusCollection();
  const statInfo = await statusCol.findOne({ name: statusName });

  return statInfo?.value;
}

async function updateLastStatTime(statTime) {
  const session = asyncLocalStorage.getStore();
  const statusCol = await getStatusCollection();
  await statusCol.updateOne(
    { name: statusName },
    {
      $set: {
        value: statTime,
      },
    },
    { upsert: true, session }
  );
}

module.exports = {
  getLastStatTime,
  updateLastStatTime,
};
