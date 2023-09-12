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

      if (room?.data === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(roomId).emit("scanStatus", { height: scanHeight });
      } else if (room?.data === overviewRoom) {
        const overview = getOverview();
        io.to(roomId).emit("overview", overview);
      } else if (room?.data === overviewV2Room) {
        const overview = getOverviewV2();
        io.to(roomId).emit("overview_v2", overview);
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
