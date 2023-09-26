const {
  chainStatusRoom,
  overviewRoom,
  overviewV2Room,
} = require("./constants");
const { getScanHeight, getOverview, getOverviewV2 } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview, feedOverviewV2 } = require("./overview");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (roomId) => {
      socket.join(roomId);

      if (roomId === chainStatusRoom) {
        const scanHeight = getScanHeight();
        socket.emit("scanStatus", { height: scanHeight });
      } else if (roomId === overviewRoom) {
        const overview = getOverview();
        socket.emit("overview", overview);
      } else if (roomId === overviewV2Room) {
        const overview = getOverviewV2();
        socket.emit("overview_v2", overview);
      }
    });

    socket.on("unsubscribe", (roomId) => {
      socket.leave(roomId);
    });
  });

  await feedScanStatus(io);
  await feedOverview(io);
  await feedOverviewV2(io);
}

module.exports = {
  listenAndEmitInfo,
};
