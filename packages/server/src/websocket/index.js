const { chainStatusRoom, overviewRoom } = require("./constants");
const { getScanHeight, getOverview } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      socket.join(room);

      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(chainStatusRoom).emit("scanStatus", { height: scanHeight });
      } else if (room === overviewRoom) {
        const overview = getOverview();
        io.to(overviewRoom).emit("overview", overview);
      }
    });

    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });

  await feedScanStatus(io);
  await feedOverview(io);
}

module.exports = {
  listenAndEmitInfo,
};
