const { getStatusCollection } = require("../mongo");
const { chainStatusRoom, FEED_INTERVAL } = require("./constants");
const { setScanHeight } = require("./store");

async function feedScanStatus(io) {
  try {
    const col = await getStatusCollection();
    const arr = await col.find({}).toArray();
    const statusRow = arr.find((item) => item.name === "main-scan-height");

    if (statusRow) {
      io.to(chainStatusRoom).emit("scanStatus", { height: statusRow.value });
      setScanHeight(statusRow.value);
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
