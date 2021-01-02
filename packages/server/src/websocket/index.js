const { chainStatusRoom } = require("./constants");
const { getScanHeight } = require("./store");
const { feedScanStatus } = require("./status");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(chainStatusRoom).emit("scanStatus", { height: scanHeight });
      }

      socket.join(room);
    });

    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });
  });

  await feedScanStatus(io);
}

module.exports = {
  listenAndEmitInfo,
};
