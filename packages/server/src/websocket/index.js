const { chainStatusRoom, overviewRoom } = require("./constants");
const { getScanHeight, getOverview } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      const roomId = `${room.chain}:${room.data}`;
      socket.join(roomId);

      if (room.data === chainStatusRoom) {
        const scanHeight = getScanHeight(room.chain);
        io.to(roomId).emit("scanStatus", { height: scanHeight });
      } else if (room.data === overviewRoom) {
        const overview = getOverview(room.chain);
        io.to(roomId).emit("overview", overview);
      }
    });

    socket.on("unsubscribe", (room) => {
      const roomId = `${room.chain}:${room.data}`;
      socket.leave(roomId);
    });
  });

  await feedScanStatus("kusama", io);
  await feedScanStatus("polkadot", io);
  await feedOverview("kusama", io);
  await feedOverview("polkadot", io);
}

module.exports = {
  listenAndEmitInfo,
};
