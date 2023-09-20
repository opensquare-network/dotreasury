import io from "socket.io-client";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
const overviewRoom = "OVERVIEW_V2_ROOM";

const sockets = {};

export function connect(chain, { setHeight, setOverviewData }) {
  if (sockets[chain]) {
    sockets[chain].emit("unsubscribe", { chain, data: chainStatusRoom });
    sockets[chain].emit("unsubscribe", { chain, data: overviewRoom });
    sockets[chain].disconnect();
  }

  sockets[chain] = io(
    import.meta.env.VITE_APP_SOCKET_IO_URL || "api.dotreasury.com",
  );
  sockets[chain].connect();

  sockets[chain].on("connect", () => {
    sockets[chain].emit("subscribe", { chain, data: chainStatusRoom });
    sockets[chain].emit("subscribe", { chain, data: overviewRoom });

    sockets[chain].on("scanStatus", ({ height }) => {
      setHeight?.(height);
    });

    sockets[chain].on("overview_v2", (overview) => {
      setOverviewData?.(overview);
    });
  });
}
