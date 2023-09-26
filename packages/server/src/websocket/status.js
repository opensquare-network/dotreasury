const { getStatusCollection } = require("../mongo");
const { chainStatusRoom, FEED_INTERVAL } = require("./constants");
const { setScanHeight } = require("./store");

async function feedScanStatus(io) {
  try {
    const col = await getStatusCollection();
    const arr = await col.find({}).toArray();
    const statusRow = arr.find((item) => item.name === "income-scan");

    if (statusRow) {
      io.to(chainStatusRoom).emit("scanStatus", {
        height: statusRow.height,
      });
      setScanHeight(statusRow.height);
    }
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(feedScanStatus.bind(null, io), FEED_INTERVAL);
  }
}

module.exports = {
  feedScanStatus,
};
