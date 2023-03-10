const { chainStatusRoom, overviewRoom, overviewV2Room } = require("./constants");
const { getScanHeight, getOverview, getOverviewV2 } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview, feedOverviewV2 } = require("./overview");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      const roomId = `${room?.chain}:${room?.data}`;
      socket.join(roomId);

      if (room?.data === chainStatusRoom) {
        const scanHeight = getScanHeight(room?.chain);
        io.to(roomId).emit("scanStatus", { height: scanHeight });
      } else if (room?.data === overviewRoom) {
        const overview = getOverview(room?.chain);
        io.to(roomId).emit("overview", overview);
      } else if (room?.data === overviewV2Room) {
        const overview = getOverviewV2(room?.chain);
        io.to(roomId).emit("overview_v2", overview);
      }
    });

    socket.on("unsubscribe", (room) => {
      const roomId = `${room?.chain}:${room?.data}`;
      socket.leave(roomId);
    });
  });

  await feedScanStatus("kusama", io);
  await feedScanStatus("polkadot", io);
  await feedOverview("kusama", io);
  await feedOverview("polkadot", io);
  await feedOverviewV2("kusama", io);
  await feedOverviewV2("polkadot", io);
}

module.exports = {
  listenAndEmitInfo,
};
