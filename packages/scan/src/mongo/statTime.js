const { getStatusCollection } = require("./index");

const statusName = "last-stat-time";

async function getLastStatTime() {
  const statusCol = await getStatusCollection();
  const statInfo = await statusCol.findOne({ name: statusName });

  return statInfo?.value;
}

async function updateLastStatTime(statTime) {
  const statusCol = await getStatusCollection();
  await statusCol.updateOne(
    { name: statusName },
    {
      $set: {
        value: statTime,
      },
    },
    { upsert: true }
  );
}

module.exports = {
  getLastStatTime,
  updateLastStatTime,
};
